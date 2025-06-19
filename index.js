const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { getBots, getBot } = require("./services/recall");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/bots", async (req, res) => {
  try {
    const bots = await getBots();
    res.json(bots);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching bot data");
  }
});

app.get("/api/bot/:botId", async (req, res) => {
  try {
    const { botId } = req.params;
    const bot = await getBot(botId);
    res.json(bot);
  } catch (error) {
    console.error("Error fetching single bot data:", error);
    res.status(500).send("Error fetching bot data");
  }
});

app.get("/meeting/:botId", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "meeting.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "meetings.html"));
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
