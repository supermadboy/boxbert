// Boxbert ADA3006/MAX98357A — Vorschlag 09.10.2026, keine Druckabnahme.
// Original-Mono-PCB, zwei Montageloecher. Einsaetze von unten.
cell=4;
rib=2;
nx=6;
ny=4;
base_h=2;
board_z=12;
wide_d=8.2;
wide_top=8;
neck_d=4.6;
support_d=4;
root_d=10;
insert_d=4;
insert_l=5.7;
insert_max_d=4.6;
insert_setback=0.2;
insert_depth=6.7;
screw_clear_d=2.8;
wood_d=3.2;
wood_head_d=6.2; // Kopfannahme, reale Schraube pruefen
wood_pad_d=8;
wood_pad_h=3.5;
board_t=1.6; // nur Vorschau/Rechenbeispiel, nicht gemessen
pin_overhang=3.4; // ungepruefte Entwurfshuelle, NICHT Hardware-Messung
solder_radius=1.3;
show_board=true;
show_envelopes=true;
show_inserts=true;
show_terminal=true;
$fn=80;
eps=0.02;
W=nx*(cell+rib)+rib;
D=ny*(cell+rib)+rib;
pcb_w=17.78;
pcb_d=19.05;
pcb_r=2.54;
origin=[(W-pcb_w)/2,(D-pcb_d)/2];
holes=[for(x=[2.54,15.24]) origin+[x,16.51]];
supports=[for(x=[4.5,13.28]) origin+[x,7]];
pins=[for(k=[0:6]) origin+[1.27+k*2.54,2.54]];
terminal_pads=[origin+[7.09,15.494],origin+[10.59,15.494]];
all_pads=concat(pins,terminal_pads);
wood=[[4,D/2],[W-4,D/2]];
pocket_top=insert_setback+insert_depth;
sink_h=(wood_head_d-wood_d)/2;
assert(W==38 && D==26 && board_z==12);
assert((wide_d-insert_max_d)/2>=1.6);
assert(insert_depth>=insert_l+1);
assert(wide_top-pocket_top>=1);
assert(board_z-wide_top>=pin_overhang+0.6);
assert((neck_d-screw_clear_d)/2>=0.8);
assert(wood_pad_h-sink_h>=base_h);
for(h=holes) {
    assert(h[0]>root_d/2+0.2 && h[0]<W-root_d/2-0.2);
    assert(h[1]>root_d/2+0.2 && h[1]<D-root_d/2-0.2);
    for(p=all_pads) assert(norm(h-p)-neck_d/2-solder_radius>=0.4);
    for(s=supports) assert(norm(h-s)>wide_d/2+support_d/2+0.5);
}
for(s=supports) for(p=all_pads)
    assert(norm(s-p)-support_d/2-solder_radius>=0.4);
for(w=wood) {
    assert(w[0]+wood_head_d/2<origin[0] ||
           w[0]-wood_head_d/2>origin[0]+pcb_w);
    for(h=holes) assert(norm(w-h)>wood_pad_d/2+wide_d/2+0.5);
}
module grid() {
    linear_extrude(base_h) difference() {
        offset(r=0.8) offset(delta=-0.8) square([W,D]);
        for(x=[0:nx-1],y=[0:ny-1])
            translate([rib+x*(cell+rib),rib+y*(cell+rib)]) square([cell,cell]);
    }
}
module screw_post() {
    cylinder(d=wide_d,h=wide_top);
    cylinder(d=neck_d,h=board_z);
    translate([0,0,base_h]) cylinder(d1=root_d,d2=wide_d,h=1);
    cylinder(d=root_d+0.4,h=base_h);
}
module support_post() {
    cylinder(d=support_d,h=board_z);
    translate([0,0,base_h]) cylinder(d1=6,d2=support_d,h=1);
    cylinder(d=6.4,h=base_h);
}
module mount() {
    difference() {
        union() {
            grid();
            for(h=holes) translate(h) screw_post();
            for(s=supports) translate(s) support_post();
            for(w=wood) translate(w) cylinder(d=wood_pad_d,h=wood_pad_h);
        }
        for(h=holes) translate(h) {
            translate([0,0,-eps]) cylinder(d=insert_d,h=pocket_top+eps);
            translate([0,0,-eps]) cylinder(d=screw_clear_d,h=board_z+2*eps);
        }
        for(w=wood) translate(w) {
            translate([0,0,-eps]) cylinder(d=wood_d,h=wood_pad_h+2*eps);
            translate([0,0,wood_pad_h-sink_h])
                cylinder(d1=wood_d,d2=wood_head_d+2*eps,h=sink_h+eps);
        }
    }
}
module pcb() {
    translate([origin[0],origin[1],board_z+0.03]) linear_extrude(board_t)
        difference() {
            offset(r=pcb_r) translate([pcb_r,pcb_r])
                square([pcb_w-2*pcb_r,pcb_d-2*pcb_r]);
            for(h=holes) translate(h-origin) circle(d=2.5);
            for(p=all_pads) translate(p-origin) circle(d=1);
        }
}
module envelopes() {
    for(p=all_pads) translate(p) {
        translate([0,0,board_z-pin_overhang]) cylinder(r=0.55,h=pin_overhang);
        translate([0,0,board_z-0.8]) cylinder(r1=0.55,r2=solder_radius,h=0.8);
    }
}
module inserts() {
    for(h=holes) translate(h) translate([0,0,insert_setback]) difference() {
        cylinder(d=insert_max_d,h=insert_l);
        translate([0,0,-eps]) cylinder(d=2.5,h=insert_l+2*eps);
    }
}
module terminal_symbol() {
    // Symbolisch nach Foto positioniert; KEINE masshaltige Klemmengeometrie.
    translate([origin[0]+5.39,origin[1]+12.494,board_z+board_t+0.06])
        cube([7,6,5]);
}
color([0.92,0.57,0.18]) mount();
if($preview && show_board) {
    color([0.15,0.4,0.8,0.30]) pcb();
    if(show_envelopes) color([0.8,0.13,0.12,0.6]) envelopes();
    if(show_inserts) color([0.8,0.68,0.25]) inserts();
    if(show_terminal) color([0.1,0.6,0.25,0.45]) terminal_symbol();
}
echo("Mount W/D/H",W,D,board_z,"PCB-Ursprung",origin);
echo("Montageloecher",holes,"Stuetzen",supports);
echo("Einsaetze UNTEN, Kammerende",pocket_top,"Wand um max-D",(wide_d-insert_max_d)/2);
echo("Holzeingriff nominal",12-wood_pad_h,"Reserve bei 12mm Holz",wood_pad_h);
