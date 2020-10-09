import * as Util from './kitty-util.mjs';
import { getCookie } from './kitty-util.mjs';

function saveColours(pickrAll, pickrSingle) {
  document.cookie = "leftEar="  + pickrSingle[0].getColor().toHEXA().toString();
  document.cookie = "rightEar=" + pickrSingle[1].getColor().toHEXA().toString();
  document.cookie = "leftCup="  + pickrSingle[2].getColor().toHEXA().toString();
  document.cookie = "rightCup=" + pickrSingle[3].getColor().toHEXA().toString();
}

function loadColours(pickrAll, pickrSingle) {
  if(!getCookie('leftEar')) {
    return;
  }

  pickrSingle[0].setColor(getCookie('leftEar'));
  pickrSingle[1].setColor(getCookie('rightEar'));
  pickrSingle[2].setColor(getCookie('leftCup'));
  pickrSingle[3].setColor(getCookie('rightCup'));
  
  const color = pickrSingle[0].getColor();
  var colorsMatch = true;
  pickrSingle.forEach(function(item, index) {
    if(item.getColor() != color) {
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

export { saveColours, loadColours };