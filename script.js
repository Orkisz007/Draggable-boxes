let draggable = document.getElementsByClassName('draggable');
let settings = document.getElementsByClassName('settings');

let divValues = document.getElementsByName('divValue');
let backColors = document.getElementsByName('backColor');
let fontColors = document.getElementsByName('fontColor');
let divSizes = document.getElementsByName('divSize');
let borderWidths = document.getElementsByName('borderWidth');
let divSizeIndicator = document.getElementsByClassName('divSize');
let borderWidthIndicator = document.getElementsByClassName('borderWidth');

let playground = document.getElementById('Playground');
let menu = document.getElementById('Menu');
let menuToggle = document.getElementById('MenuToggle');
let addNew = document.getElementById('AddNew');

let newBlockTemplate = document.createElement('div');
newBlockTemplate.className = 'draggable';
newBlockTemplate.innerHTML = '<p></p>';

let newSettingsTemplate = document.createElement('section');
newSettingsTemplate.className = 'settings';
newSettingsTemplate.innerHTML = '' +
    '<input class="divValue" type="text" name="divValue" aria-label="Text inside a block" placeholder="Text inside a block">' +
    '<label class="slider">Box Size: <input type="range" name="divSize" min="100" max="300" value="150"><span class="divSize"></span></label>' +
    '<label class="color"><abbr title="Background color">BG Col:</abbr><input type="color" name="backColor"></label>' +
    '<label class="color"><abbr title="Font color">Font Col:</abbr><input type="color" name="fontColor"></label>' +
    '<label class="check">Border:<input type="checkbox" name="border" checked></label>' +
    '<label class="color"><abbr title="Border color">Brdr Col:</abbr><input type="color" name="borderColor"></label>' +
    '<label class="slider"><abbr title="Border width">Brdr Width:</abbr> <input type="range" name="borderWidth" min="0" max="5" value="3"><span class="borderWidth"></span></label>' +
    '<label class="check">Draggable:<input type="checkbox" name="draggable" checked></label>' +
    '<label class="check">Collisions:<input type="checkbox" name="collision" checked></label>' +
    '<p class="close">&#10005;</p>';

menuToggle.addEventListener('click', () => {
    menuToggle.parentElement.classList.toggle('visible');
    menuToggle.children[0].classList.toggle('inward');
})

addNew.addEventListener('click', () => {
    createNewBlock("");
})

playground.addEventListener('click', (e) => {
    if (e.target.className === 'draggable')
        console.log('clicked');
})

menu.addEventListener('input', (e) => {
    const el = e.target.closest('.settings');
    const index = Array.prototype.indexOf.call(settings, el)
    if (index > -1) {
        changeSettings(index);
    }
})

menu.addEventListener('click', (e) => {
    const el = e.target.closest('.settings');
    const index = Array.prototype.indexOf.call(settings, el)
    if (e.target.classList.contains('close') && index > -1) {
        console.log(index);
        removeElement(index);
    }
})

function createNewBlock(value) {
    let i = draggable.length;

    playground.append(newBlockTemplate.cloneNode(true));
    menu.append(newSettingsTemplate.cloneNode(true));

    backColors.item(i).value = `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0")}`;
    fontColors.item(i).value = `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0")}`;


    draggable.item(i).style.top = `${Math.random() * (innerHeight - divSizes.item(i).value)}px`;
    draggable.item(i).style.left = `${Math.random() * (innerWidth - divSizes.item(i).value)}px`;

    divValues.item(i).value = value;

    changeSettings(i)
}

function changeSettings(i) {
    draggable.item(i).style.backgroundColor = backColors.item(i).value;
    draggable.item(i).style.color = fontColors.item(i).value;
    draggable.item(i).style.width = `${divSizes.item(i).value}px`;
    draggable.item(i).style.height = `${divSizes.item(i).value}px`;
    draggable.item(i).children.item(0).textContent = divValues.item(i).value;
    draggable.item(i).style.border = `${borderWidths.item(i).value}px solid black`;
    
    divSizeIndicator.item(i).textContent = `${divSizes.item(i).value}px`;

    borderWidthIndicator.item(i).textContent = `${borderWidths.item(i).value}px`;
}

function removeElement(i) {
    draggable.item(i).remove();
    settings.item(i).remove();
}

createNewBlock("Drag me!");