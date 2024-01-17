const socket = io("http://pexeso.lol:3006");

async function getLeaderboard() {
    const response = await fetch("http://pexeso.lol:3006/stats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // nastavení hlavičky pro řízení typu obsahu
        },
    });
    const data = await response.json();
    return data;
}

async function printLeaderboard() {
    const data = await getLeaderboard()
    for (const player of data.wins) {
        const statsItem = document.createElement('li');
        statsItem.innerText = player.name + ' - ' + player.wins;
        wins.appendChild(statsItem);
    }
    for (const player of data.gamesPlayed) {
        const statsItem = document.createElement('li');
        statsItem.innerText = player.name + ' - ' + player.gamesPlayed;
        gamesPlayed.appendChild(statsItem);
    }
    for (const player of data.pointsEarned) {
        const statsItem = document.createElement('li');
        statsItem.innerText = player.name + ' - ' + player.pointsEarned;
        pointsEarned.appendChild(statsItem);
    }
}

printLeaderboard();