const socket = io("http://pexeso.lol:3006");
const menu = document.getElementById("menu");
const selectionButtons = document.getElementById("selectionButtons");
const createLobbyMenu = document.getElementById("createLobbyMenu");
const lobby = document.getElementById("lobby");
let radky = 6;
let sloupce = 6;
let sada = "";

function backFromOnline(){
  window.location.href = 'index.html';
}

function backFromGameEnd(){
  const clone = selectionButtons.content.cloneNode(true);
  menu.appendChild(clone);
  menu.classList.remove('skryte');
  gameBoard.innerHTML = "";
  gameBoard.classList.add('skryte');
  //document.body.appendChild(gameBoardTemplate.content.cloneNode(true))
}

function backToSelectionButtons(){
  const clone = selectionButtons.content.cloneNode(true);
  menu.innerHTML = "";
  menu.appendChild(clone);
}

function leftLobby(){
  socket.emit("leftLobby");
  backToSelectionButtons();
}

function submitName() {
  const jmeno = document.getElementById("jmenoHrace").value;
  if(jmeno != "" && jmeno.length <= 15){
    socket.emit("jmenoHrace", jmeno);
    const clone = selectionButtons.content.cloneNode(true);
    menu.innerHTML = "";
    menu.appendChild(clone);
  } else{
    chyba.innerText = "Jméno nesmí být prázdné ani delší než 15 znaků.";
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

function vybratSadu(sadaInput, sadaText){
  sada = sadaInput;
  popup.classList.remove('active');
  ukazPopupText.innerHTML = sadaText;
}

function createLobby(lobbyData) {
  const clone = lobby.content.cloneNode(true);
  const maxPlayersSpan = clone.querySelector(".maxPlayers");
  maxPlayersSpan.innerText = lobbyData.maxPlayers;
  const gameSizeSpan = clone.querySelector(".gameSize");
  gameSizeSpan.innerText = lobbyData.gameDesk.length;
  const sadaSpan = clone.querySelector(".sada");
  sadaSpan.innerText = lobbyData.sada;
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
}

socket.on("idHrace", (jmeno) => {
  console.log(jmeno);
  const clone = player.content.cloneNode(true);
  const listOfPlayers = document.querySelector(".listOfPlayers");
  clone.querySelector(".playerName").innerText = jmeno;
  listOfPlayers.appendChild(clone);
});
socket.on("updateHrace", (playerNames) => {
  console.log(playerNames);
  const listOfPlayers = document.querySelector(".listOfPlayers");
  listOfPlayers.innerText = "";
  for (const playerName of playerNames) {
    const clone = player.content.cloneNode(true);
    clone.querySelector(".playerName").innerText = playerName;
    listOfPlayers.appendChild(clone);
  }
});

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
  if (response.status == 402) {
    const lobbyJoinError = document.getElementById("lobbyJoinError");
    lobbyJoinError.innerText = "Hra již začala.";
    return;
  }
  const data = await response.json();
  console.log(data);
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
  if(maxPlayers < 2 || isNaN(maxPlayers)){
    document.getElementById("lobbyCreateError").innerText = "V lobby musí být minimálně 2 hráči.";
    return;
  }
  if(sada === "") {
    document.getElementById("lobbyCreateError").innerText = "Musíš si vybrat sadu.";
    return;
  }
  const sadaName = ukazPopupText.innerHTML;
  const response = await fetch("http://pexeso.lol:3006/lobby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // nastavení hlavičky pro řízení typu obsahu
    },
    body: JSON.stringify({
      maxPlayers: maxPlayers,
      width: sloupce,
      height: radky,
      sadaFolder: sada,
      sadaName: sadaName,
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
  const card = document.getElementById('card');
  for (let i = 0; i < gameInfo.gameDesk; i++) {
    const cardTemplate = card.content.cloneNode(true);
    cardTemplate.querySelector(".karta").dataset.index = i;
    gameDesk.appendChild(cardTemplate);
  }
});

function updatePlayerList(playerData, playerOnMove) {
  console.log(playerData, playerOnMove);
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
    if(playerInfo.points != undefined){
      playerPoints.innerText = playerInfo.points;
    }
    listOfPlayers.appendChild(playerListItem);
  }
}

function turn(element) {
  const id = element.dataset.index;
  socket.emit("turn", id);
}

socket.on("cardUrl", ({ id, url }) => {
  const card = document.querySelector(`[data-index="${id}"]`);
  card.classList.add('otocena-karta');
  const cardImg = document.querySelector(`[data-index="${id}"] img`);
  cardImg.src = url;
});

socket.on("hideCards", (card1id, card2id) => {
  card1 = document.querySelector(`[data-index="${card1id}"]`);
  card1.classList.add("skryta-karta");
  card1.classList.remove("otocena-karta");
  card2 = document.querySelector(`[data-index="${card2id}"]`);
  card2.classList.add("skryta-karta");
  card2.classList.remove("otocena-karta");
});

socket.on("turnBack", (cardId) => {
  card = document.querySelector(`[data-index="${cardId}"]`);
  card.classList.remove('otocena-karta');
  const cardImg = document.querySelector(`[data-index="${cardId}"] img`)
  cardImg.src = "img/remante-logo.jpg";
  
});

socket.on("playerListChange", (players, playerOnMove) => {
  updatePlayerList(players, playerOnMove);
});

socket.on("end", (players, winners) => {
  gameDesk.remove();
  updatePlayerList(players, null);
  const houseButtonTemplate = houseButton.content.cloneNode(true);
  backButtons.appendChild(houseButtonTemplate);
  const clone = backToOnlineMenu.content.cloneNode(true);
  backButtons.appendChild(clone);
})