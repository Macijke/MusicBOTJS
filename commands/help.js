const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help about me!"),
    async execute (interaction) {
        await interaction.reply(`/ping - Ping BOT!`);
    },
};