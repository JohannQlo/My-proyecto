const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageInput = document.getElementById("imageInput");
const addLayerBtn = document.getElementById("addLayer");
const layersPanel = document.getElementById("layersPanel");
const effectsSelect = document.getElementById("effects");
const colorPicker = document.getElementById("colorPicker");
const generateGifBtn = document.getElementById("generateGif");
const downloadLink = document.getElementById("downloadLink");

canvas.width = 500;
canvas.height = 500;

let layers = [];

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                addLayer(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function addLayer(image) {
    let layer = {
        image: image,
        effect: "none",
        customColor: "#ffffff"
    };
    layers.push(layer);
    updateLayersPanel();
    drawCanvas();
}

function updateLayersPanel() {
    layersPanel.innerHTML = "";
    layers.forEach((layer, index) => {
        let layerDiv = document.createElement("div");
        layerDiv.className = "layer";
        layerDiv.innerHTML = `
            <span>Capa ${index + 1}</span>
            <button onclick="removeLayer(${index})">X</button>
        `;
        layersPanel.appendChild(layerDiv);
    });
}

function removeLayer(index) {
    layers.splice(index, 1);
    updateLayersPanel();
    drawCanvas();
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layers.forEach(layer => {
        applyEffect(layer);
    });
}

function applyEffect(layer) {
    ctx.drawImage(layer.image, 0, 0, canvas.width, canvas.height);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;

    switch (effectsSelect.value) {
        case "bw":
            for (let i = 0; i < pixels.length; i += 4) {
                let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
                pixels[i] = pixels[i + 1] = pixels[i + 2] = avg;
            }
            break;
        case "redblue":
            for (let i = 0; i < pixels.length; i += 4) {
                let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
                pixels[i] = avg;
                pixels[i + 1] = 0;
                pixels[i + 2] = 255 - avg;
            }
            break;
        case "greenpurple":
            for (let i = 0; i < pixels.length; i += 4) {
                let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
                pixels[i] = 0;
                pixels[i + 1] = avg;
                pixels[i + 2] = 255 - avg;
            }
            break;
        case "custom":
            let color = hexToRgb(colorPicker.value);
            for (let i = 0; i < pixels.length; i += 4) {
                pixels[i] = (pixels[i] + color.r) / 2;
                pixels[i + 1] = (pixels[i + 1] + color.g) / 2;
                pixels[i + 2] = (pixels[i + 2] + color.b) / 2;
            }
            break;
    }

    ctx.putImageData(imageData, 0, 0);
}

function hexToRgb(hex) {
    let bigint = parseInt(hex.substring(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

generateGifBtn.addEventListener("click", () => {
    let gif = new GIF({
        workers: 2,
        quality: 10
    });

    gif.addFrame(canvas, { delay: 200 });
    gif.on('finished', function(blob) {
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.style.display = "block";
        downloadLink.innerText = "Descargar GIF";
    });

    gif.render();
});
