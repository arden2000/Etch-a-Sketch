const gridContainer = document.querySelector('div.grid-container');
const colorPicker = document.querySelector('input#colorpicker');
let mouseDown = false;
let eraserOn = false;
let rainbowOn = false;

colorPicker.addEventListener('change', () => {
    turnEraserOff();
    turnRainbowOff();
});

gridContainer.addEventListener('mouseleave', () => {
    mouseDown = false;
}, {capture: false});

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
}

updateGrid(16);

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
eraserBtn.addEventListener("click", () => {
    turnRainbowOff();
    eraserOn ? turnEraserOff() : turnEraserOn();
});

function turnEraserOn(){
    eraserOn = true;
    eraserBtn.style.backgroundColor = 'red';
}

function turnEraserOff(){
    eraserOn = false;
    eraserBtn.style.backgroundColor = 'white';
}

/*function toggleEraser() {
    if (rainbowOn) toggleRainbow();
    eraserBtn.style.backgroundColor = eraserBtn.style.backgroundColor == 'white' ? 'red' : 'white';
    eraserOn = !eraserOn;
}*/

const rainbowBtn = document.querySelector('button#rainbow');
rainbowBtn.addEventListener("click", () => {
    turnEraserOff();
    rainbowOn ? turnRainbowOff() : turnRainbowOn();
});

/*function toggleRainbow() {
    if (eraserOn) toggleEraser(eraserBtn);
    rainbowBtn.style.backgroundColor = rainbowBtn.style.backgroundColor == 'white' ? 'green' : 'white';
    rainbowOn = !rainbowOn;
}*/

function turnRainbowOn(){
    rainbowOn = true;
    rainbowBtn.style.backgroundColor = 'blue';
}

function turnRainbowOff(){
    rainbowOn = false;
    rainbowBtn.style.backgroundColor = 'white';
}

function createGridSquare() {
    let grid = document.createElement('div');
    grid.style.backgroundColor = 'white';
    
    grid.addEventListener('mouseover', function (e) {
        if (mouseDown) {
            if (rainbowOn) {
                // https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
                this.style.backgroundColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                this.classList.add('changed');
            }
            else if (eraserOn) {
                this.style.backgroundColor = 'white';
                this.classList.remove('changed');
            }
            else {
                this.style.backgroundColor = colorPicker.value;
                this.classList.add('changed');
            }
        }
        else if (!this.classList.contains('changed')) {
            this.style.backgroundColor = 'grey';
        }
    });
    
    grid.addEventListener('mouseout', function (e) {
        if (!this.classList.contains('changed')) {
            this.style.backgroundColor = 'white';
        }
    });

    grid.addEventListener('mousedown', function (e) {
        mouseDown = true;
        if (rainbowOn) {
            this.style.backgroundColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
            this.classList.add('changed');
        }
        else if (eraserOn) {
            this.style.backgroundColor = 'white';
            this.classList.remove('changed');
        }
        else {
            this.style.backgroundColor = colorPicker.value;
            this.classList.add('changed');
        }
    });

    grid.addEventListener('mouseup', function (e) {
        mouseDown = false;
    });

    return grid;
}