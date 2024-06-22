const {queues, playSong} = require("./play");
const {getVoiceConnection} = require("@discordjs/voice");
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stopbot')
        .setDescription('Stop the bot!'),
    async execute(interaction) {
        const sender = interaction.member;
        if (sender.id !== '469502255750447105') {
            await interaction.reply('You are not allowed to use this command!');
            return;
        }
        await interaction.reply('Stopping the bot!');
        process.exit(0);
    },
}
