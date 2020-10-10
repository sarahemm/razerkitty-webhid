import * as Hardware from './kitty-hardware.mjs';
import * as Spectrum from './kitty-spectrum.mjs';
import * as Storage from './kitty-storage.mjs';

const TAB_STATIC = 0;
const TAB_SPECTRUM = 1;

var headset;
var connected = false;
var currentTab = TAB_STATIC;

$( function() {
  $("#controlTabs").tabs({
    activate: function(event, ui) {
      if(connected) {
        stopEffect(ui['oldTab'].index());
        startEffect(ui['newTab'].index());
      }
      currentTab = ui['newTab'].index();
    }
  })
});

// called when a new tab is selected or headset is connected,
// to start the effect
function startEffect(tab) {
  switch(tab) {
    case TAB_STATIC:
      updateColor();
      break;
    case TAB_SPECTRUM:
      Spectrum.startSpectrum(headset);
      break;
  }
}

// called when a new tab is selected, to deactivate the previous effect
function stopEffect(tab) {
  switch(tab) {
    case TAB_SPECTRUM:
      Spectrum.stopSpectrum();
      break;
  }
}

async function handleConnectClick() {
  headset = await Hardware.openDevice();
  if(headset === null) {
    return;
  }
  Storage.loadColours(pickrAll, pickrSingle);
  pickrAll.enable();
  pickrSingle.forEach(function(item) { item.enable(); });
  connectButton.disabled = true;
  connected = true;
  startEffect(currentTab);
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
  stopEffect(currentTab);
  pickrAll.disable();
  pickrSingle.forEach(function(item) { item.disable(); });
  connectButton.disabled = false;
  connected = false;
}

if(navigator.hid === undefined) {
  document.getElementById('instructions').style.display = 'block';
  document.getElementById('controls').style.display = 'none';
}

export { handleDisconnect };