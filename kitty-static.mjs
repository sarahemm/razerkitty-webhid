import * as Hardware from './kitty-hardware.mjs';
import * as Storage from './kitty-storage.mjs';
import * as UI from './kitty-ui.mjs';

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

function updateColor() {
  var rgba = [];
  pickrSingle.forEach(function(item, index) {
    rgba[index] = item.getColor().toRGBA();
  });
  Hardware.changeColor(UI.headset, rgba);
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

function enableControls() {
  pickrAll.enable();
  pickrSingle.forEach(function(item) { item.enable(); });
  Storage.loadColours(pickrAll, pickrSingle);
}

function disableControls() {
  pickrAll.disable();
  pickrSingle.forEach(function(item) { item.disable(); });
}

function saveSettings() {
  Storage.saveColours(pickrAll, pickrSingle);
}

export { enableControls, disableControls, updateColor, saveSettings };