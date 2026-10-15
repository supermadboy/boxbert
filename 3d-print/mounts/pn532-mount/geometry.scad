// Elechouse V3 drawing, page 2; user accepts basis, real PN532-MOD unverified.
// SAME orientation as drawing. Origin bottom left; +x right, +y up/rear, +z outside.
pcb_w=42.7; pcb_d=40.4;
board_holes=[[7.4,7.6],[35.2,32.8]];
pcb_t=1.6; // ASSUMED
pcb_hole_d=2.5; // ASSUMED! Not dimensioned in drawing. M2 proposed, verify.
wood_z=18.5; wood_h=12; glass_h=3;
rf_gap=2; // proposed PCB outer surface -> glass, NOT tested NFC range
board_z=wood_z+wood_h-glass_h-rf_gap-pcb_t; //23.9
opening=[-2.4,-2.4,47.5,45.2];
rebate=[-4.4,-4.4,51.5,49.2];
corner_r=2; fit=0.2; guide_wall=1.5; guide_h=4.5;
lead_in=0.4; lead_h=0.6;
wood_points=[[21.35,-10],[21.35,50.4]];
base_h=2; tab_h=3.5; wood_d=3.2; head_d=6.2;
wood_screw_l=12;
post_d=8; neck_d=4.6; post_top=14;
m2_clear=2.3; nut_af=4.2; nut_pocket_h=3.5; nut_h=1.6;
m2_length=25; pcb_head_d=4; head_h=1.5; // head max height, check actual hardware
support_xy=[[3,37.4],[39.7,3]]; // assumed empty PCB edge on component side
// Large central electronics envelope on INWARD side; no measured component map.
components_rect=[10,9,23,22]; components_h=5;
// Four inward-facing I2C female housings, axis parallel z, on left of drawing.
// Coordinates/housing height/bends are ASSUMED, not extracted PCB pads.
connector_rect=[0.5,11,4,12]; connector_h=16;
assert(abs(board_z-23.9)<0.001);
assert(board_z-connector_h>base_h);
assert(rf_gap-head_h>=0.5);
assert((post_d-nut_af/cos(30))/2>=1.5);
assert(tab_h-(head_d-wood_d)/2>=2);
module profile(r,rad=2,inset=0){
    translate([r[0]+rad,r[1]+rad]) offset(r=rad-inset) square([r[2]-2*rad,r[3]-2*rad]);
}
module opening_profile(inset=0){profile(opening,corner_r,inset);}
module rebate_profile(inset=0){profile(rebate,corner_r,inset);}
