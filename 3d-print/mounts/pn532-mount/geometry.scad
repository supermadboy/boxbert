// Photo / print frame: x right, y up, +z INSIDE, component side visible.
// Unchanged CNC frame: (X,Y,Z)=(42.7-x,y,27-z).
pcb_w=42.7; pcb_d=40.4;
photo_holes=[[7.725,32.675],[34.975,7.725]];
board_holes=photo_holes;
pcb_t=1.15; pcb_hole_d=2.93;
wood_z=18.5; wood_h=12; glass_h=3; // exclusively historic CNC dimensions
installed_base_z=27; stop_z=8.5; board_z=10; rf_gap=10.5;
opening=[-2.4,-2.4,47.5,45.2];
include <../common/wave.scad>
rebate=[-12.4,-12.4,67.5,65.2];
corner_r=2; fit=0.2; guide_wall=1.5; guide_h=8.5;
photo_wood_points=[[-10,7.725],[-10,32.675]];
wood_points=photo_wood_points;
base_h=2; tab_h=3.5; wood_d=3.2; head_d=6.2; wood_screw_l=12;
post_d=8.2; insert_d=4; insert_depth=6.7; insert_max_d=4.6; insert_l=5.7;
pcb_screw_d=2.5; pcb_screw_length=6; pcb_head_d=4; head_h=1.5;
support_xy=[[3,3],[39.7,37.4]];
components_rect=[10,9,23,22]; components_h=5;
connector_rect=[0.5,14.2,4,12]; connector_h=16;
unused_rect=[12,35.9,22,4]; unused_h=8;
assert((post_d-insert_max_d)/2>=1.6);
assert(board_z-insert_depth>base_h);
assert(abs(board_z-(installed_base_z-(wood_z+wood_h-glass_h))-rf_gap)<0.001);
// This transform is its own inverse; apply ONLY to CNC wood/glass.
module cnc_to_photo(){translate([pcb_w,0,installed_base_z])rotate([0,180,0])children();}
module profile(r,rad=2,inset=0){
 translate([r[0]+rad,r[1]+rad])offset(r=rad-inset)square([r[2]-2*rad,r[3]-2*rad]);
}
module opening_profile(inset=0){profile(opening,corner_r,inset);}
module rebate_profile(inset=0){wave_profile(opening,corner_r,8,inset);}
