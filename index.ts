import {
  ActionRowBuilder,
  Client as DiscordClient,
  GatewayIntentBits,
  Interaction,
  SelectMenuBuilder,
} from "discord.js";
import { Client as PostgresClient } from "pg";
import dotenv from "dotenv";
import {
  GET_CORP_TOTAL_WINS,
  GET_TOTAL_GAMES_PLAYED_BY_CORP_QUERY,
} from "./queries";
import { createCorpSelectOptions } from "./corps";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

dotenv.config();

const discordClient = new DiscordClient({
  intents: [GatewayIntentBits.Guilds],
});
const pgClient = new PostgresClient({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: true,
});

discordClient.on("ready", async () => {
  await pgClient.connect();
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("interactionCreate", async (interaction) => {
  if (interaction.toJSON()?.customId === "selectedCorp") {
    const corpName = interaction.toJSON()?.values[0];
    const totalGamesWonByCorpResult = await pgClient.query(
      GET_CORP_TOTAL_WINS(corpName)
    );
    const corpWins = totalGamesWonByCorpResult.rows[0]?.count ?? 0;

    const totalGamesQueryResult = await pgClient.query(
      GET_TOTAL_GAMES_PLAYED_BY_CORP_QUERY(corpName)
    );
    const totalGamesPlayedByCorp = totalGamesQueryResult.rows[0]?.count ?? 0;
    if (totalGamesPlayedByCorp === 0) {
      await interaction.reply(`No games played by ${corpName}`);
      return;
    }

    console.log(corpWins, totalGamesPlayedByCorp);

    await interaction.reply(
      `${corpName} has a ${((corpWins / totalGamesPlayedByCorp) * 100).toFixed(
        2
      )}% win rate with ${totalGamesPlayedByCorp} games played`
    );
  }
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "get-corp-win-rate") {
    console.log(createCorpSelectOptions());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = new ActionRowBuilder<any>().addComponents(
      new SelectMenuBuilder()
        .setCustomId("selectedCorp")
        .setPlaceholder("Select a corp")
        .addOptions(createCorpSelectOptions())
    );

    await interaction.reply({ components: [row] });
  }
});

discordClient.login(process.env.DISCORD_TOKEN);
