// CNC: ONLY outside machining, through-opening + outer glass rabbet.
// Includes NO box joints, side-wall USB opening or screw pilot holes.
include <window_geometry.scad>
$fn=64;
part="panel"; // panel | opening | rebate | glass | local | inner-view
// 2D outputs are actual cutter boundaries, no tool-radius compensation.
module front_panel() {
    difference() {
        translate([panel_origin[0],panel_origin[1],wood_contact_z])
            cube([panel_size[0],panel_size[1],wood_h]);
        translate([0,0,wood_contact_z-0.02])
            linear_extrude(wood_h+0.04) opening_profile();
        translate([0,0,wood_contact_z+wood_h-plexi_h])
            linear_extrude(plexi_h+0.02) glass_profile();
    }
}
module window_glass() {
    translate([0,0,wood_contact_z+wood_h-plexi_h])
        linear_extrude(plexi_h) glass_profile(glass_clearance);
}
module local_panel() {
    intersection() {
        front_panel();
        translate([-24,-31,wood_contact_z-0.02]) cube([92,85,wood_h+0.04]);
    }
}
if(part=="panel") color([0.65,0.42,0.22]) front_panel();
if(part=="local") color([0.65,0.42,0.22]) local_panel();
// Turn the inside upward ONLY for a well-lit preview; CNC files stay unchanged.
if(part=="inner-view") color([0.65,0.42,0.22])
    translate([0,22.86,2*(wood_contact_z+wood_h/2)])
        rotate([180,0,0]) local_panel();
if(part=="opening") opening_profile();
if(part=="rebate") glass_profile();
if(part=="glass") glass_profile(glass_clearance);
