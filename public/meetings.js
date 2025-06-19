document.addEventListener("DOMContentLoaded", () => {
  const botListContainer = document.getElementById("bot-list");

  const fetchAndDisplayBots = async () => {
    try {
      const response = await fetch("/api/bots");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const bots = await response.json();

      botListContainer.innerHTML = "";

      if (bots.length === 0) {
        botListContainer.innerHTML = "<p>No active bots found.</p>";
        return;
      }

      bots.forEach((bot) => {
        const listItem = document.createElement("li");
        listItem.className = "bot-item";
        listItem.dataset.botId = bot.id;

        const createdDate = new Date(bot.joinAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        listItem.innerHTML = `
          <h2>${bot.meetingTitle || "Unnamed Meeting"}</h2>
          <p><strong>Created:</strong> ${createdDate}</p>
          <p><strong>Platform:</strong> ${bot.platform || "N/A"}</p>
        `;

        listItem.addEventListener("click", () => {
          window.location.href = `/meeting/${bot.id}`;
        });

        botListContainer.appendChild(listItem);
      });
    } catch (error) {
      console.error("Failed to fetch bots:", error);
      botListContainer.innerHTML =
        "<p>Error loading bots. Please try again later.</p>";
    }
  };

  fetchAndDisplayBots();
});
