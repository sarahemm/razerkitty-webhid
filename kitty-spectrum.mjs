import * as Hardware from './kitty-hardware.mjs';
import * as Util from './kitty-util.mjs';

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
var lastTime;

var huePerMillisecond;
var stepTime = 50;

function startSpectrum(headset) {
  myHeadset = headset
  spectrumInterval = setInterval(function() { stepSpectrum();}, stepTime);
  lastTime = Date.now();
}

function stepSpectrum() {
  hue += huePerMillisecond * (Date.now() - lastTime)
  if(hue > 360) {
    hue = 0;
  }
  lastTime = Date.now();

  var color = hsv2rgb(hue, saturation, value);
  Hardware.changeColor(myHeadset, [
    [color[0]*255, color[1]*255, color[2]*255],
    [color[0]*255, color[1]*255, color[2]*255],
    [color[0]*255, color[1]*255, color[2]*255],
    [color[0]*255, color[1]*255, color[2]*255]]
  );
}

function stopSpectrum() {
  clearInterval(spectrumInterval);
}

function saveSettings() {
  document.cookie = "spectrumSpeed=" + $('#spectrumSpeed').slider("option", "value");
  document.cookie = "spectrumSat=" + $('#spectrumSat').slider("option", "value");
  document.cookie = "spectrumBright=" + $('#spectrumBright').slider("option", "value");
}

function loadSettings() {
  if(!Util.getCookie("spectrumSpeed")) {
    return;
  }
  $('#spectrumSpeed').slider("value", Util.getCookie("spectrumSpeed"));
  $('#spectrumSat').slider("value", Util.getCookie("spectrumSat"));
  $('#spectrumBright').slider("value", Util.getCookie("spectrumBright"));

  recalculateSliders();
}

function recalculateSliders() {
  var speedSlider = $('#spectrumSpeed').slider("option", "value");
  var satSlider = $('#spectrumSat').slider("option", "value");
  var brightSlider = $('#spectrumBright').slider("option", "value");
  
  stepTime = 300 - speedSlider * 2.75 + 50;
  huePerMillisecond = 1/(500-$('#spectrumSpeed').slider("option", "value")*5+20);

  saturation = satSlider / 100;

  value = brightSlider / 100;

  if(spectrumInterval) {
    stopSpectrum();
    startSpectrum(myHeadset);
  }
}

$( function() {
  $( "#spectrumSpeed" ).slider({
    value: 50,
    slide: function(event, ui) {
      recalculateSliders();
    }
  });
} );

$( function() {
  $( "#spectrumSat" ).slider({
    value: 100,
    slide: function(event, ui) {
      recalculateSliders();
    }
  });
} );

$( function() {
  $( "#spectrumBright" ).slider({
    value: 100,
    slide: function(event, ui) {
      recalculateSliders();
    }
  });
} );

export { startSpectrum, stopSpectrum, saveSettings, loadSettings };