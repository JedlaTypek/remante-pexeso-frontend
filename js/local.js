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
let sloupce = 0;
let radky = 0;
  
  function addPlayer() {
    pocetHracu++;
    const template = document.getElementById("player");
    const newPlayer = template.content.cloneNode(true);
    const inputId = newPlayer.getElementById("inputId")
    inputId.id = `hrac${pocetHracu}`;
    pridanaTlacitka.appendChild(newPlayer);
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


    function start(){   
            for(let i = 0; i < pocetHracu; i++){
                listHracu.push({
                    id: i,
                    name: document.getElementById(`hrac${i+1}`).value,
                    pocetBodu: 0
                });
            }
            const gameStartTemp = gameStart.content.cloneNode(true);
            menu.innerHTML ="";
            menu.appendChild(gameStartTemp);
            naTahu.innerText = listHracu[aktualniHrac].name;
            menu.classList.add('skryte');
            hra.classList.remove('skryte');
            hraciPole.style.setProperty('--sloupce', sloupce);
            hraciPole.style.setProperty('--radky', radky);
            vytvorHraciPole(radky * sloupce);
        }   
    


function removeGrandParent(element) {
const grandparentElement = element.parentElement.parentElement;
grandparentElement.remove();
pocetHracu--;
}

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