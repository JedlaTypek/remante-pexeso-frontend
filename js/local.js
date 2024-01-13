const hraciPole = document.getElementById('hraciPole');
let karty = [];
let otoceneKarty = [];
const local = document.getElementById('local');
const online = document.getElementById('online');
const menu = document.getElementById('menu');
const seznamHracu = document.getElementById('seznamHracu');
const hlavicka = document.getElementById('hlavicka');
const vysledky = document.getElementById('vyhra');
const vyherce = document.getElementById('vyherce');
const gameStart = document.getElementById('gameStart');
let listHracu = [];
let pocetHracu = 1;
let aktualniHrac = 0;
let sloupce = 6;
let radky = 6;
let sada = "";

function backFromLocal() {
    window.location.href = 'index.html';
}

function addPlayer() {
    pocetHracu++;
    const template = document.getElementById("player");
    const newPlayer = template.content.cloneNode(true);
    const inputId = newPlayer.getElementById("inputId")
    inputId.id = `hrac${pocetHracu}`;
    tlacitka.appendChild(newPlayer);
    if(pocetHracu === 2) odebratHrace.classList.remove('skryte');
    if(pocetHracu === 6) pridatHrace.classList.add('skryte');
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

function vybratSadu(sadaInput){
    sada = sadaInput;
    console.log(sada);
    popup.classList.remove('active');
}

function start() {
    listHracu = [];
    if(sada === ""){
        startError.innerText = "Vyber si nejdřív sadu.";
        return;
    }
    for (let i = 0; i < pocetHracu; i++) {
        if(document.getElementById(`hrac${i + 1}`).value === ""){
            startError.innerText = "Jméno hráče nesmí být prázdné.";
            return;
        }
        listHracu.push({
            id: i,
            name: document.getElementById(`hrac${i + 1}`).value,
            pocetBodu: 0
        });
    }
    const gameStartTemp = gameStart.content.cloneNode(true);
    menu.remove();
    document.body.appendChild(gameStartTemp);
    const hraciPole = document.getElementById("hraciPole");
    hraciPole.style.setProperty('--sloupce', sloupce);
    hraciPole.style.setProperty('--radky', radky);
    vytvorHraciPole(radky * sloupce, sada);
    vypisHrace(listHracu, aktualniHrac);
}



function removePlayer() {
    const lastPlayer = document.getElementById("hrac" + pocetHracu);
    lastPlayer.remove();
    pocetHracu--;
    if(pocetHracu === 5) pridatHrace.classList.remove('skryte');
    if(pocetHracu === 1) odebratHrace.classList.add('skryte');
}

function picsum(velikost) {
    let obrazky = [];
    for (let i = 0; i < velikost / 2; i++) {
        obrazky.push(`https://picsum.photos/id/${i + 10}/200/300`);
    }
    return obrazky;
}

function hraciPoleSada(velikost, sada){
    let obrazky = []
    for (let i = 0; i < velikost / 2; i++) {
        obrazky.push(`img/sady/${sada}/${i+1}.webp`);
    }
    return obrazky;
}

function vytvorHraciPole(velikost, sada) {
    const vsechnyKarty = hraciPoleSada(velikost, sada);
    const obrazky = vsechnyKarty.concat(vsechnyKarty); // Každý obrázek pouze jednou

    const shuffle = (array) => array.sort(() => Math.random() - 0.5); // funkce na přeházení prvků v poli
    const nahodneIndexy = shuffle([...Array(velikost).keys()]); // vytvoří pole přeházených indexů od 0 do velikost-1

    for (let i = 0; i < velikost; i++) {
        const kartaElement = document.createElement('div');
        kartaElement.classList.add('karta');
        kartaElement.dataset.index = i;

        // Zobrazení karty s logem Remante na začátku
        kartaElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;

        karty.push({
            id: i,
            url: obrazky[nahodneIndexy[i]],
            revealed: false
        });
        const hraciPole = document.getElementById('hraciPole')
        hraciPole.appendChild(kartaElement);
        kartaElement.addEventListener('click', otocKartu);
    }

}

function vypisHrace(listHracu, aktualniHrac) {
    playerList.innerHTML = "";
    for (const player of listHracu) {
        const newPlayer = playerListItem.content.cloneNode(true);

        // Použití querySelector na nově vytvořené šabloně
        const playerNameElement = newPlayer.querySelector('.playerName');
        const playerPointsElement = newPlayer.querySelector('.playerPoints');

        playerNameElement.textContent = player.name;
        playerPointsElement.textContent = player.pocetBodu;

        if (player.id === aktualniHrac) {
            playerNameElement.classList.add('playerOnMove');
        }

        playerList.appendChild(newPlayer);
    }
}

function otocKartu(event) {
    const index = event.target.closest('.karta').dataset.index;

    // Ověření, zda máme platný index
    if (index != undefined && karty[index] !== undefined) {
        if (!karty[index].revealed) {
            karty[index].revealed = true;
            otoceneKarty.push(karty[index]);

            if (event.target.classList.contains('logo')) {
                event.target.src = karty[index].url;
            }

            let prvniIndex = karty.indexOf(otoceneKarty[0]);
            let druhyIndex = karty.indexOf(otoceneKarty[1]);
            let prvniElement = document.querySelector(`[data-index="${prvniIndex}"]`);
            let druhyElement = document.querySelector(`[data-index="${druhyIndex}"]`);
            if (otoceneKarty.length == 2) {
                overKarty(otoceneKarty[0], otoceneKarty[1], prvniElement, druhyElement);
            }

            if (otoceneKarty.length === 3) {
                if (otoceneKarty[0] === otoceneKarty[2]) {
                    druhyElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
                } else if (otoceneKarty[1] === otoceneKarty[2]) {
                    prvniElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
                } else {
                    prvniElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
                    druhyElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
                }
                let pom;
                pom = otoceneKarty[2];
                otoceneKarty = [];
                otoceneKarty[0] = pom;
            }
            // Změna obrázku pouze při kliknutí na logo

        }
    }
}

function overKarty(prvniKarta, druhaKarta, prvniElement, druhyElement) {
    if (prvniKarta.url === druhaKarta.url) {
        listHracu[aktualniHrac].pocetBodu++;
        vypisHrace(listHracu, aktualniHrac);
        prvniElement.classList.add('skryta-karta');
        druhyElement.classList.add('skryta-karta');
        let soucetBodu = 0;
        for (let i = 0; i < pocetHracu; i++) {
            soucetBodu += listHracu[i].pocetBodu;
        }
        if (soucetBodu == karty.length / 2) {
            const hraciPole = document.getElementById('hraciPole');
            hraciPole.remove();
        }
    } else {
        prvniKarta.revealed = false;
        druhaKarta.revealed = false;
        aktualniHrac++;
        if (aktualniHrac === pocetHracu) {
            aktualniHrac = 0;
        }
        vypisHrace(listHracu, aktualniHrac);
    }
}

function kdoVyhral(hraci, pocetHracu) {
    let hracVyherce = [];
    hracVyherce.push(hraci[0]);
    for (let i = 1; i < pocetHracu; i++) {
        if (hraci[i].pocetBodu > hracVyherce[0].pocetBodu) {
            hracVyherce[0] = hraci[i];
        } else if (hraci[i].pocetBodu === hracVyherce[0].pocetBodu) {
            hracVyherce.push(hraci[i]);
        }
    }
    return hracVyherce;
}