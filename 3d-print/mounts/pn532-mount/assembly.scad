include <geometry.scad>
use <pn532_mount.scad>
use <panel_cnc.scad>
$fn=48; scene="assembly"; shift=[0,0,0];
module printed(){import("pn532_mount.stl",convexity=12);}
module assembly_parts(){printed();pcb();electronics();connector();cables();screw_heads();}
module cut_panel(){difference(){panel();translate([-30,-30,wood_z-1])cube([110,50.2,wood_h+2]);}}
// Conditional layout envelope: PCB edge 15 mm from outer edge, wall 12 mm.
// No button envelope: actual button/mutter dimensions and position still unknown.
module assumed_walls(){
    translate([pcb_w+3,-15,-30])cube([12,pcb_d+45,wood_z+30]);
    translate([-30,-15,-30])cube([pcb_w+45,12,wood_z+30]);
}
// Independent solid strips must all be present in the exported STL.
if(scene=="missing_rim")difference(){
    union(){
        translate([-2,0,0.1])cube([1.6,40.4,1.8]);
        translate([43.1,0,0.1])cube([1.6,40.4,1.8]);
        translate([0,-2,0.1])cube([42.7,1.6,1.8]);
        translate([0,40.8,0.1])cube([42.7,1.6,1.8]);
    }
    printed();
}
if(scene=="missing_straight_brace")difference(){
    translate([-2,18,0.1])cube([2,4,18.2]);printed();
}
if(scene=="walls")intersection(){assumed_walls();assembly_parts();}
if(scene=="tab_bores")intersection(){printed();for(w=wood_points)
    translate([w[0],w[1],wood_z-tab_h-0.1])cylinder(d=3,h=tab_h+0.2);}
if(scene=="left_tab")intersection(){printed();translate([-14,20.2,16])cylinder(d=1,h=1);}
if(scene=="top_tab")intersection(){printed();translate([34.975,54.4,16])cylinder(d=1,h=1);}
if(scene=="wood")intersection(){panel();translate(shift)printed();}
if(scene=="pcb")intersection(){printed();translate([0,0,0.001])pcb();}
if(scene=="electronics")intersection(){printed();electronics();}
if(scene=="connector_mount")intersection(){printed();connector();}
if(scene=="connector_wood")intersection(){panel();connector();}
if(scene=="cable_mount")intersection(){printed();cables();}
if(scene=="cable_wood")intersection(){panel();cables();}
if(scene=="glass")intersection(){glass();assembly_parts();}
if(scene=="bores")intersection(){printed();for(h=board_holes)translate([h[0],h[1],-1])cylinder(d=2.7,h=board_z+2);} // independent M2.5 clearance probe
if(scene=="insert_pose")intersection(){union(){panel();glass();}translate(shift)assembly_parts();}
if(scene=="assembly" || scene=="section" || scene=="inside"){
    color([0.7,0.49,0.28])if(scene=="section")cut_panel();else panel();
    color([0.95,0.46,0.13])mount();visible_pcb();
    color([0.65,0.86,0.98,0.3])glass();
}
if(scene=="exploded"){
    color([0.7,0.49,0.28])panel();
    translate([0,0,-28]){color([0.95,0.46,0.13])mount();visible_pcb();}
    translate([0,0,16])color([0.65,0.86,0.98,0.4])glass();
}
if(scene=="outside"){
    color([0.7,0.49,0.28])panel();visible_pcb();
    color([0.65,0.86,0.98,0.3])glass();
}
