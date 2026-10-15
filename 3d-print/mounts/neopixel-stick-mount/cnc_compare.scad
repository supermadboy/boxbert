// Inspection comparison only. LEFT is superseded; never a CAM export source.
include <geometry.scad>
$fn=64;
module diagram(open_rect,outer_rect,r){
    color([0.2,0.65,0.85]) linear_extrude(0.1) profile(outer_rect,r);
    color([0.13,0.16,0.2]) translate([0,0,0.11]) linear_extrude(0.1) profile(open_rect,r);
    color([0.12,0.48,0.3]) translate([0,0,0.22]) linear_extrude(0.1) difference(){
        square([pcb_w,pcb_d]);
        for(h=board_holes) translate(h) circle(d=2.2);
    }
    color([1,0.94,0.7]) for(p=led_xy) translate([p[0]-2.5,p[1]-2.5,0.33]) cube([5,5,0.1]);
}
// Historical dimensions kept here solely to compare both at identical scale.
translate([-80,0,0]) diagram([-6,-5,62.8,22.16],[-10,-9,70.8,30.16],3);
diagram(opening,rebate,corner_r);
