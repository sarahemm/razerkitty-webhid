import * as Hardware from './kitty-hardware.mjs';
import * as Static from './kitty-static.mjs';
import * as Spectrum from './kitty-spectrum.mjs';
import * as Util from './kitty-util.mjs';

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
      Static.updateColor();
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
  Static.enableControls();

  Static.loadSettings();
  Spectrum.loadSettings();
  loadCurrentTab();

  connectButton.disabled = true;
  saveButton.disabled = false;
  loadButton.disabled = false;
  connected = true;

  startEffect(currentTab);
}

function handleSaveClick() {
  Static.saveSettings();
  Spectrum.saveSettings();
  saveCurrentTab();
}

function handleLoadClick() {
  Static.loadSettings();
  Spectrum.loadSettings();
  loadCurrentTab();
}

function handleDisconnect() {
  stopEffect(currentTab);
  Static.disableControls();
  connectButton.disabled = false;
  saveButton.disabled = true;
  loadButton.disabled = true;
  connected = false;
}

function saveCurrentTab() {
  document.cookie = "currentEffect=" + $("#controlTabs").tabs('option', 'active');
}

function loadCurrentTab() {
  if(Util.getCookie('currentEffect')) {
    currentTab = Util.getCookie('currentEffect')
    $("#controlTabs").tabs({active: currentTab});
  }
}

if(navigator.hid === undefined) {
  document.getElementById('instructions').style.display = 'block';
  document.getElementById('controls').style.display = 'none';
}

document.getElementById('connect-button').addEventListener('click', handleConnectClick);
document.getElementById('save-button').addEventListener('click', handleSaveClick);
document.getElementById('load-button').addEventListener('click', handleLoadClick);
var connectButton = document.getElementById('connect-button');
var saveButton = document.getElementById('save-button');
var loadButton = document.getElementById('load-button');

export { handleDisconnect, headset };