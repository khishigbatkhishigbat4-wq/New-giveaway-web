
"use strict";

// GiftDrop: local demo only.
// Entries are stored in this browser, not on a server.

const gifts = [
  {
    name: "Google Play",
    category: "Apps",
    icon: "▶️",
    description: "Apps, games, books, and more."
  },
  {
    name: "Roblox",
    category: "Gaming",
    icon: "🎮",
    description: "Roblox credit and Robux."
  },
  {
    name: "Steam",
    category: "Gaming",
    icon: "🖥️",
    description: "PC games and digital content."
  },
  {
    name: "Xbox",
    category: "Gaming",
    icon: "🟢",
    description: "Xbox games and subscriptions."
  },
  {
    name: "PlayStation",
    category: "Gaming",
    icon: "🎮",
    description: "PlayStation Store credit."
  },
  {
    name: "Nintendo eShop",
    category: "Gaming",
    icon: "🕹️",
    description: "Nintendo games and downloads."
  },
  {
    name: "Apple",
    category: "Apps",
    icon: "🍎",
    description: "Eligible Apple digital purchases."
  },
  {
    name: "Amazon",
    category: "Shopping",
    icon: "📦",
    description: "Shop for eligible products."
  },
  {
    name: "Google Play Movies",
    category: "Entertainment",
    icon: "🎬",
    description: "Entertainment-related gift ideas."
  },
  {
    name: "Netflix",
    category: "Entertainment",
    icon: "🍿",
    description: "Streaming gift card availability varies."
  },
  {
    name: "Spotify",
    category: "Entertainment",
    icon: "🎵",
    description: "Music subscription gift cards."
  },
  {
    name: "Disney+",
    category: "Entertainment",
    icon: "✨",
    description: "Streaming gift options where available."
  },
  {
    name: "Walmart",
    category: "Shopping",
    icon: "🛒",
    description: "Shopping gift card."
  },
  {
    name: "Target",
    category: "Shopping",
    icon: "🎯",
    description: "Shopping gift card."
  },
  {
    name: "Uber",
    category: "Shopping",
    icon: "🚗",
    description: "Eligible rides and services."
  },
  {
    name: "Uber Eats",
    category: "Shopping",
    icon: "🍔",
    description: "Food delivery gift options."
  }
];

const STORAGE_KEY = "giftdrop_demo_entries_v1";

const grid = document.getElementById("gift-grid");
const filters = document.getElementById("filters");
const prizeSelect = document.getElementById("prize");
const drawSelect = document.getElementById("draw-prize");
const entryForm = document.getElementById("entry-form");
const nicknameInput = document.getElementById("nickname");
const entryMessage = document.getElementById("entry-message");
const entryCount = document.getElementById("entry-count");
const cardCount = document.getElementById("card-count");
const drawButton = document.getElementById("draw-button");
const winnerResult = document.getElementById("winner-result");
const showEntriesButton = document.getElementById("show-entries");
const entriesList = document.getElementById("entries-list");
const resetButton = document.getElementById("reset-button");

let activeCategory = "All";
let entries = loadEntries();

// Read saved demo entries safely.
function loadEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(item =>
      item &&
      typeof item.nickname === "string" &&
      typeof item.prize === "string" &&
      gifts.some(gift => gift.name === item.prize)
    );
  } catch (error) {
    return [];
  }
}

// Save only demo entries in this browser.
function saveEntries() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    return false;
  }
}

// Build the gift card display.
function renderGifts() {
  const visibleGifts = gifts.filter(gift =>
    activeCategory === "All" ||
    gift.category === activeCategory
  );

  grid.replaceChildren();
  cardCount.textContent = `${visibleGifts.length} cards`;

  visibleGifts.forEach(gift => {
    const card = document.createElement("article");
    card.className = "gift-card";

    const icon = document.createElement("div");
    icon.className = "card-icon";
    icon.textContent = gift.icon;

    const category = document.createElement("span");
    category.className = "category-label";
    category.textContent = gift.category;

    const title = document.createElement("h3");
    title.textContent = gift.name;

    const description = document.createElement("p");
    description.className = "card-description";
    description.textContent = gift.description;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "card-button";
    button.textContent = "Enter demo →";
    button.addEventListener("click", () => {
      prizeSelect.value = gift.name;
      document.getElementById("enter").scrollIntoView({
        behavior: "smooth"
      });
      nicknameInput.focus({ preventScroll: true });
    });

    card.append(icon, category, title, description, button);
    grid.appendChild(card);
  });
}

// Fill both prize dropdown menus.
function renderPrizeOptions() {
  [prizeSelect, drawSelect].forEach(select => {
    gifts.forEach(gift => {
      const option = document.createElement("option");
      option.value = gift.name;
      option.textContent = `${gift.icon} ${gift.name}`;
      select.appendChild(option);
    });
  });
}

// Category filter buttons.
filters.addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  filters.querySelectorAll(".filter").forEach(item => {
    const selected = item === button;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });

  renderGifts();
});

// Display a message.
function showMessage(message, type) {
  entryMessage.textContent = message;
  entryMessage.className = `message ${type}`;
}

// Add an entry to the local demo.
entryForm.addEventListener("submit", event => {
  event.preventDefault();

  const nickname = nicknameInput.value.trim();
  const prize = prizeSelect.value;

  if (nickname.length < 2 || nickname.length > 20) {
    showMessage("Use a nickname between 2 and 20 characters.", "error");
    return;
  }

  if (!prize || !gifts.some(gift => gift.name === prize)) {
    showMessage("Please choose a gift card.", "error");
    return;
  }

  const duplicate = entries.some(entry =>
    entry.prize === prize &&
    entry.nickname.toLowerCase() === nickname.toLowerCase()
  );

  if (duplicate) {
    showMessage("That nickname already entered this demo prize.", "error");
    return;
  }

  entries.push({
    nickname,
    prize,
    id: `${Date.now()}-${Math.random()}`
  });

  if (!saveEntries()) {
    entries.pop();
    showMessage(
      "Browser storage is unavailable. Try another browser.",
      "error"
    );
    return;
  }

  showMessage(`🎉 ${nickname}, your demo entry was added!`, "success");
  entryForm.reset();
  updateEntrySummary();
  renderEntries();
  winnerResult.replaceChildren();

  const resultText = document.createElement("p");
  resultText.textContent = "No winner picked yet.";
  const resultIcon = document.createElement("span");
  resultIcon.textContent = "🏆";
  winnerResult.append(resultIcon, resultText);
});

// Count entries.
function updateEntrySummary() {
  entryCount.textContent = entries.length;
}

// Display entries without inserting user text as HTML.
function renderEntries() {
  entriesList.replaceChildren();

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No demo entries yet.";
    entriesList.appendChild(empty);
    return;
  }

  entries.forEach(entry => {
    const row = document.createElement("div");
    row.className = "entry-item";

    const nickname = document.createElement("span");
    nickname.textContent = entry.nickname;

    const prize = document.createElement("small");
    prize.textContent = entry.prize;

    row.append(nickname, prize);
    entriesList.appendChild(row);
  });
}

showEntriesButton.addEventListener("click", () => {
  const isHidden = entriesList.hidden;
  entriesList.hidden = !isHidden;
  showEntriesButton.textContent = isHidden
    ? "Hide demo entries"
    : "Show demo entries";

  renderEntries();
});

// Pick a random entry for the selected prize.
drawButton.addEventListener("click", () => {
  const prize = drawSelect.value;

  if (!prize) {
    showWinner("Choose a gift card first.", "⚠️");
    return;
  }

  const eligible = entries.filter(entry => entry.prize === prize);

  if (eligible.length === 0) {
    showWinner(`No demo entries for ${prize} yet.`, "🎁");
    return;
  }

  const randomIndex = Math.floor(Math.random() * eligible.length);
  const winner = eligible[randomIndex];

  showWinner(`${winner.nickname} wins the ${prize} demo draw!`, "🏆");
});

function showWinner(message, icon) {
  winnerResult.replaceChildren();

  const symbol = document.createElement("span");
  symbol.textContent = icon;

  const text = document.createElement("p");
  text.textContent = message;

  winnerResult.append(symbol, text);
}

// Clear all demo entries from this browser.
resetButton.addEventListener("click", () => {
  if (entries.length === 0) {
    showMessage("There are no entries to reset.", "error");
    return;
  }

  const confirmed = confirm(
    "Delete ALL GiftDrop demo entries saved in this browser?"
  );

  if (!confirmed) return;

  const previousEntries = entries;
  entries = [];

  if (!saveEntries()) {
    entries = previousEntries;
    showMessage("Could not reset entries.", "error");
    return;
  }

  showMessage("Demo entries have been reset.", "success");
  updateEntrySummary();
  renderEntries();
  showWinner("No winner picked yet.", "🏆");
});

// Start the website.
document.getElementById("year").textContent =
  new Date().getFullYear();

renderPrizeOptions();
renderGifts();
updateEntrySummary();
renderEntries();


