const socket = io("http://pexeso.lol:3006");
const menu = document.getElementById("menu");
const selectionButtons = document.getElementById("selectionButtons");
const createLobbyMenu = document.getElementById("createLobbyMenu");
const lobby = document.getElementById("lobby");
let radky = 6;
let sloupce = 6;

function backFromOnline(){
  window.location.href = 'index.html';
}

function backToSelectionButtons(){
  const clone = selectionButtons.content.cloneNode(true);
  menu.innerHTML = "";
  menu.appendChild(clone);
}
function submitName() {
  const jmeno = document.getElementById("jmenoHrace").value;
  if(jmeno != ""){
    socket.emit("jmenoHrace", jmeno);
    const clone = selectionButtons.content.cloneNode(true);
    menu.innerHTML = "";
    menu.appendChild(clone);
  } else{
    chyba.innerText = "Jméno nesmí být prázdné.";
  }
};

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
  const response = await fetch("http://pexeso.lol:3006/lobbyJoin", {
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

function c4xr4function() {
  c4xr4.classList.add("selected");
  c6xr6.classList.remove("selected");
  c8xr8.classList.remove("selected");
  sloupce = 4;
  radky = 4;
}

function c6xr6function() {
  c4xr4.classList.remove("selected");
  c6xr6.classList.add("selected");
  c8xr8.classList.remove("selected");
  sloupce = 6;
  radky = 6;
}

function c8xr8function() {
  c4xr4.classList.remove("selected");
  c6xr6.classList.remove("selected");
  c8xr8.classList.add("selected");
  sloupce = 8;
  radky = 8;
}

async function submitLobby() {
  const maxPlayers = document.getElementById("maxPlayers").value;
  if ((radky * sloupce) % 2 != 0) {
    document.getElementById("lobbyCreateError").innerText =
      "Musí být dělitelné dvěma";
    return;
  }
  const response = await fetch("http://pexeso.lol:3006/lobby", {
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
  const response = await fetch("http://pexeso.lol:3006/gameStart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // nastavení hlavičky pro řízení typu obsahu
    },
    body: JSON.stringify({
      socketId: socket.id,
    }),
  });
}

socket.on("notEnoughPlayers", () =>{
  startAlert.innerText = "Pro spuštění hry je potřeba alespoň dva hráče.";
});

socket.on("hraZacala", (gameInfo) => {
  menu.innerHTML = "";
  menu.classList.add("skryte");
  const gameTemplate = game.content.cloneNode(true);
  gameBoard.classList.remove("skryte");
  gameBoard.classList.remove("hraciPole");
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
  document.querySelector(`[data-index="${card}"] img`).src = "img/remante-logo.jpg";
});

socket.on("playerListChange", (players, playerOnMove) => {
  updatePlayerList(players, playerOnMove);
});

socket.on("end", (players, winners) => {
  gameDesk.remove();
  updatePlayerList(players, null);
  console.log("konec hry");
  const clone = houseButton.content.cloneNode(true);
  info.innerHTML += 
  info.appendChild(clone);
  
})