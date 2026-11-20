let draggable = document.getElementsByClassName('draggable');
let settings = document.getElementsByClassName('settings');
let body = document.getElementsByTagName('body').item(0);

let divValues = document.getElementsByName('divValue');
let backColors = document.getElementsByName('backColor');
let fontColors = document.getElementsByName('fontColor');
let divSizes = document.getElementsByName('divSize');
let outlineWidths = document.getElementsByName('outlineWidth');
let divSizeIndicator = document.getElementsByClassName('divSize');
let outlineWidthIndicator = document.getElementsByClassName('outlineWidth');
let outlineColor = document.getElementsByName("outlineColor");
let outline = document.getElementsByName("outline");
let isDraggable = document.getElementsByName("draggable");

let playground = document.getElementById('Playground');
let menu = document.getElementById('Menu');
let menuToggle = document.getElementById('MenuToggle');
let addNew = document.getElementById('AddNew');

let newBlockTemplate = document.createElement('div');
newBlockTemplate.className = 'draggable';
newBlockTemplate.innerHTML = '<p></p>';

let style;
let innerX = 0;
let innerY = 0
let draggedIndex = -1;

let newSettingsTemplate = document.createElement('section');
newSettingsTemplate.className = 'settings';
newSettingsTemplate.innerHTML =
    `<input type="text" name="divValue" aria-label="Text inside a block" placeholder="Text inside a block">
    <label class="slider">
        Box Size:
        <input type="range" name="divSize" min="100" max="300" value="150">
        <span class="divSize"></span>
    </label>
    <label class="color">
        <abbr title="Background color">BG Col:</abbr>
        <input type="color" name="backColor">
    </label>
    <label class="color">
        <abbr title="Font color">Font Col:</abbr>
        <input type="color" name="fontColor">
    </label>
    <label class="check">
        Outline:
        <input type="checkbox" name="outline" checked>
    </label>
    <label class="color">
        <abbr title="Border color">Outline Col:</abbr>
        <input type="color" name="outlineColor">
    </label>
    <label class="slider">
        <abbr title="Border width">Outline Width:</abbr>
        <input type="range" name="outlineWidth" min="0" max="5" value="3">
        <span class="outlineWidth"></span>
    </label>
    <label class="check">
        Draggable:
        <input type="checkbox" name="draggable" checked>
    </label>
    <label class="check">
        Collisions:
        <input type="checkbox" name="collision">
    </label>
    <p class="close">&#10005;</p>`;

menuToggle.addEventListener('click', () => {
    menuToggle.parentElement.classList.toggle('visible');
    menuToggle.children[0].classList.toggle('inward');
})

addNew.addEventListener('click', () => {
    createNewBlock("");
})

let mouseHandler = (event) => {moveBox(event)};
playground.addEventListener('mousedown', (e) => {
    const el = e.target.closest('.draggable');
    draggedIndex = Array.prototype.indexOf.call(draggable, el)
    if (draggedIndex >= 0) {
        if (isDraggable.item(draggedIndex).checked) {
            locateCursor(e);
            body.addEventListener('mousemove', mouseHandler);
        }
    }
})

playground.addEventListener('dblclick', (e) => {
    const el = e.target.closest('.draggable');
    const index = Array.prototype.indexOf.call(draggable, el);
    if (index >= 0) {
        draggable.item(index).style.boxShadow = `
            0 0 10px ${parseInt(outlineWidths.item(index).value) +3}px ${fontColors.item(index).value}`;
        settings.item(index).style.backgroundColor = '#dfdfdf';
        menuToggle.parentElement.classList.toggle('visible', true);
        settings.item(index).scrollIntoView();
        setTimeout(function () {
            draggable.item(index).style.boxShadow = 'none';
            settings.item(index).style.backgroundColor = '#fff';
        }, 1500);
    }
})

body.addEventListener('mouseup', () => {
    body.removeEventListener('mousemove', mouseHandler);
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
    const index = Array.prototype.indexOf.call(settings, el);
    if (e.target.classList.contains('close') && index >= 0) {
        removeElement(index);
    }
})

menu.addEventListener('mouseover', (e) => {
    const el = e.target.closest('.settings');
    const index = Array.prototype.indexOf.call(settings, el);
    if (index >= 0) {
        draggable.item(index).style.boxShadow = `
            0 0 10px ${parseInt(outlineWidths.item(index).value) +3}px ${fontColors.item(index).value}`;
        settings.item(index).style.backgroundColor = '#dfdfdf';
    }
})

menu.addEventListener('mouseout', (e) => {
    const el = e.target.closest('.settings');
    const index = Array.prototype.indexOf.call(settings, el);
    if (index >= 0) {
        draggable.item(index).style.boxShadow = 'none';
        settings.item(index).style.backgroundColor = '#fff';
    }
})

function createNewBlock(value) {
    let i = draggable.length;

    playground.append(newBlockTemplate.cloneNode(true));
    menu.append(newSettingsTemplate.cloneNode(true));

    backColors.item(i).value = `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0")}`;
    fontColors.item(i).value = `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0")}`;

    draggable.item(i).style.transform =
        `translate(
            ${Math.random() * (innerWidth - divSizes.item(i).value)}px,
            ${Math.random() * (innerHeight - divSizes.item(i).value)}px
        )`;
    draggable.item(i).style.left = ``;

    divValues.item(i).value = value;

    changeSettings(i);
}

function changeSettings(i) {
    draggable.item(i).style.backgroundColor = backColors.item(i).value;
    draggable.item(i).style.color = fontColors.item(i).value;
    draggable.item(i).style.width = `${divSizes.item(i).value}px`;
    draggable.item(i).style.height = `${divSizes.item(i).value}px`;
    draggable.item(i).children.item(0).textContent = divValues.item(i).value;
    
    divSizeIndicator.item(i).textContent = `${divSizes.item(i).value}px`;

    outlineWidthIndicator.item(i).textContent = `${outlineWidths.item(i).value}px`;
    if (outline.item(i).checked) {
        outlineColor.item(i).disabled = false;
        outlineWidths.item(i).disabled = false;
        draggable.item(i).style.outline = `${outlineWidths.item(i).value}px solid ${outlineColor.item(i).value}`;
    }
    else {
        outlineColor.item(i).disabled = true;
        outlineWidths.item(i).disabled = true;
        draggable.item(i).style.outline = 'none';
    }
}

function removeElement(i) {
    draggable.item(i).remove();
    settings.item(i).remove();
}

createNewBlock("Drag me!");

function locateCursor(
    /**
     * @type {MouseEvent}
     */
    e
) {
    style = getComputedStyle(draggable.item(draggedIndex));
    let transform = style.getPropertyValue('transform').slice(7, -1).split(', ');
    console.log(transform.at(4) + " x " + transform.at(5));
    innerX = Math.round(e.x - parseFloat(transform.at(4)));
    innerY = Math.round(e.y - parseFloat(transform.at(5)));
}

function moveBox(
    /**
      * @type {Event}
      */
    e
) {
    let x = e.x - innerX;
    let y = e.y - innerY;
    let style = getComputedStyle(draggable.item(draggedIndex));
    let outlineWidth = 0;
    if (outline.item(draggedIndex).checked)
         outlineWidth = parseInt(style.outlineWidth.slice(0, -2));
    let size = parseInt(style.width.slice(0, -2)) + outlineWidth;
    if (x < 0)
        x = outlineWidth;
    else if (x + parseInt(style.width.slice(0, -2)) + outlineWidth > innerWidth)
        x = innerWidth - size;
    if (y < 0)
        y = outlineWidth;
    else if (y + parseInt(style.height.slice(0, -2)) + outlineWidth > innerHeight)
        y = innerHeight - size;
    draggable.item(draggedIndex).style.transform =
        `translate(
            ${x}px,
            ${y}px
        )`;
}