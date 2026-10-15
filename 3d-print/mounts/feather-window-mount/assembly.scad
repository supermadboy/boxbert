// Inspection scenes only. STL print source remains feather_window_mount.scad.
use <feather_window_mount.scad>
use <front_cnc.scad>
include <window_geometry.scad>
$fn=64;
scene="section"; // section | exploded | seated | inside | outside | collision | insertion
shift=[0,0,0];
module visible_board() {
    color([0.12,0.48,0.35,0.48]) board();
    parts();
    color([0.12,0.35,0.70,0.65]) dupont_envelopes();
}
module wood_section() {
    difference() {
        local_panel();
        // Remove front half across y to reveal pocket, guide and depth stop.
        translate([-30,-40,wood_contact_z-1]) cube([110,51.43,wood_h+2]);
    }
}
if(scene=="collision") intersection() {
    front_panel();
    translate(shift) mount();
}
if(scene=="board_collision") intersection() { mount(); board(); }
if(scene=="plug_collision") intersection() { mount(); dupont_envelopes(); }
if(scene=="connector_collision") intersection() { mount(); connection_envelopes(); }
if(scene=="front_connector_collision") intersection() { front_panel(); connection_envelopes(); }
if(scene=="insertion") intersection() {
    front_panel();
    // Entire straight insertion path of the mount from inside to final seat.
    union() for(z=[-24:1:0]) translate([0,0,z]) mount();
}
if(scene=="section") {
    color([0.65,0.42,0.22]) wood_section();
    color([0.95,0.42,0.10]) mount();
    visible_board();
    color([0.30,0.75,0.90,0.35]) window_glass();
}
if(scene=="exploded") {
    color([0.65,0.42,0.22]) local_panel();
    translate([0,0,-24]) {
        color([0.95,0.42,0.10]) mount();
        visible_board();
    }
    translate([0,0,12]) color([0.30,0.75,0.90,0.45]) window_glass();
}
if(scene=="seated" || scene=="inside") {
    color([0.65,0.42,0.22]) local_panel();
    color([0.95,0.42,0.10]) mount();
    visible_board();
    color([0.30,0.75,0.90,0.35]) window_glass();
}
if(scene=="outside") {
    color([0.65,0.42,0.22]) front_panel();
    visible_board();
    color([0.30,0.75,0.90,0.35]) window_glass();
}
