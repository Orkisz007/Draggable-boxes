let boxes = {
    box:            document.getElementsByClassName('draggable'),
    settings:       document.getElementsByClassName('settings'),
    currId:         -1,
    cursorPos:      {x: 0, y: 0}
};

let settings = {
    text:           document.getElementsByName('text'),
    background:     document.getElementsByName('backgroundColor'),
    color:          document.getElementsByName('fontColor'),
    size:           document.getElementsByName('size'),
    outlineWidth:   document.getElementsByName('outlineWidth'),
    outlineColor:   document.getElementsByName("outlineColor"),
    outlineEnabled: document.getElementsByName("outlineEnabled"),
    isDraggable:    document.getElementsByName("isDraggable")
};

let indicators = {
    size:           document.getElementsByClassName('sizeIndicator'),
    outlineWidth:   document.getElementsByClassName('outlineWidthIndicator'),
};

let menuElements = {
    menu:           document.getElementById('Menu'),
    toggle:         document.getElementById('MenuToggle'),
    add:            document.getElementById('AddNew')
}

let playground = document.getElementById('Playground');

let style;

let newBlockTemplate = document.createElement('div');
newBlockTemplate.className = 'draggable';
newBlockTemplate.innerHTML = '<p></p>';

let newSettingsTemplate = document.createElement('section');
newSettingsTemplate.className = 'settings';
newSettingsTemplate.innerHTML = `
    <input type="text" name="text" aria-label="Text inside a block" placeholder="Text inside a block">
    <label class="slider">
        Box Size:
        <input type="range" name="size" min="100" max="300" value="150">
        <span class="sizeIndicator"></span>
    </label>
    <label class="color">
        <abbr title="Background color">BG Col:</abbr>
        <input type="color" name="backgroundColor">
    </label>
    <label class="color">
        <abbr title="Font color">Font Col:</abbr>
        <input type="color" name="fontColor">
    </label>
    <label class="checkbox">
        Outline:
        <input type="checkbox" name="outlineEnabled" checked>
    </label>
    <label class="color">
        <abbr title="Outline color">Outline Col:</abbr>
        <input type="color" name="outlineColor">
    </label>
    <label class="slider">
        <abbr title="Outline width">Outline Width:</abbr>
        <input type="range" name="outlineWidth" min="0" max="5" value="3">
        <span class="outlineWidthIndicator"></span>
    </label>
    <label class="checkbox">
        Draggable:
        <input type="checkbox" name="isDraggable" checked>
    </label>
    <label class="checkbox">
        Collisions:
        <input type="checkbox" name="doCollision">
    </label>
    <p class="close">&#10005;</p>
`;

menuElements.toggle.addEventListener('click', () => {
    menuElements.toggle.parentElement.classList.toggle('visible');
    menuElements.toggle.children[0].classList.toggle('inward');
})

menuElements.add.addEventListener('click', () => {
    createNewBlock("");
})

let mouseHandler = (event) => {moveBox(event)};
playground.addEventListener('mousedown', (e) => {
    boxes.currId = getIndex(e, '.draggable', boxes.box);
    if (boxes.currId >= 0) {
        if (settings.isDraggable.item(boxes.currId).checked) {
            locateCursor(e);
            addEventListener('mousemove', mouseHandler);
            addEventListener('mouseup',
                () => {removeEventListener('mousemove', mouseHandler);},
                {once: true}
            );
        }
    }
})

playground.addEventListener('dblclick', (e) => {
    const index = getIndex(e, '.draggable', boxes.box);
    if (index >= 0) {
        boxes.box.item(index).style.boxShadow = `
        0 0 10px ${parseInt(settings.outlineWidth.item(index).value) + 3}px ${settings.color.item(index).value}
    `;
        boxes.settings.item(index).style.backgroundColor = '#dfdfdf';
        menuElements.toggle.parentElement.classList.toggle('visible', true);
        boxes.settings.item(index).scrollIntoView();
        setTimeout(function () {
            boxes.box.item(index).style.boxShadow = 'none';
            boxes.settings.item(index).style.backgroundColor = '#fff';
        }, 1500);
    }

})

menuElements.menu.addEventListener('input', (e) => {
    const index = getIndex(e, '.settings', boxes.settings);
    if (index > -1) {
        changeSettings(index);
    }
})

menuElements.menu.addEventListener('click', (e) => {
    const index = getIndex(e, '.settings', boxes.settings);
    if (e.target.classList.contains('close') && index >= 0) {
        removeElement(index);
    }
})

menuElements.menu.addEventListener('mouseover', (e) => {
    const index = getIndex(e, '.settings', boxes.settings);
    if (index >= 0) {
        boxes.box.item(index).style.boxShadow = `
            0 0 10px ${parseInt(settings.outlineWidth.item(index).value) +3}px ${settings.color.item(index).value}
        `;
        boxes.settings.item(index).style.backgroundColor = '#dfdfdf';
    }
})

menuElements.menu.addEventListener('mouseout', (e) => {
    const index = getIndex(e, '.settings', boxes.settings);
    if (index >= 0) {
        boxes.box.item(index).style.boxShadow = 'none';
        boxes.settings.item(index).style.backgroundColor = '#fff';
    }
})

function getIndex(e, className, prop) {
    const el = e.target.closest(className);
    if (!el)
        return -1;
    return Array.prototype.indexOf.call(prop, el)
}

function createNewBlock(value) {
    let i = boxes.box.length;

    playground.append(newBlockTemplate.cloneNode(true));
    menuElements.menu.append(newSettingsTemplate.cloneNode(true));

    settings.background.item(i).value = `
        #${Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0")}
    `;
    settings.color.item(i).value = `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0")}`;

    boxes.box.item(i).style.transform =
        `translate(
            ${Math.random() * (innerWidth - settings.size.item(i).value)}px,
            ${Math.random() * (innerHeight - settings.size.item(i).value)}px
        )`;
    boxes.box.item(i).style.left = ``;

    settings.text.item(i).value = value;

    changeSettings(i);
}

function changeSettings(i) {
    boxes.box.item(i).style.backgroundColor = settings.background.item(i).value;
    boxes.box.item(i).style.color = settings.color.item(i).value;
    boxes.box.item(i).style.width = `${settings.size.item(i).value}px`;
    boxes.box.item(i).style.height = `${settings.size.item(i).value}px`;
    boxes.box.item(i).children.item(0).textContent = settings.text.item(i).value;
    
    indicators.size.item(i).textContent = `${settings.size.item(i).value}px`;

    indicators.outlineWidth.item(i).textContent = `${settings.outlineWidth.item(i).value}px`;
    if (settings.outlineEnabled.item(i).checked) {
        settings.outlineColor.item(i).disabled = false;
        settings.outlineWidth.item(i).disabled = false;
        boxes.box.item(i).style.outline = `
            ${settings.outlineWidth.item(i).value}px solid ${settings.outlineColor.item(i).value}
        `;
    }
    else {
        settings.outlineColor.item(i).disabled = true;
        settings.outlineWidth.item(i).disabled = true;
        boxes.box.item(i).style.outline = 'none';
    }
}

function removeElement(i) {
    boxes.box.item(i).remove();
    boxes.settings.item(i).remove();
}

createNewBlock("Drag me!");

function locateCursor(
    /**
     * @type {MouseEvent}
     */
    e
) {
    style = getComputedStyle(boxes.box.item(boxes.currId));
    let transform = style.getPropertyValue('transform').slice(7, -1).split(', ');
    boxes.cursorPos.x = Math.round(e.x - parseFloat(transform.at(4)));
    boxes.cursorPos.y = Math.round(e.y - parseFloat(transform.at(5)));
}

function moveBox(
    /**
      * @type {Event}
      */
    e
) {
    let x = e.x - boxes.cursorPos.x;
    let y = e.y - boxes.cursorPos.y;
    let outlineWidth = 0;
    if (settings.outlineEnabled.item(boxes.currId).checked)
         outlineWidth = parseInt(settings.outlineWidth.item(boxes.currId).value);
    let size = parseInt(settings.size.item(boxes.currId).value) + outlineWidth;
    if (x < 0)
        x = settings.outlineWidth.item(boxes.currId).value;
    else if (x + size > innerWidth)
        x = innerWidth - size;
    if (y < 0)
        y = settings.outlineWidth.item(boxes.currId).value;
    else if (y + size > innerHeight)
        y = innerHeight - size;
    boxes.box.item(boxes.currId).style.transform =
        `translate(${x}px, ${y}px)`;
}

function checkCollision() {
    if (boxes.box.length < 2)
        return;
    let styleI;
    let styleJ;
    let transformI;
    let transformJ;
    let outlineWidthI;
    let outlineWidthJ;
    let sizeI;
    let sizeJ;
    for (let i = 0; i < boxes.box.length; i++) {
        if (settings.outlineEnabled.item(i).checked)
            outlineWidthI = parseInt(settings.outlineWidth.item(i).value);
        sizeI = parseInt(settings.size.item(i).value) + outlineWidthI;
        styleI = getComputedStyle(boxes.box.item(i));
        transformI = styleI.getPropertyValue('transform').slice(7, -1).split(', ');
        for (let j = 0; j < boxes.box.length; j++) {
            if (settings.outlineEnabled.item(j).checked)
                outlineWidthJ = parseInt(settings.outlineWidth.item(j).value);
            sizeJ = parseInt(settings.size.item(j).value) + outlineWidthJ;
            styleJ = getComputedStyle(boxes.box.item(j));
            transformJ = styleJ.getPropertyValue('transform').slice(7, -1).split(', ')
            if (true/*To figure out*/) {
                console.log('collision');
            }
        }
    }
}

function boxMovesBox() {

}

setInterval(gameLoop, 10);

function gameLoop() {
    checkCollision();
}