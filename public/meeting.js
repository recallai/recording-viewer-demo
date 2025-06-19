document.addEventListener("DOMContentLoaded", () => {
  const meetingTitle = document.getElementById("meeting-title");
  const meetingDate = document.getElementById("meeting-date");
  const participantCount = document.getElementById("participant-count");
  const recordingDuration = document.getElementById("recording-duration");
  const copyTimestampBtn = document.getElementById("copy-timestamp-btn");
  const video = document.getElementById("meeting-video");
  const transcriptContent = document.getElementById("transcript-content");

  copyTimestampBtn.addEventListener("click", () => {
    const currentTime = Math.floor(video.currentTime);
    const url = new URL(window.location);
    url.searchParams.set("t", currentTime);

    navigator.clipboard.writeText(url.href).then(
      () => {
        const originalText = "Link to this Moment";
        copyTimestampBtn.textContent = "Copied!";
        setTimeout(() => {
          copyTimestampBtn.textContent = originalText;
        }, 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  });

  const getBotIdFromUrl = () => {
    const path = window.location.pathname;
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  const fetchMeetingData = async (botId) => {
    try {
      const response = await fetch(`/api/bot/${botId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      displayMeetingData(data);
    } catch (error) {
      console.error("Failed to fetch meeting data:", error);
      transcriptContent.innerHTML = `<p>Error loading meeting data. Please try again later.</p>`;
    }
  };

  const displayMeetingData = (data) => {
    meetingTitle.textContent = data.meetingTitle || "Meeting Recording";
    const meetingStart = new Date(data.joinAt).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });
    meetingDate.textContent = meetingStart;

    if (data.numParticipants) {
      participantCount.textContent = `${data.numParticipants} participants`;
    }

    if (data.videoUrl) {
      video.src = data.videoUrl;
    } else {
      console.warn("Video URL not found in bot data.");
      video.style.display = "none";
    }

    // Render the transcript data
    const transcriptData = data.transcript;
    if (transcriptData?.length > 0) {
      transcriptContent.innerHTML = "";
      transcriptData.forEach((segment) => {
        if (!segment.words || segment.words.length === 0) return;

        const segmentDiv = document.createElement("div");
        segmentDiv.className = "transcript-segment";

        const startTimeInSeconds = segment.words[0].start_timestamp;
        const startTimeFormatted = formatTimestamp(startTimeInSeconds);

        segmentDiv.addEventListener("click", () => {
          video.currentTime = startTimeInSeconds;
        });

        const speakerP = document.createElement("p");
        speakerP.className = "transcript-speaker";
        speakerP.innerHTML = `<span>${
          segment.speaker || "Unknown Speaker"
        }</span> <span class="transcript-timestamp">${startTimeFormatted}</span>`;
        segmentDiv.appendChild(speakerP);

        const wordsP = document.createElement("p");
        wordsP.className = "transcript-words";
        wordsP.textContent = segment.words.map((w) => w.text).join(" ");
        segmentDiv.appendChild(wordsP);

        transcriptContent.appendChild(segmentDiv);
      });
    } else {
      transcriptContent.innerHTML = "<p>No transcript available.</p>";
    }
  };

  video.addEventListener("loadedmetadata", () => {
    if (video.duration) {
      recordingDuration.textContent = formatDuration(video.duration);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const time = urlParams.get("t");
    if (time) {
      video.currentTime = parseFloat(time);
    }
  });

  const formatTimestamp = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours === 0 && minutes === 0) {
      return "Less than a minute";
    }

    const parts = [];
    if (hours > 0) {
      parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    }

    return parts.join(" ");
  };

  const botId = getBotIdFromUrl();
  if (botId) {
    fetchMeetingData(botId);
  } else {
    console.error("No bot ID found in URL");
    transcriptContent.innerHTML = `<p>Could not find a bot ID in the URL.</p>`;
  }
});
