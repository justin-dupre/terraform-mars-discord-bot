// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Gets the win rate of a corporation"),
};
