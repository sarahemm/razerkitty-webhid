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
  
  Profiles.profileInit();
  Profiles.profileLoad();

  connectButton.disabled = true;
  saveButton.disabled = false;
  saveAsButton.disabled = false;
  revertButton.disabled = false;
  deleteButton.disabled = Profiles.currentProfile == "Default";
  connected = true;

  startEffect(currentTab);
}

function handleSaveClick() {
  Profiles.profileSave();
}

function handleSaveAsClick() {
  const newProfileName = prompt("Name of new profile (only letters, numbers, and underscore allowed):");
  if(newProfileName == "" || /[^A-Za-z0-9_]/.exec(newProfileName)) {
    alert("Profile name has bad characters or zero length, aborting save.");
    return;
  }
  Profiles.profileSaveAs(newProfileName);
  Profiles.profileInit();
  $('#profileSelect').val(newProfileName).change();
  handleProfileChange();
}

function handleRevertClick() {
  handleProfileChange();
}

function handleDeleteClick() {
  Profiles.profileDelete(Profiles.currentProfile);
  Profiles.profileInit();
  $('#profileSelect').val("Default").change();
  handleProfileChange();
}

function handleProfileChange() {
  stopEffect(currentTab);
  Profiles.changeCurrentProfile($('#profileSelect').val());
  deleteButton.disabled = Profiles.currentProfile == "Default";
  Profiles.profileLoad();
  startEffect(currentTab);
}

function handleDisconnect() {
  stopEffect(currentTab);
  Static.disableControls();
  connectButton.disabled = false;
  saveButton.disabled = true;
  saveAsButton.disabled = true;
  deleteButton.disabled = true;
  revertButton.disabled = true;
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
document.getElementById('saveas-button').addEventListener('click', handleSaveAsClick);
document.getElementById('revert-button').addEventListener('click', handleRevertClick);
document.getElementById('delete-button').addEventListener('click', handleDeleteClick);
document.getElementById('profileSelect').addEventListener('change', handleProfileChange);
var connectButton = document.getElementById('connect-button');
var saveButton = document.getElementById('save-button');
var saveAsButton = document.getElementById('saveas-button');
var revertButton = document.getElementById('revert-button');
var deleteButton = document.getElementById('delete-button');

export { handleDisconnect, saveCurrentTab, loadCurrentTab, headset };