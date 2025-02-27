const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorTone = document.getElementById("colorTone");
const generateGif = document.getElementById("generateGif");
const output = document.getElementById("output");

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                applyDithering();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

colorTone.addEventListener("input", () => {
    applyDithering();
});

function applyDithering() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        let newColor = avg > 128 ? 255 : 0;  // Dithering básico (blanco y negro)
        pixels[i] = pixels[i + 1] = pixels[i + 2] = newColor;

        // Aplicar filtro de color según el slider
        let hueShift = parseInt(colorTone.value);
        let hsl = rgbToHsl(pixels[i], pixels[i + 1], pixels[i + 2]);
        hsl[0] = (hsl[0] + hueShift) % 360;
        let rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

        pixels[i] = rgb[0];
        pixels[i + 1] = rgb[1];
        pixels[i + 2] = rgb[2];
    }

    ctx.putImageData(imageData, 0, 0);
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        let hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;

        h /= 360;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

generateGif.addEventListener("click", () => {
    let gif = new GIF({
        workers: 2,
        quality: 10
    });

    gif.addFrame(canvas, { delay: 200 });

    gif.on('finished', (blob) => {
        let url = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = url;
        link.download = "dithered.gif";
        link.innerText = "Descargar GIF";
        output.innerHTML = "";
        output.appendChild(link);
    });

    gif.render();
});
