import * as Static from './kitty-static.mjs';
import * as Spectrum from './kitty-spectrum.mjs';
import * as UI from './kitty-ui.mjs';

function profileSave() {
  Static.saveSettings();
  Spectrum.saveSettings();
  UI.saveCurrentTab();
}

function profileLoad() {
  Static.loadSettings();
  Spectrum.loadSettings();
  UI.loadCurrentTab();
}

export { profileSave, profileLoad };