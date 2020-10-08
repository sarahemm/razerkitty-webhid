document.getElementById('connect-button').addEventListener('click', handleConnectClick);
document.getElementById('save-button').addEventListener('click', handleSaveClick);
// not yet implemented for devices without serial numbers
// https://bugs.chromium.org/p/chromium/issues/detail?id=958918
//navigator.hid.addEventListener("connect", event => {
//  alert("connected");
//});
    
var headset;

navigator.hid.addEventListener("disconnect", event => {
    headset.close();
    handleDisconnect();
});

// from https://www.w3schools.com/js/js_cookies.asp
// just "temporary" :)
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

async function handleConnectClick() {
    headset = await openDevice();
    if(getCookie("red") != "") {
        redSlider.value = getCookie("red");
        greenSlider.value = getCookie("green");
        blueSlider.value = getCookie("blue");
    }
    redSlider.disabled = false;
    greenSlider.disabled = false;
    blueSlider.disabled = false;
    connectButton.disabled = true;
    updateColor();
}

function handleSaveClick() {
    document.cookie = "red=" + redSlider.value;
    document.cookie = "green=" + greenSlider.value;
    document.cookie = "blue=" + blueSlider.value;
}

function handleDisconnect() {
    redSlider.disabled = true;
    greenSlider.disabled = true;
    blueSlider.disabled = true;
    connectButton.disabled = false;
}

async function openDevice() {
    const vendorId = 0x1532; // Razer
    const productId = 0x0f19;  // Kraken Kitty Edition

    const device_list = await navigator.hid.getDevices();
    let device = device_list.find(d => d.vendorId === vendorId && d.productId === productId);

    if (!device) {
        let devices = await navigator.hid.requestDevice({
            filters: [{vendorId, productId}],
        });
        device = devices[0];
        if(!device) return null;
    }

    if (!device.opened) {
        await device.open();
    }
    console.log("Headset device opened:",device);

   return device;
}

async function changeColor(device, [r, g, b] ) {
    // these are separate for future use
    var left_ear = [r, g, b];
    var right_ear = [r, g, b];
    var left_cup = [r, g, b];
    var right_cup = [r, g, b];

    const reportId = 0;
    const data = Uint8Array.from([
        0x00, 0x1f, 0x00, 0x00, 0x00, 0x11, 0x0f, 0x03,
        0x00, 0x00, 0x00, 0x00, 0x03,
        left_cup[0], left_cup[1], left_cup[2],
        right_cup[0], right_cup[1], right_cup[2],
        left_ear[0], left_ear[1], left_ear[2],
        right_ear[0], right_ear[1], right_ear[2],
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1e, 0x00
    ]);
    await device.sendFeatureReport(reportId, data);
}

function updateColor() {
    var red = redSlider.value;
    var green = greenSlider.value;
    var blue = blueSlider.value;
    changeColor(headset, [red, green, blue]);
}

var redSlider = document.getElementById("redSlider");
var greenSlider = document.getElementById("greenSlider");
var blueSlider = document.getElementById("blueSlider");
var connectButton = document.getElementById('connect-button');

redSlider.oninput = function() { updateColor(); }
greenSlider.oninput = function() { updateColor(); }
blueSlider.oninput = function() { updateColor(); }
