function ukazPopup() {
  ukazVyberSad();
  popup.classList.add('active');
}

function ukazVyberSad() {
  const template = vyberSadTemplate.content.cloneNode(true);
  popupContent.innerHTML = "";
  popupContent.appendChild(template);
}

function cervenaAuta() {
  vykresliPopup("Červená auta", "cervena-auta");
}

function ford() {
  vykresliPopup("Ford", "ford");
}

function skoda() {
  vykresliPopup("Škoda", "skoda");
}

function autodily() {
  vykresliPopup("Autodíly", "autodily");
}

function vykresliPopup(nadpisText, sada) {
  const template = galleryTemplate.content.cloneNode(true);
  popupContent.innerHTML = "";
  popupContent.appendChild(template);
  nadpis.innerText = nadpisText;
  vybratSaduButton.setAttribute("onclick", `vybratSadu("${sada}", "${nadpisText}")`);
  for (let i = 0; i < 32; i++) {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');
    galleryItem.innerHTML = `<img class="logo" src="img/sady/${sada}/${i + 1}.webp">`;
    gallery.appendChild(galleryItem);
  }
}