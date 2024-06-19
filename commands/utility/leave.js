const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Kick MusicBOT form channel!'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Leaving... :cry:', fetchReply: true });
        const sender = interaction.member;
        const channel = sender.voice.channel;
        if (!channel) {
            await interaction.editReply('You need to join a voice channel first!');
            return;
        }
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) {
            await interaction.editReply('Bot is not in a voice channel!');
            return;
        }

        connection.destroy();
    },
}
