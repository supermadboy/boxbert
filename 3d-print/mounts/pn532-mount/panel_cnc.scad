include <geometry.scad>
$fn=64; part="panel";
module panel(){difference(){
    translate([-20,-20,wood_z])cube([82.7,80.4,wood_h]);
    translate([0,0,wood_z-0.1])linear_extrude(wood_h+0.2)opening_profile();
    translate([0,0,wood_z+wood_h-glass_h])linear_extrude(glass_h+0.1)rebate_profile();
}}
module glass(){translate([0,0,wood_z+wood_h-glass_h])linear_extrude(glass_h)rebate_profile(0.2);}
if(part=="panel")panel();
if(part=="opening")opening_profile();
if(part=="rebate")rebate_profile();
if(part=="glass")rebate_profile(0.2);
