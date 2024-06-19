const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const {queues} = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Get the current music queue!'),
    async execute(interaction) {
        const sender = interaction.member;
        const channel = sender.voice.channel;
        if (!channel) {
            await interaction.reply('You need to join a voice channel first!');
            return;
        }
        const queue = queues[channel.guild.id];
        if (!queue || queue.length === 0) {
            await interaction.reply('The queue is currently empty!');
            return;
        }
        let queueInfo = 'Here is the current queue:\n';
        for (let i = 0; i < queue.length; i++) {
            const song = queue[i].details;
            const minutes = Math.floor(song.length / 60);
            const seconds = song.length % 60;
            queueInfo += `${i + 1}. ${song.title} by ${song.author} (${minutes}:${seconds < 10 ? '0' : ''}${seconds})\n`;
        }
        await interaction.reply(queueInfo);
    },
}
