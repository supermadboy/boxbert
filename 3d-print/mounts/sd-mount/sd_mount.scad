// Boxbert HW-125, 2026-10-16. Finished print geometry, NOT measured fit approval.
// PCB 23.68 x 41.78 user measurement; 20 x 38 hole pitch accepted online basis.
// Four stepped posts / underside RX-M2.5x5.7 / two wood screws: finish proposal.
$fn=64;
eps=0.02;
cell=4; rib=2; nx=7; ny=9; base_h=2;
W=nx*(cell+rib)+rib; D=ny*(cell+rib)+rib;
pcb_w=23.68; pcb_d=41.78; pcb_t=1.6; // thickness assumed
board_z=12;
origin=[(W-pcb_w)/2,(D-pcb_d)/2];
hole_pitch=[20,38];
holes=[for(y=[-1,1],x=[-1,1]) [W/2+x*hole_pitch[0]/2,D/2+y*hole_pitch[1]/2]];
wide_d=8.2; wide_top=8; neck_d=4.6; root_d=10.4;
insert_d=4; insert_l=5.7; insert_max_d=4.6;
insert_setback=0.2; insert_depth=6.7; screw_clear_d=2.8;
wood=[[4,D/2],[W-4,D/2]];
wood_d=3.2; wood_head_d=6.2; wood_pad_d=8; wood_pad_h=3.5;
sink_h=(wood_head_d-wood_d)/2;
// Assumed envelopes, not a measured underside or supplier footprint.
pin_overhang=3.4; solder_r=1.1;
pins=[for(i=[0:5]) [W/2+(i-2.5)*2.54,9]];
show_board=true; show_envelopes=true; show_hardware=true;
scene="mount";

assert(W==44 && D==56 && board_z==12);
assert((wide_d-insert_max_d)/2>=1.6);
assert(insert_depth>=insert_l+1);
assert(wide_top-(insert_setback+insert_depth)>=1);
assert(board_z-wide_top>=pin_overhang+0.6);
assert((neck_d-screw_clear_d)/2>=0.8);
assert(wood_pad_h-sink_h>=base_h);
for(h=holes) for(p=pins)
    assert(norm(h-p)-neck_d/2-solder_r>=0.2,"Assumed pin/solder envelope hits seat");
for(w=wood) assert(w[0]+wood_head_d/2<origin[0] || w[0]-wood_head_d/2>origin[0]+pcb_w);

module grid() {
    linear_extrude(base_h) difference() {
        offset(r=0.8) offset(delta=-0.8) square([W,D]);
        for(x=[0:nx-1],y=[0:ny-1])
            translate([rib+x*(cell+rib),rib+y*(cell+rib)]) square([cell,cell]);
    }
}
module post() {
    cylinder(d=root_d,h=base_h);
    translate([0,0,base_h]) cylinder(d1=root_d,d2=wide_d,h=1);
    cylinder(d=wide_d,h=wide_top);
    cylinder(d=neck_d,h=board_z);
}
module mount() {
    difference() {
        union() {
            grid();
            for(h=holes) translate(h) post();
            for(w=wood) translate(w) cylinder(d=wood_pad_d,h=wood_pad_h);
        }
        for(h=holes) translate(h) {
            translate([0,0,-eps]) cylinder(d=insert_d,h=insert_setback+insert_depth+eps);
            translate([0,0,-eps]) cylinder(d=screw_clear_d,h=board_z+2*eps);
        }
        for(w=wood) translate(w) {
            translate([0,0,-eps]) cylinder(d=wood_d,h=wood_pad_h+2*eps);
            translate([0,0,wood_pad_h-sink_h]) cylinder(d1=wood_d,d2=wood_head_d+2*eps,h=sink_h+eps);
        }
    }
}
module pcb() {
    translate([0,0,board_z]) linear_extrude(pcb_t) difference() {
        translate(origin) square([pcb_w,pcb_d]);
        // Hole diameter is drawing allowance, NOT measured user hole diameter.
        for(h=holes) translate(h) circle(d=2.7);
    }
}
module solder_envelopes() {
    for(p=pins) translate(p) {
        translate([0,0,board_z-pin_overhang]) cylinder(r=0.6,h=pin_overhang);
        translate([0,0,board_z-0.8]) cylinder(r1=0.6,r2=solder_r,h=0.8);
    }
}
module underside_envelope() {
    // Broad central allowance; unknown real underside must be compared with this.
    translate([14.7,12,9]) cube([14.6,32,3]);
    solder_envelopes();
}
module connector_envelope() {
    // Right-angle header + connected Dupont body extending out toward -Y.
    translate([14.1,-9,board_z+0.1]) cube([15.8,19,5.5]);
}
module card_sweep() {
    // Assumed card + insertion/removal path, no finger-access certification.
    translate([15.5,40,board_z+pcb_t+0.2]) cube([13,34,2.4]);
}
module components(margin=0) {
    // Symbolic envelopes, NOT exact/confirmed hardware measurements.
    translate([14.2-margin,29-margin,board_z+pcb_t]) cube([15.6+2*margin,17.4+2*margin,2]);
    translate([14.38-margin,7.2-margin,board_z+pcb_t]) cube([15.24+2*margin,2.6+2*margin,2.6]);
    translate([13.5-margin,13-margin,board_z+pcb_t]) cube([5+2*margin,6+2*margin,2]);
    translate([25.5-margin,13-margin,board_z+pcb_t]) cube([4+2*margin,6+2*margin,1.5]);
}
module inserts() {
    for(h=holes) translate(h) translate([0,0,insert_setback]) difference() {
        cylinder(d=insert_max_d,h=insert_l);
        translate([0,0,-eps]) cylinder(d=2.5,h=insert_l+2*eps);
    }
}
module screws(head_d=4) {
    // M2.5x12 example: REDUCED head max D4 / H1.8; real availability/fit check.
    for(h=holes) translate(h) {
        translate([0,0,board_z+pcb_t-12]) cylinder(d=2.5,h=12);
        translate([0,0,board_z+pcb_t]) cylinder(d=head_d,h=1.8);
    }
}
if(scene=="mount") {
    color([0.93,0.57,0.18]) mount();
    if($preview && show_board) {
        color([0.12,0.45,0.38,0.33]) translate([0,0,0.03]) pcb();
        color([0.65,0.68,0.7,0.65]) components();
        if(show_envelopes) {
            color([0.9,0.15,0.15,0.5]) underside_envelope();
            color([0.2,0.65,0.95,0.25]) connector_envelope();
            color([0.7,0.4,0.9,0.22]) card_sweep();
        }
        if(show_hardware) {
            color([0.8,0.68,0.25]) inserts();
            color([0.75,0.78,0.8,0.8]) screws();
        }
    }
}
echo("HW125 mount mm",W,D,board_z,"PCB origin",origin,"holes",holes);
echo("UNDER entry inserts; NOT physical approval; top screw-head clearance unmeasured");
