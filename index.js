// Recreation of @samdape work [https://x.com/colderoshay/status/1864718709031645580]

let input;
let img;
let processed = false;
let cols = 60;
let rows = 30;
let bgColor = '#FFF';
let fgColor = '#000';
let width = 500;
let height = 500;
let saveName = 'my-cat-coal';

let brightnessSlider;
let resolutionSlider;
let spacingSlider;

// unicode block levels (darkest to lightest)
let blocks = [
    "\u2588",
    "\u2589",
    "\u258A",
    "\u258B",
    "\u258C",
    "\u258D",
    "\u258E",
    "\u258F",
    " ",
];

function setup() {
    createCanvas(width, height);
    textFont("monospace", 12);
    textAlign(LEFT, TOP);

    // load an image
    img = loadImage(saveName + ".jpeg", (data) => {
        processed = true;
        redraw();
    });

    fill(fgColor);
    text("select an image file to process", 10, 40);
}

function draw() {
    if (!processed || !img) return;

    background(bgColor);
    let bright = document.getElementById('brightnessSlider').value;
    let cols = document.getElementById('resolutionSlider').value;
    let spacing = document.getElementById('spacingSlider').value;

    // Calculate dimensions
    rows = int((cols * img.height) / img.width / 2); // Adjust for character aspect ratio
    let w = width / cols;
    let h = height / rows;

    // Resize image to match grid
    img.loadPixels();

    // Process each cell
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Sample image at grid position
            let imgX = int(map(x, 0, cols, 0, img.width));
            let imgY = int(map(y, 0, rows, 0, img.height));
            let index = (imgY * img.width + imgX) * 4;

            // Calculate brightness
            let r = img.pixels[index];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let brightness = ((r + g + b) / (3 * 255)) * bright;

            // Map brightness to block character
            let blockIndex = floor(map(brightness, 0, 1, 0, blocks.length - 1));
            let char = blocks[blockIndex];

            // Draw character
            textSize(w * spacing); // Adjust for better coverage
            text(char, x * w, y * h);
        }
    }
}


function keyTyped() {
    if (key === "s") {
        handleSave();
    }
}


function handleSave() {
    let id = new Date().getSeconds();
    saveCanvas(`ASCII-${saveName}-${id}`, 'png');
}

function handleSize(e, type) {
    let value = e.target.value;
    if (type == 'width') {
        width = value;
    } else {
        height = value;
    };
    resizeCanvas(width, height);
}

function handleFile(e) {
    let file = e.target.files[0];
    if (!file) return;
    saveName = file.name.split('.')[0];
    let reader = new FileReader();
    if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            let data = e.target.result; // Base64 数据
            img = loadImage(data, () => {
                processed = true;
                redraw();
            });
        }
    } else {
        processed = false;
        background(bgColor);
        fill(fgColor);
        text("not an image file!", 10, 40);
    }
}