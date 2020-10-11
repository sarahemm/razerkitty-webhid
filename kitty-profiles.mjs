import * as Static from './kitty-static.mjs';
import * as Spectrum from './kitty-spectrum.mjs';
import * as UI from './kitty-ui.mjs';
import * as Util from './kitty-util.mjs';

var currentProfile;

function profilePrefix() {
  if(currentProfile == "Default") {
    // the Default profile saves its items with no prefix
    // (somewhat for backwards-compatibility from before profiles existed)
    return "";
  } else {
    return currentProfile + "-";
  }
}
function profileSave() {
  Static.saveSettings();
  Spectrum.saveSettings();
  UI.saveCurrentTab();
}

function profileLoad() {
  var profileList = Util.getCookie('profileList');
  if(!profileList) {
    // no saved profiles at all, initialize the first one
    currentProfile = 'Default';
    $('#profileSelect').append(new Option("Default", "Default"));
  }
  Static.loadSettings();
  Spectrum.loadSettings();
  UI.loadCurrentTab();
}

function setValue(key, value) {
  const fullKey = profilePrefix() + key;
  document.cookie = fullKey + "=" + value;
}

function getValue(key) {
  const fullKey = profilePrefix() + key;
  return Util.getCookie(fullKey);
}

export { profileSave, profileLoad, setValue, getValue };