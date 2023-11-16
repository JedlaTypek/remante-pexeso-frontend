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
    menu.innerHTML += '<label>Počet kartiček v řadě:</label><input type="number" id ="radky" min="4" max="8" value="8"><label>Počet kartiček ve sloupci</label><input type="number" id ="sloupce" min="4" max="8" value="8"><button id="potvrdit">Potvrdit</button><div id="upozorneni"></div>';
    const pridatHrace = document.getElementById('pridatHrace');
    const potvrdit = document.getElementById('potvrdit');
    const hraci = document.getElementById('hraci');
    
    pridatHrace.addEventListener('click', function(){
        pocetHracu++;
        if(pocetHracu <= 5){
            hraci.innerHTML += `<label>Jméno hráče č. ${pocetHracu}:</label><input type="text" value="hrac${pocetHracu}" id="hrac${pocetHracu}">`;
        }
    })
    potvrdit.addEventListener('click', function(){
        
        let sloupce = document.getElementById('sloupce').value;
        let radky = document.getElementById('radky').value;
        const upozorneni = document.getElementById('upozorneni');
    
        upozorneni.innerText = "";
    
        if(sloupce > 8 || sloupce < 4){
            upozorneni.innerHTML += "Pocet sloupců je mimo interval<br>";
        }
        if(radky > 8 || radky < 4){
            upozorneni.innerHTML += "Pocet řádků je mimo interval<br>";
        }
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

        kartaElement.addEventListener('click', otocKartu); // proč je ve foru add event listener??
        hraciPole.appendChild(kartaElement); // co znamená tohle?
    }
}

function otocKartu(event) {
    const index = event.target.closest('.karta').dataset.index;

    // Ověření, zda máme platný index
    if (index !== undefined && karty[index] !== undefined) {
        if (!karty[index].revealed && otoceneKarty.length < 2) {
            // Pokud karta není otočená a zároveň nejsou otočeny dvě karty
            karty[index].revealed = true;
            otoceneKarty.push(karty[index]);
            
            // Změna obrázku pouze při kliknutí na logo
            if (event.target.classList.contains('logo')) {
                event.target.src = karty[index].url;
            }

            if (otoceneKarty.length === 2) {
                setTimeout(() => {
                    overKarty();
                }, 1000);
            }
        }
    }
}

function overKarty() {
    const [prvniKarta, druhaKarta] = otoceneKarty;
    const prvniIndex = karty.indexOf(prvniKarta);
    const druhyIndex = karty.indexOf(druhaKarta);

    if (prvniKarta.url === druhaKarta.url) { // tu byla podmínka, že se měly rovnat i idčka, ale to je blbost
        otoceneKarty = [];
        listHracu[aktualniHrac].pocetBodu++;
        console.log(listHracu);
    } else {
        prvniKarta.revealed = false;
        druhaKarta.revealed = false;
        otoceneKarty = [];
        aktualniHrac++;
        if(aktualniHrac === pocetHracu){
            aktualniHrac = 0;
        }
        naTahu.innerText = listHracu[aktualniHrac].name;

        const prvniElement = document.querySelector(`[data-index="${prvniIndex}"]`);
        const druhyElement = document.querySelector(`[data-index="${druhyIndex}"]`);

        setTimeout(() => {
            prvniElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
            druhyElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
        }, 500);
    }
}



// function otocKartu(event) {
//     const index = event.target.closest('.karta').dataset.index;

//     // Ověření, zda máme platný index
//     if (index !== undefined && karty[index] !== undefined) {
//         if (!karty[index].revealed) {
//             // Pokud karta není otočená a zároveň nejsou otočeny dvě karty
//             karty[index].revealed = true;
//             // Změna obrázku pouze při kliknutí na logo
//             if (event.target.classList.contains('logo')) {
//                 event.target.src = karty[index].url;
//             }
//             otoceneKarty.push(karty[index]);
//             if (otoceneKarty.length === 2) {
//                 const [prvniKarta, druhaKarta] = otoceneKarty;
//                 console.log(karty.indexOf(prvniKarta));
//                 console.log(karty.indexOf(druhaKarta));
//                 let prvniIndex = karty.indexOf(prvniKarta);
//                 let druhyIndex = karty.indexOf(druhaKarta);

//                 let prvniElement = document.querySelector(`[data-index="${prvniIndex}"]`);
//                 let druhyElement = document.querySelector(`[data-index="${druhyIndex}"]`);

//                 if (prvniKarta.url === druhaKarta.url) { // tu byla podmínka, že se měly rovnat i idčka, ale to je blbost
//                     prvniElement.classList.add('skryta-karta');
//                     druhyElement.classList.add('skryta-karta');
//                     otoceneKarty = [];
//                     listHracu[aktualniHrac].pocetBodu++;
//                 } else {
//                     aktualniHrac++;
//                     if(aktualniHrac === pocetHracu){
//                         aktualniHrac = 0;
//                     }
//                 }
//             }            
//             if (otoceneKarty.length === 3) {
//                 otoceneKarty[0].revealed = false;
//                 otoceneKarty[1].revealed = false;
//                 document.querySelector(`[data-index="${prvniIndex}"]`).innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
//                 document.querySelector(`[data-index="${druhyIndex}"]`).innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
//                 let pom = otoceneKarty[3];
//                 otoceneKarty = [];
//                 otoceneKarty.push(pom);
//             }
//         }
//     }
// }

// function overKarty() {
//     const [prvniKarta, druhaKarta] = otoceneKarty;
//     const prvniIndex = karty.indexOf(prvniKarta);
//     const druhyIndex = karty.indexOf(druhaKarta);

//     let prvniElement = document.querySelector(`[data-index="${prvniIndex}"]`);
//     let druhyElement = document.querySelector(`[data-index="${druhyIndex}"]`);

//     if (prvniKarta.url === druhaKarta.url) { // tu byla podmínka, že se měly rovnat i idčka, ale to je blbost
//         prvniElement.classList.add('skryta-karta');
//         druhyElement.classList.add('skryta-karta');
//         otoceneKarty = [];
//         listHracu[aktualniHrac].pocetBodu++;
//     } else {
//         aktualniHrac++;
//         if(aktualniHrac === pocetHracu){
//             aktualniHrac = 0;
//         }
//     }
// }