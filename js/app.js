const hraciPole = document.getElementById('hraciPole');
let karty = [];
let otoceneKarty = [];
const local = document.getElementById('local');
const online = document.getElementById('online');
const menu = document.getElementById('menu');
const seznamHracu = document.getElementById('seznamHracu');
const hlavicka = document.getElementById('hlavicka');
const naTahu = document.getElementById('naTahu');
let listHracu = [];
let pocetHracu = 1;
let aktualniHrac = 0;

local.addEventListener('click', function(){
    menu.innerHTML = '<div id="hraci" class="flex-collumn"><label>Jméno hráče č. 1:</label><input type="text" value="hrac1" id="hrac1"></div><button id="pridatHrace">Přidat hráče</button>';
    menu.innerHTML += '<label>Počet řádků:<span id="radkyText">6</span></label><input type="range" min="4" max="8" value="6" id="radky"><label>Počet sloupců:<span id="sloupceText">6</span></label><input type="range" min="4" max="8" value="6" id="sloupce"><button id="potvrdit">Potvrdit</button><div id="upozorneni"></div>';
    const pridatHrace = document.getElementById('pridatHrace');
    const potvrdit = document.getElementById('potvrdit');
    const hraci = document.getElementById('hraci');
    const radkyText = document.getElementById('radkyText');
    const sloupceText = document.getElementById('sloupceText');
    
    pridatHrace.addEventListener('click', function(){
        pocetHracu++;
        if(pocetHracu <= 5){
            hraci.innerHTML += `<label>Jméno hráče č. ${pocetHracu}:</label><input type="text" value="hrac${pocetHracu}" id="hrac${pocetHracu}">`;
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
        
        if(!(sloupce > 8 || sloupce < 4 || radky > 8 || radky < 4 || (radky * sloupce) % 2 != 0)){
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
        if (!karty[index].revealed) { // && otoceneKarty.length < 2
            // Pokud karta není otočená a zároveň nejsou otočeny dvě karty
            karty[index].revealed = true;
            otoceneKarty.push(karty[index]);
            
            let prvniIndex = karty.indexOf(otoceneKarty[0]);
            let druhyIndex = karty.indexOf(otoceneKarty[1]);
            let prvniElement = document.querySelector(`[data-index="${prvniIndex}"]`);
            let druhyElement = document.querySelector(`[data-index="${druhyIndex}"]`);
            if(otoceneKarty.length  == 2){
                console.log(otoceneKarty);
                overKarty(otoceneKarty[0], otoceneKarty[1], prvniElement, druhyElement);
                
            }
            
            if (otoceneKarty.length === 3) {
                prvniElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
                druhyElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
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
    //const [prvniKarta, druhaKarta] = otoceneKarty;
    //const prvniIndex = karty.indexOf(prvniKarta);
    //const druhyIndex = karty.indexOf(druhaKarta);

    //const prvniElement = document.querySelector(`[data-index="${prvniIndex}"]`);
    //const druhyElement = document.querySelector(`[data-index="${druhyIndex}"]`);

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