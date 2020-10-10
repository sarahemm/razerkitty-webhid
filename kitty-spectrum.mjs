import * as Hardware from './kitty-hardware.mjs';

function hsv2rgb(h,s,v) {
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}

var hue;
var myHeadset;
var spectrumInterval;

function startSpectrum(headset) {
  hue = 0;
  myHeadset = headset
  spectrumInterval = setInterval(function() { stepSpectrum();}, 25);
}

function stepSpectrum() {
  var color = hsv2rgb(hue, 1, 1);
  Hardware.changeColor(myHeadset, [
    [color[0]*255, color[1]*255, color[2]*255],
    [color[0]*255, color[1]*255, color[2]*255],
    [color[0]*255, color[1]*255, color[2]*255],
    [color[0]*255, color[1]*255, color[2]*255]]
  );

  hue++;
  if(hue > 360) {
    hue = 0;
  }
}

function stopSpectrum() {
  clearInterval(spectrumInterval);
}

export { startSpectrum, stopSpectrum };