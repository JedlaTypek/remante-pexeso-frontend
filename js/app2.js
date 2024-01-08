let pocetHracu = 0;
let listHracu = [];
let aktualniHrac = 0;

online.addEventListener("click", () => {
  window.location.href = "online.html";
});

local.addEventListener("click", () => {
  menu.innerHTML = "";
  const clone = createGameMenu.content.cloneNode(true);
  menu.appendChild(clone);
});

function addPlayer() {
  pocetHracu++;
  const template = document.getElementById("player");
  const newPlayer = template.content.cloneNode(true);
  newPlayer.id = `hrac${pocetHracu}`;
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

function start() {
  for (let i = 0; i < pocetHracu; i++) {
    listHracu.push({
      id: i,
      name: document.getElementById(`hrac${i}`).value,
      pocetBodu: 0,
    });
  }
  naTahu.innerText = listHracu[aktualniHrac].name;
  menu.classList.add("skryte");
  hra.classList.remove("skryte");
  hraciPole.style.setProperty("--sloupce", sloupce);
  hraciPole.style.setProperty("--radky", radky);
  vytvorHraciPole(radky * sloupce);
}

function removeGrandParent(element) {
  const grandparentElement = element.parentElement.parentElement;
  grandparentElement.remove();
  pocetHracu--;
}

function vytvorHraciPole(velikost) {
  const vsechnyKarty = picsum(velikost);
  const obrazky = vsechnyKarty.concat(vsechnyKarty); // Každý obrázek pouze jednou

  const shuffle = (array) => array.sort(() => Math.random() - 0.5); // funkce na přeházení prvků v poli
  const nahodneIndexy = shuffle([...Array(velikost).keys()]); // vytvoří pole přeházených indexů od 0 do velikost-1

  for (let i = 0; i < velikost; i++) {
    const kartaElement = document.createElement("div");
    kartaElement.classList.add("karta");
    kartaElement.dataset.index = i;

    // Zobrazení karty s logem Remante na začátku
    kartaElement.innerHTML = `<img class="logo" src="img/remante-logo.jpg" alt="">`;

    karty.push({
      id: i,
      url: obrazky[nahodneIndexy[i]],
      revealed: false,
    });

    hraciPole.appendChild(kartaElement); // co znamená tohle?
    kartaElement.addEventListener("click", otocKartu); // proč je ve foru add event listener??
  }
}

function picsum(velikost) {
  let obrazky = [];
  for (let i = 0; i < velikost / 2; i++) {
    obrazky.push(`https://picsum.photos/id/${i + 10}/200/300`);
  }
  return obrazky;
}
