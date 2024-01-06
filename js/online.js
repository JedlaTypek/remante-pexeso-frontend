const socket = io("http://138.2.144.241:3006");
const menu = document.getElementById("menu");
const submitName = document.getElementById("submitName");
const selectionButtons = document.getElementById("selectionButtons");
const createLobbyMenu = document.getElementById("createLobbyMenu");
const lobby = document.getElementById("lobby");
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const imageGallery = document.getElementById("imageGallery");

uploadButton.addEventListener("click", () => {
  const maxImages = 5; // Maximální povolený počet obrázků
  if (fileInput.files.length > maxImages) {
    imagesError.innerText = "nahráli jste více obrázků, než je možné, zkuste to znovu"
  }
  else{
  const files = fileInput.files;
  }
});

submitName.addEventListener("click", () => {
  const jmeno = document.getElementById("jmenoHrace").value;
  socket.emit("jmenoHrace", jmeno);
  const clone = selectionButtons.content.cloneNode(true);
  menu.innerHTML = "";
  menu.appendChild(clone);
});

function showCreateLobbyMenu() {
  const clone = createLobbyMenu.content.cloneNode(true);
  menu.innerHTML = "";
  menu.appendChild(clone);
}

function showJoinLobbyMenu() {
  const clone = lobbyJoin.content.cloneNode(true);
  menu.innerHTML = "";
  menu.appendChild(clone);
}

function createLobby(lobbyData) {
  const clone = lobby.content.cloneNode(true);
  const maxPlayersSpan = clone.querySelector(".maxPlayers");
  maxPlayersSpan.innerText = lobbyData.maxPlayers;
  const gameSizeSpan = clone.querySelector(".gameSize");
  gameSizeSpan.innerText = lobbyData.gameDesk.length;
  const lobbyCodeSpan = clone.querySelector(".lobbyCode");
  lobbyCodeSpan.innerText = lobbyData.lobbyCode;
  menu.innerHTML = "";
  menu.appendChild(clone);
  for (const playerName of lobbyData.playerNames) {
    const clone = player.content.cloneNode(true);
    const listOfPlayers = document.querySelector(".listOfPlayers");
    clone.querySelector(".playerName").innerText = playerName;
    listOfPlayers.appendChild(clone);
  }

  socket.on("idHrace", (jmeno) => {
    const clone = player.content.cloneNode(true);
    const listOfPlayers = document.querySelector(".listOfPlayers");
    clone.querySelector(".playerName").innerText = jmeno;
    listOfPlayers.appendChild(clone);
  });
  socket.on("updateHrace", (playerNames) => {
    const listOfPlayers = document.querySelector(".listOfPlayers");
    listOfPlayers.innerText = "";
    for (const playerName of playerNames) {
      const clone = player.content.cloneNode(true);
      clone.querySelector(".playerName").innerText = playerName;
      listOfPlayers.appendChild(clone);
    }
  });
}

async function submitLobbyCode() {
  const lobbyCode = document.getElementById("lobbyCodeInput").value;
  const response = await fetch("http://138.2.144.241:3006/lobbyJoin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // nastavení hlavičky pro řízení typu obsahu
    },
    body: JSON.stringify({
      lobbyCode,
      socketId: socket.id,
    }),
  });
  if (response.status == 404) {
    const lobbyJoinError = document.getElementById("lobbyJoinError");
    lobbyJoinError.innerText = "Neplatný kód hry";
    return;
  }
  if (response.status == 403) {
    const lobbyJoinError = document.getElementById("lobbyJoinError");
    lobbyJoinError.innerText = "Hra je již plná";
    return;
  }
  const data = await response.json();
  createLobby(data);
}

async function submitLobby() {
  const maxPlayers = document.getElementById("maxPlayers").value;
  const radky = document.getElementById("radky").value;
  const sloupce = document.getElementById("sloupce").value;
  if ((radky * sloupce) % 2 != 0) {
    document.getElementById("lobbyCreateError").innerText =
      "Musí být dělitelné dvěma";
    return;
  }
  const response = await fetch("http://138.2.144.241:3006/lobby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // nastavení hlavičky pro řízení typu obsahu
    },
    body: JSON.stringify({
      maxPlayers: maxPlayers,
      width: sloupce,
      height: radky,
      socketId: socket.id,
    }),
  });
  const data = await response.json();
  createLobby(data);
}

async function gameStart() {
  const response = await fetch("http://138.2.144.241:3006/gameStart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // nastavení hlavičky pro řízení typu obsahu
    },
    body: JSON.stringify({
      socketId: socket.id,
    }),
  });
}

socket.on("hraZacala", (gameInfo) => {
  menu.innerHTML = "";
  menu.classList.add("skryte");
  const gameTemplate = game.content.cloneNode(true);
  gameBoard.classList.remove("skryte");
  gameBoard.appendChild(gameTemplate);
  const sloupce = gameInfo.collumns;
  const radky = gameInfo.gameDesk / gameInfo;
  gameDesk.style.setProperty("--sloupce", sloupce);
  gameDesk.style.setProperty("--radky", radky);
  updatePlayerList(gameInfo.players, gameInfo.playerOnMove);
  const found = gameInfo.players.find((element) => element.id == socket.id);
  const yourName = document.querySelector(".yourName");
  yourName.innerText = found.name;
  for (let i = 0; i < gameInfo.gameDesk; i++) {
    const cardTemplate = card.content.cloneNode(true);
    cardTemplate.querySelector(".karta").dataset.index = i;
    gameDesk.appendChild(cardTemplate);
  }
});

function updatePlayerList(playerData, playerOnMove) {
  const listOfPlayers = document.querySelector(".listOfPlayers");
  listOfPlayers.innerText = "";
  for (const playerInfo of playerData) {
    const playerListItem = playerList.content.cloneNode(true);
    const playerNames = playerListItem.querySelector(".playerName");
    if (playerOnMove == playerInfo.id) {
      playerNames.classList.add("playerOnMove");
    }
    playerNames.innerText = playerInfo.name;
    const playerPoints = playerListItem.querySelector(".playerPoints");
    playerPoints.innerText = playerInfo.points;
    listOfPlayers.appendChild(playerListItem);
  }
}

function turn(element) {
  const id = element.dataset.index;
  socket.emit("turn", id);
}

socket.on("cardUrl", ({ id, url }) => {
  const card = document.querySelector(`[data-index="${id}"] img`);
  card.src = url;
});

socket.on("hideCards", (card1, card2) => {
  document
    .querySelector(`[data-index="${card1}"]`)
    .classList.add("skryta-karta");
  document
    .querySelector(`[data-index="${card2}"]`)
    .classList.add("skryta-karta");
});

socket.on("turnBack", (card) => {
  document.querySelector(`[data-index="${card}"] img`).src =
    "img/remante-logo.jpg";
});
