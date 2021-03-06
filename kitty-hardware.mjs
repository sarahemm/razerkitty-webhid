import * as UI from './kitty-ui.mjs';

// not yet implemented for devices without serial numbers
// https://bugs.chromium.org/p/chromium/issues/detail?id=958918
//navigator.hid.addEventListener("connect", event => {
//  alert("connected");
//});

navigator.hid.addEventListener("disconnect", event => {
  UI.handleDisconnect();
});

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

async function changeColor(device, rgba_array) {
  var left_ear = rgba_array[0];
  var right_ear = rgba_array[1];
  var left_cup = rgba_array[2];
  var right_cup = rgba_array[3];

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
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0x00
  ]);
  
  // calculate and fill in the checksum
  var checksum = 0;
  for(var i = 2; i < 88; i++) {
    checksum ^= data[i];
  }
  data[88] = checksum

  await device.sendFeatureReport(reportId, data);
}

export { openDevice, changeColor };