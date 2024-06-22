const {queues, playSong} = require("./play");
const {getVoiceConnection} = require("@discordjs/voice");
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song!'),
    async execute(interaction) {
        const sender = interaction.member;
        const channel = sender.voice.channel;
        if (!channel) {
            await interaction.reply('You need to join a voice channel first!');
            return;
        }
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) {
            await interaction.reply('Bot is not in a voice channel!');
            return;
        }

        const player = connection.state.subscription.player;
        if (!player) {
            await interaction.reply('No song is currently playing!');
            return;
        }

        const queue = queues[channel.guild.id];
        if (!queue || queue.length === 0) {
            await interaction.reply('There are no songs to skip!');
            return;
        }

        queue.shift();
        player.stop();
        playSong(channel.guild.id);
        await interaction.reply('Skipped!');
    },
}
