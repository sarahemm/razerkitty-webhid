import * as Hardware from './kitty-hardware.mjs';
import * as Profiles from './kitty-profiles.mjs';
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
}

function disableControls() {
  pickrAll.disable();
  pickrSingle.forEach(function(item) { item.disable(); });
}

function saveSettings() {
  Profiles.setValue('leftEar',  pickrSingle[0].getColor().toHEXA().toString());
  Profiles.setValue('rightEar', pickrSingle[1].getColor().toHEXA().toString());
  Profiles.setValue('leftCup',  pickrSingle[2].getColor().toHEXA().toString());
  Profiles.setValue('rightCup', pickrSingle[3].getColor().toHEXA().toString());
}

function loadSettings() {
  if(!Profiles.getValue('leftEar')) {
    return;
  }

  pickrSingle[0].setColor(Profiles.getValue('leftEar'));
  pickrSingle[1].setColor(Profiles.getValue('rightEar'));
  pickrSingle[2].setColor(Profiles.getValue('leftCup'));
  pickrSingle[3].setColor(Profiles.getValue('rightCup'));
  
  const color = pickrSingle[0].getColor().toHEXA().toString();
  var colorsMatch = true;
  pickrSingle.forEach(function(item, index) {
    if(item.getColor().toHEXA().toString() != color) {
      colorsMatch = false;
    }
  });
  // if all the colours match, set the 'all' colour to the same
  // if they don't, null/X out the 'all' colour in the UI
  if(colorsMatch) {
    pickrAll.setColor(pickrSingle[0].getColor().toHEXA().toString());
  } else {
    pickrAll.setColor(null);
  }
}

export { enableControls, disableControls, updateColor, saveSettings, loadSettings };