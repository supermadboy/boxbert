include <geometry.scad>
use <neopixel_mount.scad>
use <panel_cnc.scad>
$fn=64;
scene="assembly";
shift=[0,0,0];
module printed(){import("neopixel_mount.stl",convexity=12);}
module assembly_parts(){printed();pcb();leds();caps();screw_heads();cables();}
module cut_panel(){difference(){local_panel();translate([-30,-40,wood_z-1])cube([110,45.08,wood_h+2]);}}
if(scene=="wood") intersection(){panel();translate(shift)printed();}
// Exact head geometry is not documented; user confirmed real PCB head pass test.
// No head CAD collision scenes: old M2 illustrative tests are historical only.
if(scene=="pcb") intersection(){printed();translate([0,0,0.001])pcb();}
if(scene=="cable_mount") intersection(){printed();cables();}
if(scene=="cable_wood") intersection(){panel();cables();}
if(scene=="rear") intersection(){rear_wall();assembly_parts();}
if(scene=="glass") intersection(){glass();union(){printed();pcb();leds();caps();screw_heads();cables();}}
if(scene=="insert_pose") intersection(){
    union(){panel();rear_wall();glass();}
    // Each sampled pose is intersected separately: mathematically equivalent
    // to intersecting their union, but avoids CGAL's huge overlapping-mesh union.
    translate(shift) assembly_parts();
}
if(scene=="assembly" || scene=="section" || scene=="inside"){
    color([0.7,0.49,0.28]) if(scene=="section")cut_panel();else local_panel();
    color([0.95,0.46,0.13]) if(scene=="section")
        render() intersection(){mount();translate([-20,7.7,-1])cube([100,40,40]);}
        else mount();
    if(scene=="section"){
        color([0.1,0.5,0.3,0.45]) pcb();
        color([1,1,0.75]) leds();
        cable_visual();
        color([0.85,0.65,0.2]) render() intersection(){insert_visual();translate([-20,7.7,-1])cube([100,40,40]);}
        // Nominal shaft only; no undocumented screw head.
        for(h=board_holes) color([0.72,0.75,0.8])
            translate([h[0],h[1],board_z+pcb_t-screw_length])
                cylinder(d=2.5,h=screw_length);
    }else visible_pcb();
    color([0.65,0.86,0.98,0.3]) glass();
    if(scene!="section") color([0.54,0.35,0.18,0.6]) intersection(){rear_wall();translate([-24,rear_wall_y-rear_wall_t,-8])cube([98,12,21]);}
}
if(scene=="exploded"){
    color([0.7,0.49,0.28]) local_panel();
    translate([0,0,-22]){color([0.95,0.46,0.13])mount();visible_pcb();}
    translate([0,0,10])color([0.65,0.86,0.98,0.45])glass();
}
if(scene=="outside"){
    color([0.7,0.49,0.28])panel();
    visible_pcb();
    color([0.65,0.86,0.98,0.28])glass();
}
