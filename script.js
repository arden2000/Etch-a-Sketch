const START_GRID_SIZE = 16;

let mouseDown = false;
let mode = 'color';

// https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

const showGridBtn = document.querySelector('button#show-grid');
showGridBtn.addEventListener('click', () => {
    showGridBtn.classList.toggle('active');
    toggleShowGrid();
});

const colorPicker = document.querySelector('input#colorpicker');
colorPicker.addEventListener('change', () => {
    mode = 'color';
    eraserBtn.classList.remove('active');
    rainbowBtn.classList.remove('active');
});

const gridContainer = document.querySelector('div.grid-container');
gridContainer.addEventListener('mouseleave', () => {
    mouseDown = false;
}, { capture: false });

const gridSlider = document.querySelector('input#grid-size-slider');
const gridSizeOutput = document.querySelector('span#slider-output');
gridSlider.min = 16;
gridSlider.max = 64;
gridSlider.value = 16;
gridSizeOutput.textContent = gridSlider.value + ' x ' + gridSlider.value;
gridSlider.addEventListener("change", function (e) {
    updateGrid(gridSlider.value);
});
gridSlider.addEventListener("mousemove", function (e) {
    gridSizeOutput.textContent = gridSlider.value + ' x ' + gridSlider.value;
});

const eraserBtn = document.querySelector('button#eraser');
eraserBtn.addEventListener('click', () => {toggleMode('eraser', eraserBtn);});

const rainbowBtn = document.querySelector('button#rainbow');
rainbowBtn.addEventListener('click', () => {toggleMode('rainbow', rainbowBtn);});

const clearBtn = document.querySelector('button#clear');
clearBtn.addEventListener('click', clearGrid);

const lightenBtn = document.querySelector('button#lighten');
lightenBtn.addEventListener('click', () => {toggleMode('lighten', lightenBtn);});

const darkenBtn = document.querySelector('button#darken');
darkenBtn.addEventListener('click', () => {toggleMode('darken', darkenBtn);});

updateGrid(START_GRID_SIZE);

function toggleMode(modeStr, btn){
    if (btn == undefined) return;
    turnOffOtherButtons(btn);
    mode = (mode == modeStr) ? 'color' : modeStr;
    (mode == modeStr) ? btn.classList.add('active') 
        : btn.classList.remove('active');
}

function clearGrid() {
    (gridContainer.childNodes).forEach(cell => {
        cell.style.backgroundColor = 'white';
    });
}

function toggleShowGrid(){
    (gridContainer.childNodes).forEach(cell => {
        cell.classList.toggle('visible');
    });
}

function createGridSquare() {
    let grid = document.createElement('div');
    grid.style.backgroundColor = 'white';
    grid.classList.add('cell');

    grid.addEventListener('mouseover', function (e) {
        if (mouseDown) {
            colorCell(this);
        }
    });
    grid.addEventListener('mousedown', function (e) {
        mouseDown = true;
        colorCell(this);
    });

    grid.addEventListener('mouseup', function (e) {
        mouseDown = false;
    });
    return grid;
}

function colorCell(cell) {
    switch (mode) {
        case 'rainbow':
            // https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
            cell.style.backgroundColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
            break;
        case 'eraser':
            cell.style.backgroundColor = 'white';
            break;
        case 'color':
            cell.style.backgroundColor = colorPicker.value;
            break;
        case 'lighten':
            cell.style.backgroundColor = LightenDarkenColor(rgb2hex(cell.style.backgroundColor), 20);
            break;
        case 'darken':
            cell.style.backgroundColor = LightenDarkenColor(rgb2hex(cell.style.backgroundColor), -20);
            break;
    }
}

function turnOffOtherButtons(btn){
    if (btn != eraserBtn) eraserBtn.classList.remove('active');
    if (btn != rainbowBtn) rainbowBtn.classList.remove('active');
    if (btn != darkenBtn) darkenBtn.classList.remove('active');
    if (btn != lightenBtn) lightenBtn.classList.remove('active');
}

function updateGrid(gridSize) {
    // clears grid
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    //updates grid style attributes to fit new size
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    
    // fills grid
    for (let i = 0; i < gridSize ** 2; i++) {
        gridContainer.appendChild(createGridSquare());
    }

    // keeps grid visible if option is selected
    if (showGridBtn.classList.contains('active')){
        toggleShowGrid();
    }
}

//https://css-tricks.com/snippets/javascript/lighten-darken-color/
function LightenDarkenColor(col,amt) {
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}