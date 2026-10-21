// Local LED view: cable outlet now +x; hole row +y; +z OUT.
// Cable side is user mechanical correction; electrical pad order unverified.
// Photo PXL_20261021_175716386: +y points LEFT toward deck interior.
// User measurements 21.10.2026; exact LED/SMD XY remain illustrative envelopes.
pcb_w=54;
pcb_d=9.9;
pcb_t=1.6;
led_h=1.63;          // measured PCB+LED 3.23 minus PCB 1.6
// Reference-derived XY, NOT measurements of component positions on this board.
led_xy=[for(i=[0:7]) [(3.175+i*6.35)*54/50.8,3.81]];
cap_xy=[for(p=[[2.413,8.382],[8.382,8.382],[16.891,8.382],[22.225,8.382],[28.575,8.382],[33.655,8.382],[42.037,8.382],[48.26,8.382]]) [p[0]*54/50.8,p[1]-0.26]];
board_hole_d=3;
// Clear gap 23 + diameter 3 = pitch 26; right margin to hole edge 12.8.
// Near long-edge clearance 0.7 + radius 1.5 = center 2.2 from rear edge.
board_holes=[[13.7,7.7],[39.7,7.7]];
wood_z=12;           // contact plane; printed part starts at z=0
wood_h=12;
glass_h=3;           // proposed opal PMMA, verify actual thickness
optical_gap=3;       // proposed LED/glass gap, no optical test
board_z=wood_z+wood_h-glass_h-optical_gap-led_h-pcb_t; //14.77
opening=[-2.2,-2.2,58.4,14.3]; // 2.2 mm per measured PCB edge
rebate_width=10;
rebate=[opening[0]-rebate_width,opening[1]-rebate_width,opening[2]+2*rebate_width,opening[3]+2*rebate_width];
corner_r=2;
fit=0.20;           // per side, needs real print/wood calibration
lead_in=0.4;
lead_h=0.6;
guide_h=4.5;
guide_wall=1.5;
guide_clip=2.4; // corner guides leave assumed short-end cable route clear; check actual solder
// User correction: BOTH tabs toward photo LEFT, i.e. hole-row side +y.
wood_points=[[20,19.9],[34,19.9]];
tab_h=3.5;
wood_d=3.2;
head_d=6.2;
wood_screw_l=12;
base_h=2;
post_d=8;
post_top=7;
neck_d=3.8;
m2_clear=2.3;
nut_af=4.2;          // assumed M2 nut AF4 + 0.2 calibration allowance
nut_pocket_h=3;      // deeper rear entry seats nut nearer PCB for thread reserve
nut_h=1.6;
m2_length=16;        // head to tip, not a countersunk screw
head_h=2;            // maximum allowed head height; verify actual selected screw
pcb_head_d=3;        // tested envelope ONLY; clashes with assumed component XY, NOT approved
panel_rect=[-98,-20.46,250,180]; // reference placement only, user owns deck layout
rear_wall_y=-8.46;  // reference wall INSIDE plane, now opposite tabs (-y)
// Reference unchanged: enlarged rebate overlaps this assumed wall by 3.74 mm.
rear_wall_t=12;
assert(abs(board_z-14.77)<0.001);
assert(guide_h<wood_h-glass_h);
assert((post_d-nut_af/cos(30))/2>1.5);
assert(tab_h-(head_d-wood_d)/2>=2);
assert(wood_h-(wood_screw_l-tab_h)>=3);
// Enlarged rebate requires a new real deck layout; do not assert old wall clearance.
module profile(r,rad=3,inset=0){
    translate([r[0]+rad,r[1]+rad]) offset(r=rad-inset) square([r[2]-2*rad,r[3]-2*rad]);
}
module opening_profile(inset=0){profile(opening,corner_r,inset);}
// User: plain rectangular outer edge, no rounding.
module rebate_profile(inset=0){
    translate([rebate[0]+inset,rebate[1]+inset])
        square([rebate[2]-2*inset,rebate[3]-2*inset]);
}
