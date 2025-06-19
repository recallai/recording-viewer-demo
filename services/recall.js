const axios = require("axios");

const formatPlatformName = (platform) => {
  if (!platform) return "Unknown";
  return platform
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getBots = async () => {
  const url = "https://us-east-1.recall.ai/api/v1/bot/";
  const apiKey = process.env.RECALL_API_KEY;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  });

  const bots = response.data.results;
  const botsData = bots.map((bot) => ({
    botName: bot.bot_name,
    joinAt: bot.join_at,
    platform: formatPlatformName(bot.meeting_url?.platform),
    meetingTitle:
      bot.meeting_url?.platform === "zoom" ? bot.meeting_metadata?.title : null,
    id: bot.id,
  }));

  return botsData;
};

const getBot = async (botId) => {
  const url = `https://us-east-1.recall.ai/api/v1/bot/${botId}/`;
  const apiKey = process.env.RECALL_API_KEY;

  const response = await axios.get(url, {
    headers: { Authorization: `Token ${apiKey}` },
  });

  const bot = response.data;

  const recording = bot.recordings?.[0];
  const videoUrl = recording?.media_shortcuts?.video_mixed?.data?.download_url;
  const transcriptUrl =
    recording?.media_shortcuts?.transcript?.data?.download_url;

  let transcript = [];
  if (transcriptUrl) {
    try {
      const transcriptResponse = await axios.get(transcriptUrl);
      transcript = transcriptResponse.data;
    } catch (error) {
      console.error("Failed to fetch transcript, returning empty.", error);
    }
  }

  const numParticipants = bot.meeting_participants?.length || 0;

  const botData = {
    id: bot.id,
    botName: bot.bot_name,
    joinAt: bot.join_at,
    meetingTitle:
      bot.meeting_url?.platform === "zoom" ? bot.meeting_metadata?.title : null,
    hasRecording: !!recording,
    videoUrl: videoUrl || null,
    transcript: transcript,
    numParticipants: numParticipants,
  };

  return botData;
};

module.exports = { getBots, getBot };
