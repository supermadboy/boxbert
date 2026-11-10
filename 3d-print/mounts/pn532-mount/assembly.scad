include <geometry.scad>
use <pn532_mount.scad>
use <panel_cnc.scad>
$fn=48; scene="photo"; shift=[0,0,0];
module printed(){import("pn532_mount.stl",convexity=12);}
module wood(){cnc_to_photo()panel();}
// Contact-only relief: wood starts 0.001 mm above nominal tab contact.
module wood_test(){intersection(){wood();translate([-30,-30,stop_z+0.001])cube([110,110,40]);}}
module glazing(){cnc_to_photo()glass();}
module assembly_parts(){printed();pcb();electronics();connector();unused_pins();cables();screw_heads();solder_front();}
if(scene=="wood")intersection(){wood_test();translate(shift)printed();}
if(scene=="glass")intersection(){glazing();assembly_parts();}
if(scene=="pcb")intersection(){printed();translate([0,0,0.001])pcb();}
if(scene=="electronics")intersection(){printed();union(){electronics();solder_front();}}
if(scene=="connector")intersection(){printed();union(){connector();unused_pins();}}
if(scene=="cables")intersection(){printed();cables();}
if(scene=="connector_wood")intersection(){wood_test();union(){connector();cables();unused_pins();}}
if(scene=="bores")intersection(){printed();for(h=board_holes)translate([h[0],h[1],3.301])cylinder(d=3.98,h=10);}
if(scene=="insert_bottom_missing")difference(){for(h=board_holes)translate([h[0],h[1],0.01])cylinder(d=3.9,h=3.28);printed();}
if(scene=="insert_walls_missing")difference(){
 for(h=board_holes)translate([h[0],h[1],3.31])difference(){cylinder(d=8.18,h=6.68);translate([0,0,-0.01])cylinder(d=4.62,h=6.7);}
 printed();
}
if(scene=="tools")intersection(){printed();for(h=board_holes)translate([h[0],h[1],10.001])cylinder(d=8,h=35);}
if(scene=="tab_bores")intersection(){printed();for(w=wood_points)translate([w[0],w[1],stop_z-tab_h-0.01])cylinder(d=3.18,h=4);}
if(scene=="tab_material_missing")difference(){for(w=wood_points)translate([w[0]-4,w[1],stop_z-tab_h+0.5])cylinder(d=1,h=2);printed();}
if(scene=="tab_contact_missing")difference(){for(w=wood_points)translate([w[0]+4,w[1],stop_z-0.2])cylinder(d=1,h=0.19);printed();}
if(scene=="wood_tools")intersection(){
 union(){printed();pcb();electronics();connector();cables();unused_pins();}
 for(w=wood_points)translate([w[0],w[1],stop_z-tab_h-35.001])cylinder(d=8,h=35);
}
if(scene=="heads_components")intersection(){screw_heads();union(){electronics();solder_front();}}
if(scene=="heads_tolerance")intersection(){screw_heads(0.515);translate([9.7,8.7,11.15])cube([23.6,22.6,5]);}
if(scene=="metal_components")intersection(){inserts();union(){electronics();connector();unused_pins();}}
if(scene=="metal_back")intersection(){inserts();translate([0,0,0.001])pcb();}
if(scene=="bottom_control")intersection(){printed();for(h=board_holes)translate([h[0],h[1],3.1])cylinder(d=3.98,h=7);}
if(scene=="wall_control")intersection(){printed();for(h=board_holes)translate([h[0]+0.4,h[1],3.31])cylinder(d=3.98,h=7);}
if(scene=="collision_panel")union(){wood_test();glazing();}
if(scene=="collision_assembly")assembly_parts();
if(scene=="insertion")intersection(){import("logs/photo-exterior/collision_panel.stl",convexity=12);translate(shift)import("logs/photo-exterior/collision_assembly.stl",convexity=12);}
if(scene=="shift_control")intersection(){wood_test();translate([1,0,0])printed();}
if(scene=="depth_control")intersection(){wood_test();translate([0,0,1])printed();}
// Each control moves ONE member of the union into known material.
if(scene=="electronics_control")intersection(){printed();union(){translate([-2.275,23.675,-10])electronics();solder_front();}}
if(scene=="connector_wood_control")intersection(){wood_test();union(){translate([-10,0,0])connector();cables();unused_pins();}}
if(scene=="heads_components_control")intersection(){screw_heads();union(){translate([-2.275,23.675,0])electronics();solder_front();}}
// Old 2-mm PCB-component-plane/glass gap is NOT clear with assumed 5-mm SMD.
if(scene=="original_gap_control")intersection(){electronics();translate([-20,-20,board_z+pcb_t+2])cube([85,85,3]);}
// Only the new bottom tab may enter this sector. A left/central tab fails.
if(scene=="bottom_sector")intersection(){printed();translate([-20,-40,-20])cube([52.39,37.79,80]);}
if(scene=="bottom_tab_missing")difference(){translate([bottom_tab_x,-10,4.7])difference(){cylinder(d=10,h=2);translate([0,0,-0.01])cylinder(d=6.3,h=2.02);}printed();}
if(scene=="rear_slot_missing")intersection(){printed();
 union(){translate([0.5,14.2,-0.01])cube([4,12,9.999]);translate([12,35.9,-0.01])cube([22,4,9.999]);}
}
// No printed grid/arm may obscure the electronics from the OUTSIDE.
module front_view_volume(){translate([0,0,board_z+pcb_t+0.001])cube([pcb_w,pcb_d,rf_gap-0.001]);}
if(scene=="front_occlusion")intersection(){printed();front_view_volume();}
if(scene=="front_pin_hulls")intersection(){union(){connector();unused_pins();}front_view_volume();}
if(scene=="front_occlusion_control")intersection(){
 translate([0,0,board_z+pcb_t])printed();front_view_volume();
 // Interior patch avoids unrelated coplanar guide/PCB-edge contacts in this control.
 translate([10.1,10.1,board_z+pcb_t-0.1])cube([20,20,2.2]);
}
// Exact straight cut at photo y=20.2; no transparent depth overlap.
module section_cut(){
 rotate([90,0,0])linear_extrude(0.02)
  projection(cut=true)translate([0,0,20.2])rotate([-90,0,0])union()children();
}
if(scene=="photo" || scene=="photo_inspection" || scene=="outside" || scene=="section" || scene=="exploded"){
 if(scene=="outside" || scene=="section" || scene=="exploded")color([0.72,0.52,0.3])
  if(scene=="section")section_cut()wood();else render(convexity=12)wood();
 translate([0,0,scene=="exploded"?-28:0]){
  if(scene=="section"){
   color([0.4,0.25,0.8])section_cut()mount();
   color([0.75,0.08,0.1])section_cut()pcb();
   color([0.15,0.17,0.2])section_cut(){electronics();connector();unused_pins();}
   color([0.2,0.65,0.95])section_cut()cables();
  }
  else {color([0.4,0.25,0.8])mount();visible_pcb();}
 }
 if(scene=="outside" || scene=="section" || scene=="exploded")color([0.65,0.86,0.98,0.3])
  if(scene=="section")section_cut()glazing();else translate([0,0,scene=="outside"?0.01:0])glazing();
}
if(scene=="section")color([0.12,0.12,0.12])
 for(i=[0:4])translate([-20,-26,39-3.5*i])rotate([90,0,0])linear_extrude(0.01)text([
 "+z AUSSEN / Glas vor Bauteilen / -z INNEN",
 "Glas 16.65..19.65 | SMD 11.15..16.15 (Annahme)",
 "PCB 10..11.15 | Gitter 0..2 | I2C -6..10 (Annahme)",
 "Holz 7.65..19.65 | Laschen 4.15..7.65 | Guide bis 12.15",
 "PCB-Glas 5.5 = SMD 5 + Reserve 0.5 (nominal, ungemessen)"
 ][i],size=1.85);
