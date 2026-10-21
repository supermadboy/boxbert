// Run from mounts/: -D 'model="pn532"' (or neopixel / tft).
// Top view: 10 mm material lip, no waves. Not a complete deck layout.
model="pn532";
if(model=="pn532") pn532();
if(model=="neopixel") neopixel();
if(model=="tft") tft();
module pn532(){
    include <pn532-mount/geometry.scad>
    difference(){rebate_profile();opening_profile();}
}
module neopixel(){
    include <neopixel-stick-mount/geometry.scad>
    difference(){rebate_profile();opening_profile();}
}
module tft(){
    include <feather-window-mount/window_geometry.scad>
    difference(){glass_profile();opening_profile();}
}
