import * as Hardware from './kitty-hardware.mjs';
import * as Profiles from './kitty-profiles.mjs';
import * as Util from './kitty-util.mjs';

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately/54024653#54024653
function hsv2rgb(h,s,v) {
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}

var hue = 0;

var hueOffset = 0;
var saturation = 1;
var value = 1;

var myHeadset;
var spectrumInterval;
var lastTime;

var huePerMillisecond;
var stepTime = 50;

var recalcSlidersSoon = false;

function startSpectrum(headset) {
  // don't start if we're already running
  if(spectrumInterval) { return; }
  
  myHeadset = headset
  spectrumInterval = setInterval(function() { stepSpectrum();}, stepTime);
  lastTime = Date.now();
}

function stepSpectrum() {
  if(recalcSlidersSoon) {
    recalculateSliders();
    recalcSlidersSoon = false;
  }

  hue += huePerMillisecond * (Date.now() - lastTime)
  hue = hue % 360
  lastTime = Date.now();

  var color_rc = hsv2rgb(hue, saturation, value);
  var color_re = hsv2rgb((hue+hueOffset*1) % 360, saturation, value);
  var color_le = hsv2rgb((hue+hueOffset*2) % 360, saturation, value);
  var color_lc = hsv2rgb((hue+hueOffset*3) % 360, saturation, value);
  
  Hardware.changeColor(myHeadset, [
    [color_le[0]*255, color_le[1]*255, color_le[2]*255],
    [color_re[0]*255, color_re[1]*255, color_re[2]*255],
    [color_lc[0]*255, color_lc[1]*255, color_lc[2]*255],
    [color_rc[0]*255, color_rc[1]*255, color_rc[2]*255]]
  );
}

function stopSpectrum() {
  clearInterval(spectrumInterval);
  spectrumInterval = null;
}

function saveSettings() {
  Profiles.setValue('spectrumSpeed', $('#spectrumSpeed').slider("option", "value"));
  Profiles.setValue('spectrumHueOffset', $('#spectrumHueOffset').slider("option", "value"));
  Profiles.setValue('spectrumSat', $('#spectrumSat').slider("option", "value"));
  Profiles.setValue('spectrumBright', $('#spectrumBright').slider("option", "value"));
}

function loadSettings() {
  if(!Profiles.getValue("spectrumSpeed")) {
    recalculateSliders();
    return;
  }
  $('#spectrumSpeed').slider("value", Profiles.getValue("spectrumSpeed"));
  $('#spectrumHueOffset').slider("value", Profiles.getValue("spectrumHueOffset"));
  $('#spectrumSat').slider("value", Profiles.getValue("spectrumSat"));
  $('#spectrumBright').slider("value", Profiles.getValue("spectrumBright"));

  recalculateSliders();
}

function recalculateSliders() {
  var speedSlider = $('#spectrumSpeed').slider("option", "value");
  var hueOffsetSlider = $('#spectrumHueOffset').slider("option", "value");
  var satSlider = $('#spectrumSat').slider("option", "value");
  var brightSlider = $('#spectrumBright').slider("option", "value");

  huePerMillisecond = Util.scale(speedSlider, 0, 100, 0.005, 0.05); 
  stepTime = 1 / huePerMillisecond

  hueOffset = hueOffsetSlider;
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
    slide: function(event, ui) { recalcSlidersSoon = true; }
  });
} );

$( function() {
  $( "#spectrumHueOffset" ).slider({
    value: 0,
    step: 45,
    max: 180,
    slide: function(event, ui) { recalcSlidersSoon = true; }
  });
} );

$( function() {
  $( "#spectrumSat" ).slider({
    value: 100,
    slide: function(event, ui) { recalcSlidersSoon = true; }
  });
} );

$( function() {
  $( "#spectrumBright" ).slider({
    value: 100,
    slide: function(event, ui) { recalcSlidersSoon = true; }
  });
} );

export { startSpectrum, stopSpectrum, saveSettings, loadSettings };