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

function profileSaveAs(profileName) {
  currentProfile = profileName;
  profileSave();
}

function changeCurrentProfile(profileName) {
  currentProfile = profileName;
}

function profileInit() {
  $('#profileSelect').empty();
  currentProfile = 'Default';

  var profileList = getProfileList();
  profileList.forEach(function(item, index) {
    $('#profileSelect').append(new Option(item, item));
  });
}

function profileLoad() {
  Static.loadSettings();
  Spectrum.loadSettings();
  UI.loadCurrentTab();
}

function profileDelete(profileName) {
  const decodedCookies = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookies.split(';');
  cookieArray.forEach(function(item, index) {
    const thisCookie = item.trim().split("=");
    const profileSplit = thisCookie[0].split("-");
    if(profileSplit[0] == profileName) {
      Util.deleteCookie(item);
    }
  });
}

function getProfileList() {
  var profileList = ['Default'];

  const decodedCookies = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookies.split(';');
  cookieArray.forEach(function(item, index) {
    const thisCookie = item.trim().split("=");
    const profileSplit = thisCookie[0].split("-");
    if(profileSplit.length == 2 && profileSplit[1] == "currentEffect") {
      profileList.push(profileSplit[0]);
    }
  });

  return profileList;
}

function setValue(key, value) {
  const fullKey = profilePrefix() + key;
  document.cookie = fullKey + "=" + value;
}

function getValue(key) {
  const fullKey = profilePrefix() + key;
  return Util.getCookie(fullKey);
}

export { profileSave, profileSaveAs, profileLoad, profileInit, profileDelete, setValue, getValue, changeCurrentProfile, currentProfile };