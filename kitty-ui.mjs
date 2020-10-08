import * as Hardware from './kitty-hardware.mjs';
import * as Util from './kitty-util.mjs';

var headset;

async function handleConnectClick() {
  headset = await Hardware.openDevice();
  if(Util.getCookie("color") != "") {
    pickr.setColor(Util.getCookie("color"));
  }
  pickr.enable();
  connectButton.disabled = true;
  updateColor();
}

document.getElementById('connect-button').addEventListener('click', handleConnectClick);
document.getElementById('save-button').addEventListener('click', handleSaveClick);
var connectButton = document.getElementById('connect-button');

const kitty_swatches = [
  'rgb(0,   0,   0  )',
  'rgb(255, 0,   0  )',
  'rgb(0,   255, 0  )',
  'rgb(0,   0,   255)',
  'rgb(52,  0,   255)',
  'rgb(255, 0,   255)',
  'rgb(0,   255, 255)',
  'rgb(255, 255, 0  )',
  'rgb(255, 56,  0  )',
  'rgb(255, 255, 255)'
];

const pickr_config = {
  el: '.colorPalette',
  theme: 'classic',
  lockOpacity: true,
  comparison: false,
  disabled: true,
  default: '#ffffff',

  swatches: kitty_swatches,

  components: {

      // Main components
      preview: false,
      opacity: false,
      hue: true,

      // Input / output Options
      interaction: {
          hex: true,
          rgba: true,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: true,
          clear: false,
          cancel: false,
          save: false
      }
  }
}

const pickr = Pickr.create(pickr_config);

pickr.on('change', (color, instance) => {
  updateColor();
});

function handleSaveClick() {
  document.cookie = "color=" + pickr.getColor().toHEXA();
}

function updateColor() {
  var rgba = pickr.getColor().toRGBA();
  Hardware.changeColor(headset, [rgba[0], rgba[1], rgba[2]]);
}

function handleDisconnect() {
  pickr.disable();
  connectButton.disabled = false;
}

if(navigator.hid === undefined) {
  document.getElementById('instructions').style.display = 'block';
  document.getElementById('controls').style.display = 'none';
}

export { handleDisconnect };