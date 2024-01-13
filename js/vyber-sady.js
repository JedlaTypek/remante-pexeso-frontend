// Vytvoření pole pro ukládání prvků
var sady = [];

var vodiapickerOptions = document.querySelectorAll('.vodiapicker option');
const tlacitko = document.querySelector('.btn-select')
const dropdown = document.querySelector(".dropdown")

// Procházení všech prvků <option>
vodiapickerOptions.forEach(function(option) {
  const img = option.getAttribute("data-thumbnail");
  const text = option.innerText;
  const value = option.value;
  const item = '<li><img src="'+ img +'" alt="" value="'+ value +'"/><span>'+ text +'</span></li>';
  sady.push(item);
});

// vložení obsahu pole sloučeného do jednoho stringu do elementu s id "a"
document.getElementById('a').innerHTML = sady.join('');

// Funkce pro změnu tlačítka po kliknutí na prvek seznamu
var aListItems = document.querySelectorAll('#a li');
aListItems.forEach(function(item) {
  item.addEventListener('click', function() {
    var img = this.querySelector('img').getAttribute("src");
    var value = this.querySelector('img').getAttribute('value');
    var text = this.innerText;
    var newItem = '<li><img src="'+ img +'" alt="" /><span>'+ text +'</span></li>';
    tlacitko.innerHTML = newItem;
    tlacitko.setAttribute('value', value);
    dropdown.style.display = "none";
  });
});

// Funkce pro zobrazení/skrytí seznamu po kliknutí na tlačítko
tlacitko.addEventListener('click', function() {
  dropdown.style.display = (dropdown.style.display === "none") ? "block" : "none";
});