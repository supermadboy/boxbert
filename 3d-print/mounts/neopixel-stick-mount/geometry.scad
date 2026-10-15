// Single coordinate/stack source. Outside LED view: DIN left, +y REAR, +z OUT.
// PCB XY from original Adafruit v2. User accepts this design basis, not measured NEOPS8.
pcb_w=50.8;
pcb_d=10.16;
pcb_t=1.6;            // ASSUMED, not Eagle height data
led_h=1.5;            // nominal package height, actual module unmeasured
led_xy=[for(i=[0:7]) [3.175+i*6.35,3.81]];
cap_xy=[[2.413,8.382],[8.382,8.382],[16.891,8.382],[22.225,8.382],[28.575,8.382],[33.655,8.382],[42.037,8.382],[48.26,8.382]]; // conservative 0805 bodies, includes input R1
board_holes=[[12.7,8.128],[38.1,8.128]];
wood_z=12;           // contact plane; printed part starts at z=0
wood_h=12;
glass_h=3;           // proposed opal PMMA, verify actual thickness
optical_gap=3;       // proposed LED/glass gap, no optical test
board_z=wood_z+wood_h-glass_h-optical_gap-led_h-pcb_t; //14.9
opening=[-6,-5,62.8,22.16];
rebate=[-10,-9,70.8,30.16];
corner_r=3;
fit=0.20;           // per side, needs real print/wood calibration
lead_in=0.4;
lead_h=0.6;
guide_h=4.5;
guide_wall=2.2;
// Both wood screws near the middle, on FRONT side only; never rear tabs.
wood_points=[[18.4,-17],[32.4,-17]];
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
nut_pocket_h=2.2;    // insert M2 nuts from back, nominal nut h1.6
nut_h=1.6;
m2_length=16;        // head to tip, not a countersunk screw
head_h=2;            // assumed M2 socket head height; check actual screw
pcb_head_d=3.8;      // max head OD here: larger head/washer touches LED corners
panel_rect=[-99.6,-142.84,250,180];
rear_wall_y=25.16;   // inside plane of 12-mm rear wall
rear_wall_t=12;
assert(abs(board_z-14.9)<0.001);
assert(guide_h<wood_h-glass_h);
assert((post_d-nut_af/cos(30))/2>1.5);
assert(tab_h-(head_d-wood_d)/2>=2);
assert(wood_h-(wood_screw_l-tab_h)>=3);
assert(rear_wall_y-(rebate[1]+rebate[3])>=4-0.001);
module profile(r,rad=3,inset=0){
    translate([r[0]+rad,r[1]+rad]) offset(r=rad-inset) square([r[2]-2*rad,r[3]-2*rad]);
}
module opening_profile(inset=0){profile(opening,corner_r,inset);}
module rebate_profile(inset=0){profile(rebate,corner_r,inset);}
