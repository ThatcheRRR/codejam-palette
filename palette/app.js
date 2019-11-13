const canvas = document.querySelector('canvas'),
	pencil = document.querySelector('.pencil'),
	bucket = document.querySelector('.bucket'),
	choose = document.querySelector('.choose-color'),
	tool = document.querySelectorAll('.tool'),
	size = 4,
	pencilCode = 80,
	bucketCode = 66,
    chooseCode = 67,
    maxFieldSize = 512,
	redColor = '#F74141',
    blueColor = '#00BCD4',
    ctx = canvas.getContext('2d'),
    red = document.querySelector('.red'),
    blue = document.querySelector('.blue'),
    previous = document.querySelector('.previous-color'),
    color = document.querySelector('input'),
    scale = Math.round(maxFieldSize / size),
    tools = ['bucket', 'colorPicker', 'pencil'];
      
let	pickerActive = false,
	currentColor = '#FFC107',
	previousColor = '#FFEB3B',
    activeTool = 'pencil',
    matrix = [];

if (localStorage.getItem('fieldStatus') === null) {
    matrix = [
        ['#fff', '#fff','#fff','#fff'],
        ['#fff', '#fff','#fff','#fff'],
        ['#fff', '#fff','#fff','#fff'],
        ['#fff', '#fff','#fff','#fff']
    ];
} else if (localStorage.getItem('fieldStatus') !== null) {
    let t = [], counter = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            t.push(localStorage.getItem('fieldStatus').split(',')[counter]);
            counter++;
        }
        matrix.push(t);
        t = [];
    }
}

pencil.classList.add('active-tool');

for (let i = 0; i < tool.length; i++) {
    tool[i].addEventListener('mousedown', selectTool);
}

canvas.addEventListener('mousedown', drawing);
choose.addEventListener('mousedown', colorPicker);
canvas.addEventListener('mousedown', colorPicker);
document.addEventListener('mousedown', changeCurrentColor);
choose.addEventListener('input', selectCurrentColor);
document.addEventListener('keyup', binds);
window.addEventListener('beforeunload', save);

function canvasInit() {
	canvas.width = 512;
	canvas.height = 512;
	let blockWidth = matrix[0].length,
        blockHeight = matrix.length;
    for (let row = 0; row < blockWidth; row++) {
        for (let col = 0; col < blockHeight; col++) {
            ctx.fillStyle = matrix[row][col];
            ctx.fillRect(col * scale, row * scale, scale, scale);
        }
    }
}

canvasInit();

function drawing(event) {
    if (activeTool === 'pencil') {
        ctx.fillStyle = currentColor;
        ctx.fillRect(128 * Math.floor(event.offsetX / 128), 128 * Math.floor(event.offsetY / 128), 128, 128);
        canvas.onmousemove = function(event) {
            ctx.fillRect(128 * Math.floor(event.offsetX / 128), 128 * Math.floor(event.offsetY / 128), 128, 128);
        }
        canvas.onmouseup = function() {
            canvas.onmousemove = null;
        }
        canvas.onmouseout = function() {
            canvas.onmousemove = null;
        }
    } else if (activeTool === 'bucket') {
        canvas.getContext('2d').fillStyle = currentColor;
        canvas.getContext('2d').fillRect(0, 0, 512, 512);
    }
}

function colorPicker(event) {
    if (pickerActive === true  && event.target === canvas) {
        let r = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data[0],
            g = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data[1],
            b = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data[2];
        previousColor = currentColor;
        currentColor = rgbConvert(r, g, b);
        if (previousColor === currentColor) {
            return;
        }
        changeColors();
    } else if (event.target === tool[1] || event.target === tool[1].children[0] || event.target === tool[1].children[1] || event === color) {
        pickerActive = true;
        activeTool = 'colorPicker';
    }
}

function changeColors() {
    if (previousColor === currentColor) {
        return;
    } else {
        document.querySelector('.cur-color').style.backgroundColor = currentColor;
        document.querySelector('.prev-color').style.backgroundColor = previousColor;
    }
}

function changeCurrentColor(event) {
    if (event.target === previous || event.target === previous.children[0] || event.target === previous.children[1]) {
        let temp = currentColor;
        currentColor = previousColor;
        previousColor = temp;
        changeColors();
    }
    if (event.target === red || event.target === red.children[0] || event.target === red.children[1]) {
        previousColor = currentColor;
		currentColor = redColor;
        changeColors();
    }
    if (event.target === blue || event.target === blue.children[0] || event.target === blue.children[1]) {
        previousColor = currentColor;
        currentColor = blueColor;
        changeColors();
    }
}

function rgbConvert(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    if (r.length === 1) r = '0' + r;
    if (g.length === 1) g = '0' + g;
    if (b.length === 1) b = '0' + b;
    return '#' + r + g + b;
}

function save() {
    let arr = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let r = ctx.getImageData(scale * j + 1, scale * i + 1, 1, 1).data[0],
                g = ctx.getImageData(scale * j + 1, scale * i + 1, 1, 1).data[1],
                b = ctx.getImageData(scale * j + 1, scale * i + 1, 1, 1).data[2];
            arr.push(rgbConvert(r, g, b));
        }
    }
    localStorage.setItem('fieldStatus', arr);
}

function selectTool(event) {
    for (let i = 0; i < tool.length; i++) {
        tool[i].classList.remove("active-tool");
        if (event.target === tool[i] || event.target === tool[i].children[0] || event.target === tool[i].children[1]) {
            tool[i].classList.add("active-tool");
            activeTool = tools[i];
            if (activeTool !== 'colorPicker') {
                pickerActive = false;
            }
        }
    }
}

function selectCurrentColor() {
    previousColor = currentColor;
    currentColor = color.value;
    changeColors();
}

function binds(event) {
	switch(event.keyCode) {
	case pencilCode:
		for (let i = 0; i < tool.length; i++) {
			tool[i].classList.remove('active-tool');
		}
        pencil.classList.add('active-tool');
        activeTool = 'pencil';
		pickerActive = false;
		break;
	case bucketCode:
		for (let i = 0; i < tool.length; i++) {
			tool[i].classList.remove('active-tool');
		}
        bucket.classList.add('active-tool');
        activeTool = 'bucket';
		pickerActive = false;
		break;
	case chooseCode:
		for (let i = 0; i < tool.length; i++) {
			tool[i].classList.remove('active-tool');
		}
        choose.classList.add('active-tool');
        activeTool = 'colorPicker';
		pickerActive = true;
		colorPicker(event);
		break;
	}
}