import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import { Client as PostgresClient } from "pg";
import dotenv from "dotenv";
import { GameResult, Score } from "./types";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

dotenv.config({ path: __dirname + "/.env" });

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
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    pgClient.query<GameResult>(
      "SELECT * from game_results",
      async (err, res) => {
        if (err) throw err;
        const winnerOfEachGame = getWinnerOfEachGame(res.rows, res.rowCount);
        const results = getWinsByCorps(winnerOfEachGame);
        await interaction.reply(results);
        pgClient.end();
      }
    );
  }
});

discordClient.login(process.env.DISCORD_TOKEN);

const getWinnerOfEachGame = (rows: GameResult[], rowCount: number): Score[] => {
  const res: Score[] = [];
  for (let i = 0; i < rowCount; i++) {
    const scores: Score[] = JSON.parse(rows[i].scores);
    const max = scores.reduce(function (prev, current) {
      return prev.playerScore > current.playerScore ? prev : current;
    });

    res.push(max);
  }
  return res;
};

const getWinsByCorps = (scores: Score[]) => {
  const sortedScores = scores.sort((a, b) => a.playerScore - b.playerScore);
  const count = {};
  sortedScores.forEach((score) => {
    const { corporation } = score;
    // eslint-disable-next-line no-prototype-builtins
    if (count.hasOwnProperty(corporation)) {
      count[corporation] = count[corporation] + 1;
    } else {
      count[corporation] = 1;
    }
  });

  let formattedString = "";
  for (const key of Object.keys(count)) {
    formattedString += `${key}: ${count[key]}\n`;
  }

  return formattedString;
};
