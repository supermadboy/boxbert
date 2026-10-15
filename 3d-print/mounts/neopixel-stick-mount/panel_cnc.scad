include <geometry.scad>
$fn=64;
part="panel";
module panel(){
    difference(){
        translate([panel_rect[0],panel_rect[1],wood_z]) cube([panel_rect[2],panel_rect[3],wood_h]);
        translate([0,0,wood_z-0.02]) linear_extrude(wood_h+0.04) opening_profile();
        translate([0,0,wood_z+wood_h-glass_h]) linear_extrude(glass_h+0.02) rebate_profile();
    }
}
module glass(){translate([0,0,wood_z+wood_h-glass_h]) linear_extrude(glass_h) rebate_profile(0.2);}
module rear_wall(){translate([panel_rect[0],rear_wall_y,-35]) cube([panel_rect[2],rear_wall_t,wood_z+35]);}
module local_panel(){intersection(){panel();translate([-24,-32,wood_z])cube([98,69.16,wood_h]);}}
if(part=="panel") panel();
if(part=="local") local_panel();
if(part=="opening") opening_profile();
if(part=="rebate") rebate_profile();
if(part=="glass") rebate_profile(0.2);
