// Isolated visual study. Not a production panel or a complete enclosure layout.
include <../geometry.scad>
include <wave-points.scad>
$fn=96;
show_glass=false;
module wave_profile(){polygon(wave_points);}
module study_panel(){difference(){
    translate([-31,-31,0])cube([104.7,102.4,12]);
    translate([0,0,-0.1])linear_extrude(12.2)opening_profile();
    translate([0,0,9])linear_extrude(3.1)wave_profile();
}}
color([0.76,0.58,0.36])study_panel();
// True inward offset, not scaling: proposed glass clearance 0.2 mm per side.
if(show_glass)color([0.4,0.8,0.95,0.35])translate([0,0,9.03])
    linear_extrude(3)offset(delta=-0.2)wave_profile();
