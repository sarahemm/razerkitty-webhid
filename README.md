# razerkitty-webhid

A WebHID tool to control the lighting on the Razer Kraken Kitty Edition.

Requires Chrome 86+ or an equivalent Chromium browser, as it relies on the WebHID origin trial. May also work in other Chromium browsers with Experimental Web Platform Features enabled.

Features:
- Manual control of all LEDs together or each zone (left cat ear, right cat ear, left headphone cup, right headphone cup) separately.
- Spectrum cycling mode with controllable saturation, brightness, speed, and options to have all 4 zones match or be offset in hue from one another.
- Ability to set different lighting profiles and change between them.

Known Issues:
- Must manually click Connect and specify which device to connect to each time. This is related to limitations in the current (beta) WebHID features. This limitation is expected to be resolved in time, and the tool should be able to auto-connect to the headset after the first manual connection is made.

Future Plans:
- The UI could use a lot of visual improvement.
- An ability to export the profiles to text for backup purposes and restore them later would be nice to have.
- The tool is currently missing several of the other modes that Synapse 3 offers on Windows. These are all done in software rather than in the headset firmware, so there's no reason they can't be added in later.
- Would be nice if the button on the headset could cycle through the different configured profiles. This doesn't appear to be exposed through the same HID endpoint however (likely exposed as an Audio Control endpoint), so that may be problematic.

