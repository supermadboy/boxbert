include <geometry.scad>
use <pn532_mount.scad>
use <panel_cnc.scad>
$fn=48; scene="photo"; shift=[0,0,0];
module printed(){import("pn532_mount.stl",convexity=12);}
module wood(){cnc_to_photo()panel();}
// Diagnostic contact relief ONLY: withdraw the wood surface 0.001 mm. CNC is untouched.
module wood_test(){intersection(){wood();translate([-30,-30,-10])cube([110,110,18.499]);}}
module glazing(){cnc_to_photo()glass();}
module assembly_parts(){printed();pcb();electronics();connector();unused_pins();cables();screw_heads();}
if(scene=="wood")intersection(){wood_test();translate(shift)printed();}
if(scene=="glass")intersection(){glazing();assembly_parts();}
if(scene=="pcb")intersection(){printed();translate([0,0,0.001])pcb();}
if(scene=="electronics")intersection(){printed();union(){electronics();unused_pins();}}
if(scene=="connector")intersection(){printed();connector();}
if(scene=="cables")intersection(){printed();cables();}
if(scene=="connector_wood")intersection(){wood_test();union(){connector();cables();unused_pins();}}
if(scene=="bores")intersection(){printed();for(h=board_holes)translate([h[0],h[1],3.301])cylinder(d=3.98,h=10);}
if(scene=="insert_bottom_missing")difference(){for(h=board_holes)translate([h[0],h[1],0.01])cylinder(d=3.9,h=3.28);printed();}
if(scene=="insert_walls_missing")difference(){
 for(h=board_holes)translate([h[0],h[1],3.31])difference(){cylinder(d=8.18,h=6.68);translate([0,0,-0.01])cylinder(d=4.62,h=6.7);}
 printed();
}
if(scene=="tools")intersection(){printed();for(h=board_holes)translate([h[0],h[1],10.001])cylinder(d=8,h=35);}
if(scene=="tab_bores")intersection(){printed();for(w=wood_points)translate([w[0],w[1],8.49])cylinder(d=3.18,h=4);}
if(scene=="tab_material_missing")difference(){for(w=wood_points)translate([w[0]-4,w[1],9])cylinder(d=1,h=2);printed();}
if(scene=="wood_tools")intersection(){
 union(){printed();pcb();electronics();connector();cables();unused_pins();}
 for(w=wood_points)translate([w[0],w[1],12.001])cylinder(d=8,h=35);
}
if(scene=="solder_back")intersection(){printed();
 union(){translate([0.5,14.2,8.5])cube([4,12,1.499]);translate([12,35.9,8.5])cube([22,4,1.499]);}
}
if(scene=="heads_components")intersection(){screw_heads();union(){electronics();connector();unused_pins();}}
if(scene=="heads_tolerance")intersection(){screw_heads(0.515);translate([9.7,8.7,11.15])cube([23.6,22.6,5]);}
if(scene=="metal_components")intersection(){inserts();union(){electronics();connector();unused_pins();}}
if(scene=="metal_back")intersection(){inserts();translate([0,0,0.001])pcb();}
if(scene=="bottom_control")intersection(){printed();for(h=board_holes)translate([h[0],h[1],3.1])cylinder(d=3.98,h=7);}
if(scene=="wall_control")intersection(){printed();for(h=board_holes)translate([h[0]+0.4,h[1],3.31])cylinder(d=3.98,h=7);}
if(scene=="collision_panel")union(){wood_test();glazing();}
if(scene=="collision_assembly")assembly_parts();
if(scene=="insertion")intersection(){import("logs/revision/collision_panel.stl",convexity=12);translate(shift)import("logs/revision/collision_assembly.stl",convexity=12);}
if(scene=="shift_control")intersection(){wood_test();translate([1,0,0])printed();}
if(scene=="depth_control")intersection(){wood_test();translate([0,0,-1])printed();}
// Positive controls for union hulls: deliberately move ONE member into material.
if(scene=="electronics_control")intersection(){printed();union(){translate([-2.275,23.675,-10])electronics();unused_pins();}}
if(scene=="connector_wood_control")intersection(){wood_test();union(){translate([-10,0,-10])connector();cables();unused_pins();}}
if(scene=="heads_components_control")intersection(){screw_heads();union(){translate([-2.275,23.675,0])electronics();connector();unused_pins();}}
// Keep-out of photo-bottom sector; NOT a measured button envelope.
if(scene=="bottom_sector")intersection(){printed();translate([-2.2,-100,-20])cube([47.1,97.79,80]);}
if(scene=="photo" || scene=="photo_inspection" || scene=="inside" || scene=="section" || scene=="exploded"){
 if(scene=="inside" || scene=="section" || scene=="exploded")color([0.72,0.52,0.3])
  if(scene=="section")intersection(){wood_test();translate([-30,20.2,-10])cube([110,60,60]);}else wood();
 translate([0,0,scene=="exploded"?28:0]){
  color([0.4,0.25,0.8,scene=="photo_inspection"?0.15:1])mount();visible_pcb();
 }
 if(scene=="inside" || scene=="section" || scene=="exploded")color([0.65,0.86,0.98,0.3])glazing();
}
if(scene=="section")color([0.12,0.12,0.12])
 for(i=[0:3])translate([-18,-26,44-4*i])rotate([90,0,0])linear_extrude(0.01)text(["+z innen / sichtbare Bauteilseite", "PCB z10..11.15 | Gitter z0..2", "Glas z-3.5..-0.5 | Holzanschlag z8.5", "PCB-Glas 10.5 mm inkl. Gitter / RF OFFEN"][i],size=2);