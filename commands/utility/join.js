const { joinVoiceChannel, VoiceConnectionStatus, entersState, createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const {SlashCommandBuilder, VoiceState} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join MusicBOT to your channel!'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Joining...', fetchReply: true });
        const sender = interaction.member;
        const channel = sender.voice.channel;
        if (!channel) {
            await interaction.editReply('You need to join a voice channel first!');
            return;
        }
        await interaction.editReply(`Joining ${channel.name}...`);
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        await interaction.editReply(`Joined ${channel.name}!`);

        connection.on(VoiceConnectionStatus.Ready, () => {
            interaction.editReply(`Ready to play music in ${channel.name}!`);
        });

    },
}
