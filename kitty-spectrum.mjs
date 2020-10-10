import * as Hardware from './kitty-hardware.mjs';

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately/54024653#54024653
function hsv2rgb(h,s,v) {
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}

var hue = 0;
var saturation = 1;
var value = 1;

var myHeadset;
var spectrumInterval;

var stepHue = 1;
var stepTime = 50;

function startSpectrum(headset) {
  myHeadset = headset
  spectrumInterval = setInterval(function() { stepSpectrum();}, stepTime);
}

function stepSpectrum() {
  var color = hsv2rgb(hue, saturation, value);
  Hardware.changeColor(myHeadset, [
    [color[0]*255, color[1]*255, color[2]*255],
    [color[0]*255, color[1]*255, color[2]*255],
    [color[0]*255, color[1]*255, color[2]*255],
    [color[0]*255, color[1]*255, color[2]*255]]
  );

  hue += stepHue;
  if(hue > 360) {
    hue = 0;
  }
}

function stopSpectrum() {
  clearInterval(spectrumInterval);
}

$( function() {
  $( "#spectrumSpeed" ).slider({
    slide: function(event, ui) {
      stepTime = 500 - ui.value * 5 + 50;
      stepHue = ui.value / 20 + 1;
      stopSpectrum();
      startSpectrum(myHeadset);
    }
  });
} );

$( function() {
  $( "#spectrumSat" ).slider({
    slide: function(event, ui) {
      saturation = ui.value / 100;
      stopSpectrum();
      startSpectrum(myHeadset);
    }
  });
} );

$( function() {
  $( "#spectrumBright" ).slider({
    slide: function(event, ui) {
      value = ui.value / 100;
      stopSpectrum();
      startSpectrum(myHeadset);
    }
  });
} );

export { startSpectrum, stopSpectrum };