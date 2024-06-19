const {SlashCommandBuilder} = require("discord.js");
const {
    createAudioResource,
    createAudioPlayer,
    getVoiceConnection
} = require("@discordjs/voice");
const ytdl = require('@distube/ytdl-core');

const queues = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .addStringOption(option => option.setName('song').setDescription('The song you want to play!').setRequired(true))
        .setDescription('Play music from MusicBOT!'),
    async execute(interaction) {
        const sent = await interaction.reply({content: 'Searching song...', fetchReply: true});
        const sender = interaction.member;
        const channel = sender.voice.channel;
        if (!channel) {
            await interaction.editReply('You need to join a voice channel first!');
            return;
        }
        const connection = getVoiceConnection(channel.guild.id);

        // Get or create the song queue for the guild
        let queue = queues[channel.guild.id];
        if (!queue) {
            queue = [];
            queues[channel.guild.id] = queue;
        }

        let songDetails = {};

        ytdl.getBasicInfo(interaction.options.getString('song')).then(info => {
            songDetails = {
                id: info.videoDetails.videoId,
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                length: info.videoDetails.lengthSeconds,
            }
        }).then(() => {
            queue.push({details: songDetails, interaction: interaction});
            interaction.editReply(`Added ${songDetails.title}, (${songDetails.author}) to the queue!`);
            if (queue.length === 1) {
                playSong(channel.guild.id);
            }
        }).catch(error => {
            console.error(`Error occurred while downloading or playing the song: ${error}`);
        });
    },
    queues: queues
}

function playSong(guildId) {
    const queue = queues[guildId];
    if (!queue) {
        return;
    }

    const song = queue[0];
    if (!song) {
        return;
    }

    const connection = getVoiceConnection(guildId);
    if (!connection) {
        return;
    }

    const player = createAudioPlayer();
    const resource = createAudioResource(`tracks/${song.details.id}.mp3`);
    song.interaction.editReply(`Playing ${song.details.title}, (${song.details.author})...`);
    player.play(resource);
    connection.subscribe(player);

    player.on('error', error => {
        console.error(`Error occurred while playing the song: ${error}`);
    });

    player.on('idle', () => {
        queue.shift();
        if (queue.length > 0) {
            playSong(guildId);
        }
    });
}
