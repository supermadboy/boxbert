// Inspection comparison only. LEFT is superseded; never a CAM export source.
include <geometry.scad>
$fn=64;
module diagram(open_rect,outer_rect,r,wavy=false){
    color([0.2,0.65,0.85]) linear_extrude(0.1)
        if(wavy)rebate_profile();else profile(outer_rect,r);
    color([0.13,0.16,0.2]) translate([0,0,0.11]) linear_extrude(0.1) profile(open_rect,r);
    color([0.12,0.48,0.3]) translate([0,0,0.22]) linear_extrude(0.1) difference(){
        square([pcb_w,pcb_d]);
        for(h=board_holes) translate(h) circle(d=board_hole_d);
    }
    color([1,0.94,0.7]) for(p=led_xy) translate([p[0]-2.5,p[1]-2.5,0.33]) cube([5,5,0.1]);
}
// Historical dimensions kept here solely to compare both at identical scale.
translate([-80,0,0]) diagram([-2.2,-2.2,55.2,14.56],[-4.2,-4.2,59.2,18.56],2);
diagram(opening,rebate,corner_r,true);
