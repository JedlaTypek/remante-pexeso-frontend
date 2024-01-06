// když se klikne potřetí na jednu ze dvou otočených karet, nezůstane otočená ale skryje se
// buď zakázat otočení téhle karty, nebo to nějak jinak ošetřit

const hraciPole = document.getElementById('hraciPole');
let karty = [];
let otoceneKarty = [];
const local = document.getElementById('local');
const online = document.getElementById('online');
const menu = document.getElementById('menu');
const seznamHracu = document.getElementById('seznamHracu');
const hlavicka = document.getElementById('hlavicka');
const naTahu = document.getElementById('naTahu');
const vysledky = document.getElementById('vyhra');
const vyherce = document.getElementById('vyherce');
let listHracu = [];
let pocetHracu = 1;
let aktualniHrac = 0;

online.addEventListener('click', function(){
    window.location.href = 'online.html';
})

local.addEventListener('click', function(){
    menu.innerHTML = '<div id="hraciForm" class="flex-collumn"><label>Jméno hráče č. 1:</label><input type="text" value="hrac1" id="hrac1"></div><button id="pridatHrace">Přidat hráče</button>';
    menu.innerHTML += '<label>Počet řádků:<span id="radkyText">6</span></label><input type="range" min="2" max="8" value="6" id="radky"><label>Počet sloupců:<span id="sloupceText">6</span></label><input type="range" min="2" max="8" value="6" id="sloupce"><button id="potvrdit">Potvrdit</button><div id="upozorneni"></div>';
    const pridatHrace = document.getElementById('pridatHrace');
    const potvrdit = document.getElementById('potvrdit');
    const hraciForm = document.getElementById('hraciForm');
    const radkyText = document.getElementById('radkyText');
    const sloupceText = document.getElementById('sloupceText');
    
    pridatHrace.addEventListener('click', function(){
        pocetHracu++;
        if(pocetHracu <= 5){
            hraciForm.innerHTML += `<label>Jméno hráče č. ${pocetHracu}:</label><input type="text" value="hrac${pocetHracu}" id="hrac${pocetHracu}">`;
        }
    })

    radky.oninput = function() {
        radkyText.innerHTML = this.value;
    }
    sloupce.oninput = function() {
        sloupceText.innerHTML = this.value;
    }

    potvrdit.addEventListener('click', function(){
        
        let sloupce = document.getElementById('sloupce').value;
        let radky = document.getElementById('radky').value;
        const upozorneni = document.getElementById('upozorneni');
    
        upozorneni.innerText = "";
        if((radky * sloupce) % 2 != 0){
            upozorneni.innerHTML += "Součin řádků a sloupců musí být sudý.<br>";
        }
        
        if(!((radky * sloupce) % 2 != 0)){
            for(let i = 0; i < pocetHracu; i++){
                listHracu.push({
                    id: i,
                    name: document.getElementById('hrac'+(i+1)).value,
                    pocetBodu: 0
                });
            }
            naTahu.innerText = listHracu[aktualniHrac].name;
            menu.classList.add('skryte');
            hra.classList.remove('skryte');
            hraciPole.style.setProperty('--sloupce', sloupce);
            hraciPole.style.setProperty('--radky', radky);
            vytvorHraciPole(radky * sloupce);
        }   
    })
    if(pocetHracu > 1){
        seznamHracu.classList.remove('skryte');
    }
})

function picsum(velikost) {
    let obrazky = [];
    for (let i = 0; i < velikost / 2; i++) {
        obrazky.push(`https://picsum.photos/id/${i + 10}/200/300`);
    }
    return obrazky;
}

function vytvorHraciPole(velikost) {
    const vsechnyKarty = picsum(velikost);
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

        hraciPole.appendChild(kartaElement); // co znamená tohle?
        kartaElement.addEventListener('click', otocKartu); // proč je ve foru add event listener?? 
    }
    
}

function otocKartu(event) {
    const index = event.target.closest('.karta').dataset.index;

    // Ověření, zda máme platný index
    if (index !== undefined && karty[index] !== undefined) {
        if (!karty[index].revealed) {
            karty[index].revealed = true;
            otoceneKarty.push(karty[index]);
            
            let prvniIndex = karty.indexOf(otoceneKarty[0]);
            let druhyIndex = karty.indexOf(otoceneKarty[1]);
            let prvniElement = document.querySelector(`[data-index="${prvniIndex}"]`);
            let druhyElement = document.querySelector(`[data-index="${druhyIndex}"]`);
            if(otoceneKarty.length  == 2){
                overKarty(otoceneKarty[0], otoceneKarty[1], prvniElement, druhyElement);
            }

            if (otoceneKarty.length === 3) {
                console.log(otoceneKarty);
                if(otoceneKarty[0] === otoceneKarty[2]){
                    druhyElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;    
                } else if(otoceneKarty[1] === otoceneKarty[2]){
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
            if (event.target.classList.contains('logo')) {
                event.target.src = karty[index].url;
            }
            
        }
    }
}

function overKarty(prvniKarta, druhaKarta, prvniElement, druhyElement) {
    if (prvniKarta.url === druhaKarta.url) { // tu byla podmínka, že se měly rovnat i idčka, ale to je blbost
        listHracu[aktualniHrac].pocetBodu++;
        console.log(listHracu);
        prvniElement.classList.add('skryta-karta');
        druhyElement.classList.add('skryta-karta');
        let soucetBodu = 0;
        for(let i = 0; i < pocetHracu; i++){
            soucetBodu+=listHracu[i].pocetBodu;
        }
        if(soucetBodu == karty.length/2){
            console.log("Konec hry!");

            hra.classList.add('skryte');
            let vyherci = kdoVyhral(listHracu, pocetHracu);
            vyherce.innerText = vyherci[0].name;
            if(listHracu.length > 1){
                for(let i = 1; i < vyherci.length; i++){
                    vyherce.innerText += ` a ${vyherci[i].name}`;
                }
            }
            for(let i = 0; i < vyherci.length; i++){
                vysledky.innerHTML += `<p>${vyherci[i].name} - ${vyherci[i].pocetBodu} b</p>`;
            }
            vysledky.classList.remove('skryte');
        }
    } else {
        prvniKarta.revealed = false;
        druhaKarta.revealed = false;
        aktualniHrac++;
        if(aktualniHrac === pocetHracu){
            aktualniHrac = 0;
        }
        naTahu.innerText = listHracu[aktualniHrac].name;
    }
}

function kdoVyhral(hraci, pocetHracu){
    let hracVyherce = [];
    hracVyherce.push(hraci[0]);
    for(let i = 1; i < pocetHracu; i++){
        if(hraci[i].pocetBodu > hracVyherce[0].pocetBodu){
            hracVyherce[0] = hraci[i];
        } else if(hraci[i].pocetBodu === hracVyherce[0].pocetBodu){
            hracVyherce.push(hraci[i]);
        }
    }
    return hracVyherce;
}