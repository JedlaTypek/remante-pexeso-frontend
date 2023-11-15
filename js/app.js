const hraciPole = document.getElementById('hraciPole');
let karty = [];
let otoceneKarty = [];

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

    if (prvniKarta.url === druhaKarta.url && prvniKarta.id === druhaKarta.id) {
        otoceneKarty = [];
    } else {
        prvniKarta.revealed = false;
        druhaKarta.revealed = false;
        otoceneKarty = [];

        const prvniElement = document.querySelector(`[data-index="${prvniIndex}"]`);
        const druhyElement = document.querySelector(`[data-index="${druhyIndex}"]`);

        setTimeout(() => {
            prvniElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
            druhyElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;
        }, 500);
    }
}

vytvorHraciPole(64); // Zde můžete nastavit počet karet