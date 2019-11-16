const canvas = document.querySelector('canvas');
const pencil = document.querySelector('.pencil');
const bucket = document.querySelector('.bucket');
const choose = document.querySelector('.choose-color');
const tool = document.querySelectorAll('.tool');
const size = 4;
const pencilCode = 80;
const bucketCode = 66;
const chooseCode = 67;
const maxFieldSize = 512;
const redColor = '#F74141';
const blueColor = '#00BCD4';
const ctx = canvas.getContext('2d');
const red = document.querySelector('.red');
const blue = document.querySelector('.blue');
const previous = document.querySelector('.previous-color');
const color = document.querySelector('input');
const sc = Math.round(maxFieldSize / size);
const tools = ['bucket', 'colorPicker', 'pencil'];

let pickerActive = false;
let currentColor = '#FFC107';
let previousColor = '#FFEB3B';
let activeTool = 'pencil';
let matrix = [];

if (localStorage.getItem('fieldStatus') === null) {
  matrix = [
    ['#fff', '#fff', '#fff', '#fff'],
    ['#fff', '#fff', '#fff', '#fff'],
    ['#fff', '#fff', '#fff', '#fff'],
    ['#fff', '#fff', '#fff', '#fff'],
  ];
} else if (localStorage.getItem('fieldStatus') !== null) {
  let t = []; let
    counter = 0;
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      t.push(localStorage.getItem('fieldStatus').split(',')[counter]);
      counter += 1;
    }
    matrix.push(t);
    t = [];
  }
}

pencil.classList.add('active-tool');

function canvasInit() {
  canvas.width = 512;
  canvas.height = 512;
  const blockWidth = matrix[0].length;
  const blockHeight = matrix.length;
  for (let row = 0; row < blockWidth; row += 1) {
    for (let col = 0; col < blockHeight; col += 1) {
      ctx.fillStyle = matrix[row][col];
      ctx.fillRect(col * sc, row * sc, sc, sc);
    }
  }
}

canvasInit();

function changeColors() {
  if (previousColor === currentColor) return;
  document.querySelector('.cur-color').style.backgroundColor = currentColor;
  document.querySelector('.prev-color').style.backgroundColor = previousColor;
}

function rgbConvert(r, g, b) {
  let redConvert = r.toString(16);
  let greenConvert = g.toString(16);
  let blueConvert = b.toString(16);
  if (redConvert.length === 1) redConvert = `0${redConvert}`;
  if (greenConvert.length === 1) greenConvert = `0${greenConvert}`;
  if (blueConvert.length === 1) blueConvert = `0${blueConvert}`;
  return `#${redConvert}${greenConvert}${blueConvert}`;
}

function drawing(e) {
  if (activeTool === 'pencil') {
    ctx.fillStyle = currentColor;
    ctx.fillRect(sc * Math.floor(e.offsetX / sc), sc * Math.floor(e.offsetY / sc), sc, sc);
    canvas.onmousemove = (k) => {
      ctx.fillRect(sc * Math.floor(k.offsetX / sc), sc * Math.floor(k.offsetY / sc), sc, sc);
    };
    canvas.onmouseup = () => {
      canvas.onmousemove = null;
    };
    canvas.onmouseout = () => {
      canvas.onmousemove = null;
    };
  } else if (activeTool === 'bucket') {
    canvas.getContext('2d').fillStyle = currentColor;
    canvas.getContext('2d').fillRect(0, 0, maxFieldSize, maxFieldSize);
  }
}

function colorPicker(e) {
  if (pickerActive === true && e.target === canvas) {
    const r = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[0];
    const g = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[1];
    const b = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[2];
    previousColor = currentColor;
    currentColor = rgbConvert(r, g, b);
    if (previousColor === currentColor) {
      return;
    }
    changeColors();
  } else if (e.currentTarget === tool[1]) {
    pickerActive = true;
    activeTool = 'colorPicker';
  }
}

function changeCurrentColor(e) {
  if (e.target === previous || e.target === previous.children[1]) {
    const temp = currentColor;
    currentColor = previousColor;
    previousColor = temp;
    changeColors();
  }
  if (e.target === red || e.target === red.children[1]) {
    previousColor = currentColor;
    currentColor = redColor;
    changeColors();
  }
  if (e.target === blue || e.target === blue.children[1]) {
    previousColor = currentColor;
    currentColor = blueColor;
    changeColors();
  }
}

function save() {
  const arr = [];
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      const r = ctx.getImageData(sc * j + 1, sc * i + 1, 1, 1).data[0];
      const g = ctx.getImageData(sc * j + 1, sc * i + 1, 1, 1).data[1];
      const b = ctx.getImageData(sc * j + 1, sc * i + 1, 1, 1).data[2];
      arr.push(rgbConvert(r, g, b));
    }
  }
  localStorage.setItem('fieldStatus', arr);
}

function selectTool(e) {
  for (let i = 0; i < tool.length; i += 1) {
    tool[i].classList.remove('active-tool');
    if (e.currentTarget === tool[i]) {
      tool[i].classList.add('active-tool');
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
  switch (event.keyCode) {
    case pencilCode:
      for (let i = 0; i < tool.length; i += 1) {
        tool[i].classList.remove('active-tool');
      }
      pencil.classList.add('active-tool');
      activeTool = 'pencil';
      pickerActive = false;
      break;
    case bucketCode:
      for (let i = 0; i < tool.length; i += 1) {
        tool[i].classList.remove('active-tool');
      }
      bucket.classList.add('active-tool');
      activeTool = 'bucket';
      pickerActive = false;
      break;
    case chooseCode:
      for (let i = 0; i < tool.length; i += 1) {
        tool[i].classList.remove('active-tool');
      }
      choose.classList.add('active-tool');
      activeTool = 'colorPicker';
      pickerActive = true;
      colorPicker(event);
      break;
    default:
      break;
  }
}

for (let i = 0; i < tool.length; i += 1) {
  tool[i].addEventListener('mousedown', selectTool);
}

canvas.addEventListener('mousedown', drawing);
choose.addEventListener('mousedown', colorPicker);
canvas.addEventListener('mousedown', colorPicker);
choose.addEventListener('input', selectCurrentColor);
document.addEventListener('keyup', binds);
window.addEventListener('beforeunload', save);
