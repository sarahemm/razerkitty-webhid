import * as Hardware from './kitty-hardware.mjs';
import * as Static from './kitty-static.mjs';
import * as Spectrum from './kitty-spectrum.mjs';
import * as Profiles from './kitty-profiles.mjs';

const TAB_STATIC = 0;
const TAB_SPECTRUM = 1;

var headset;
var connected = false;
var currentTab = TAB_STATIC;

$( function() {
  $("#controlTabs").tabs({
    activate: function(event, ui) {
      // only trigger if the user clicked a new tab,
      // not a programmatic change
      if(connected && event['button'] !== undefined) {
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
  switch(parseInt(tab)) {
    case TAB_STATIC:
      Static.updateColor();
      break;
    case TAB_SPECTRUM:
      Spectrum.startSpectrum(headset);
      break;
    default:
      console.log("startEffect called with unknown effect '" + tab + "'.");
  }
}

// called when a new tab is selected, to deactivate the previous effect
function stopEffect(tab) {
  switch(parseInt(tab)) {
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
  
  Profiles.profileLoad();

  connectButton.disabled = true;
  saveButton.disabled = false;
  loadButton.disabled = false;
  connected = true;

  startEffect(currentTab);
}

function handleSaveClick() {
  Profiles.profileSave();
}

function handleLoadClick() {
  Profiles.profileLoad();
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
  Profiles.setValue('currentEffect', $("#controlTabs").tabs('option', 'active'));
}

function loadCurrentTab() {
  if(!Profiles.getValue('currentEffect')) { return; }
  
  stopEffect(currentTab);

  currentTab = Profiles.getValue('currentEffect')
  $("#controlTabs").tabs({active: currentTab});

  startEffect(currentTab);
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

export { handleDisconnect, saveCurrentTab, loadCurrentTab, headset };