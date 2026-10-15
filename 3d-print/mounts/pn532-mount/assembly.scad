include <geometry.scad>
use <pn532_mount.scad>
use <panel_cnc.scad>
$fn=48; scene="assembly"; shift=[0,0,0];
module printed(){import("pn532_mount.stl",convexity=12);}
module assembly_parts(){printed();pcb();electronics();connector();cables();screw_heads();}
module cut_panel(){difference(){panel();translate([-30,-30,wood_z-1])cube([110,50.2,wood_h+2]);}}
if(scene=="wood")intersection(){panel();translate(shift)printed();}
if(scene=="pcb")intersection(){printed();translate([0,0,0.001])pcb();}
if(scene=="electronics")intersection(){printed();electronics();}
if(scene=="connector_mount")intersection(){printed();connector();}
if(scene=="connector_wood")intersection(){panel();connector();}
if(scene=="cable_mount")intersection(){printed();cables();}
if(scene=="cable_wood")intersection(){panel();cables();}
if(scene=="glass")intersection(){glass();assembly_parts();}
if(scene=="bores")intersection(){printed();for(h=board_holes)translate([h[0],h[1],-1])cylinder(d=2.15,h=board_z+2);}
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
