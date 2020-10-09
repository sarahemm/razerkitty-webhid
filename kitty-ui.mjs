import * as Hardware from './kitty-hardware.mjs';
import * as Storage from './kitty-storage.mjs';

var headset;

async function handleConnectClick() {
  headset = await Hardware.openDevice();
  Storage.loadColours(pickrAll, pickrSingle);
  pickrAll.enable();
  pickrSingle.forEach(function(item) { item.enable(); });
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

const pickr_config_template = {
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

const pickrAll = createPickr('.colorPaletteAll');
const pickrSingle = [
  createPickr('.colorPaletteEarLeft'),
  createPickr('.colorPaletteEarRight'),
  createPickr('.colorPaletteCupLeft'),
  createPickr('.colorPaletteCupRight')
]

pickrSingle.forEach(function(item) {
  item.on('change', (color, instance) => {
    // only take action if the change that caused this
    // event to fire was a user action, not programmatic
    if(item.isOpen()) {
      updateColor();
      clearAllColour();
    }
  });
});

pickrAll.on('change', (color, instance) => {
  updateSingleColours(color);
  updateColor();
});

function createPickr(element) {
  var pickr_config = pickr_config_template;
  pickr_config['el'] = element;

  return Pickr.create(pickr_config);
}

function handleSaveClick() {
  Storage.saveColours(pickrAll, pickrSingle);
}

function updateColor() {
  var rgba = [];
  pickrSingle.forEach(function(item, index) {
    rgba[index] = item.getColor().toRGBA();
  });
  Hardware.changeColor(headset, rgba);
}

function updateSingleColours(color) {
  var newcolor = color.toHEXA().toString();
  pickrSingle.forEach(function(item) {
    item.setColor(newcolor);
  });
}

function clearAllColour() {
  pickrAll.setColor(null);
}

function handleDisconnect() {
  pickrAll.disable();
  pickrSingle.forEach(function(item) { item.disable(); });
  connectButton.disabled = false;
}

if(navigator.hid === undefined) {
  document.getElementById('instructions').style.display = 'block';
  document.getElementById('controls').style.display = 'none';
}

export { handleDisconnect };