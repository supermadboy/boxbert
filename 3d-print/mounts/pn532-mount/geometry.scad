// 2026-10-21: user confirms PCB outline; caliper: edge-to-hole edge 6.26
// at all four nearest edges, hole diameter 2.93, PCB thickness 1.15 mm.
// Component/connector heights remain assumptions; physical fit unverified.
// SAME orientation as drawing. Origin bottom left; +x right, +y up/rear, +z outside.
pcb_w=42.7; pcb_d=40.4;
board_holes=[[7.725,7.725],[34.975,32.675]];
pcb_t=1.15; // user caliper measurement
pcb_hole_d=2.93; // user caliper measurement; M2.5 per user request
wood_z=18.5; wood_h=12; glass_h=3;
rf_gap=2; // proposed PCB outer surface -> glass, NOT tested NFC range
board_z=wood_z+wood_h-glass_h-rf_gap-pcb_t; //24.35; keep outer PCB plane and 2 mm RF gap unchanged
opening=[-2.4,-2.4,47.5,45.2];
rebate_width=10;
rebate=[opening[0]-rebate_width,opening[1]-rebate_width,opening[2]+2*rebate_width,opening[3]+2*rebate_width];
corner_r=2; fit=0.2; guide_wall=1.5; guide_h=4.5;
lead_in=0.4; lead_h=0.6;
// Left towards adjacent button, top near upper-right PCB screw; no bottom/right tab.
wood_points=[[-10,20.2],[34.975,50.4]];
base_h=2; tab_h=3.5; wood_d=3.2; head_d=6.2;
wood_screw_l=12;
post_d=9.2; neck_d=4.6; post_top=14; // >1.5 mm wall around M2.5 pocket
pcb_screw_d=2.5;
pcb_screw_clear=2.8; nut_af=5.2; nut_pocket_h=3.5; nut_h=2; // assumed AF5 / thickness2
pcb_screw_length=25; pcb_head_d=4; head_h=1.5; // head max height, check actual hardware
support_xy=[[3,37.4],[39.7,3]]; // assumed empty PCB edge on component side
// Large central electronics envelope on INWARD side; no measured component map.
components_rect=[10,9,23,22]; components_h=5;
// User correction 2026-10-21: I2C at TOP edge in photo orientation (+y).
// Side confirmed; exact offset, housing height and cable bends still ASSUMED.
connector_rect=[10,35.9,12,4]; connector_h=16;
assert(abs(board_z-24.35)<0.001);
assert(board_z-connector_h>base_h);
assert(rf_gap-head_h>=0.5);
assert((post_d-nut_af/cos(30))/2>=1.5);
assert(tab_h-(head_d-wood_d)/2>=2);
module profile(r,rad=2,inset=0){
    translate([r[0]+rad,r[1]+rad]) offset(r=rad-inset) square([r[2]-2*rad,r[3]-2*rad]);
}
module opening_profile(inset=0){profile(opening,corner_r,inset);}
// User: plain rectangular outer edge, no rounding.
module rebate_profile(inset=0){
    translate([rebate[0]+inset,rebate[1]+inset])
        square([rebate[2]-2*inset,rebate[3]-2*inset]);
}
