const START_GRID_SIZE = 16;

let mouseDown = false;
let mode = 'color';

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

updateGrid(START_GRID_SIZE);

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
eraserBtn.addEventListener("click", toggleEraser);

const rainbowBtn = document.querySelector('button#rainbow');
rainbowBtn.addEventListener("click",toggleRainbow);

const clearBtn = document.querySelector('button#clear');
clearBtn.addEventListener('click', clearGrid);

function toggleEraser(){
    mode = (mode == 'eraser') ? 'color' : 'eraser';
    (mode == 'eraser') ? eraserBtn.classList.add('active') 
        : eraserBtn.classList.remove('active');
    rainbowBtn.classList.remove('active');
}

function toggleRainbow(){
    mode = (mode == 'rainbow') ? 'color' : 'rainbow';
    (mode == 'rainbow') ? rainbowBtn.classList.add('active') 
        : rainbowBtn.classList.remove('active');
    eraserBtn.classList.remove('active');
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
    }
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