// Boxbert ADA4886 — NEUKONSTRUKTION 2026-10-09, kein Passungsnachweis.
// Original-Eagle-Lochbild; keine Geometrie aus dem verworfenen Entwurf.
// Konzeptabweichung zur Step-Up-Vorlage: Einsaetze von UNTEN eingesetzt.
// Nutzerfreigabe dieser Abweichung und der zwei Holzschrauben noch offen.

/* [Boden] */
cell = 4;
rib = 2;
nx = 9;
ny = 4;
base_h = 2;

/* [Pfosten] */
board_z = 12;                 // PCB-Unterseite, 10 mm ueber Gitter
wide_d = 8.2;                 // 1.8 mm Wand selbst um Einsatz-max-D 4.6
wide_top = 8;                 // 4 mm vertikale Reserve zur PCB-Unterseite
neck_d = 4.6;                 // nahe Pins: 0.41 mm zu angenommener Lotzone
support_d = 4.6;
root_d = 10;
root_h = 1;
insert_d = 4;                 // ruthex Einbauloch, nicht Aussenmass
insert_l = 5.7;
insert_max_d = 4.6;
insert_setback = 0.2;         // Unterkante knapp oberhalb Holzauflage
insert_depth = 6.7;           // L+1 vom vorgesehenen Einsatzbeginn
screw_clear_d = 2.8;

/* [Holz] */
wood_d = 3.2;
wood_head_d = 6.2;            // Annahme, Fabrikat/Kopf pruefen
wood_pad_d = 8;
wood_pad_h = 3.5;
wood_screw_l = 12;
wood_h = 12;

/* [Ungepruefte Hardware-Huellraeume] */
// Keine vermeintlich gemessenen Loetstellen: nur zulaessige Entwurfshuellen.
solder_radius = 1.1;
pin_overhang = 3.4;
pin_radius = 0.55;
vertical_margin = 0.6;
board_t = 1.6;                // NUR Vorschau/Schraubenlaengen-Beispiel

/* [Vorschau] */
show_board = true;
show_envelopes = true;
show_inserts = true;

/* [Hidden] */
$fn = 80;
eps = 0.02;
W = nx*(cell+rib)+rib;
D = ny*(cell+rib)+rib;
pcb_w = 38.1;
pcb_d = 17.78;
pcb_r = 2.54;                // Layer 20: curve=90, keine Fasen!
origin = [(W-pcb_w)/2, (D-pcb_d)/2];
// Reihenfolge: links unten, rechts unten, links oben, rechts oben.
holes = [for (y=[2.54,15.24], x=[2.54,35.56]) origin+[x,y]];
threaded = [0,3];
supported = [1,2];
rows = [[2.54,6.35,11],[5.08,21.59,5],[12.7,6.35,11],[15.24,6.35,11]];
pins = [for (row=rows, k=[0:row[2]-1]) origin+[row[1]+k*2.54,row[0]]];
wood = [[4,D/2],[W-4,D/2]];
pocket_top = insert_setback+insert_depth;
sink_h = (wood_head_d-wood_d)/2; // 90 Grad

assert(W==56 && D==26, "Pruefskript/Bilder bei Rasteraenderung anpassen");
assert((wide_d-insert_max_d)/2 >= 1.6, "ruthex Mindestwand unterschritten");
assert(insert_depth >= insert_l+1);
assert(wide_top-pocket_top >= 1, "Zu wenig Material ueber Einsatzkammer");
assert(board_z-wide_top >= pin_overhang+vertical_margin,
       "Breiter Pfosten reicht in Pin-Huellraum");
assert((neck_d-screw_clear_d)/2 >= 0.8, "Schraubenhals zu duenn");
assert(wood_pad_h-sink_h >= base_h);
assert(wood_h-(wood_screw_l-wood_pad_h) >= 3);
assert(len(pins)==38);
for (h=holes) {
    for(p=pins)
        assert(norm(p-h)-neck_d/2-solder_radius >= 0.4,
               "Obere Auflage kollidiert mit Lot-Huellraum");
    assert(h[0]>root_d/2+0.2 && h[0]<W-root_d/2-0.2);
    assert(h[1]>root_d/2+0.2 && h[1]<D-root_d/2-0.2);
}
for (w=wood) {
    // Freier Kopfzugang neben PCB, nicht unter der Platine.
    assert(w[0]+wood_head_d/2 < origin[0] ||
           w[0]-wood_head_d/2 > origin[0]+pcb_w);
    for(h=holes)
        assert(norm(w-h) > wood_pad_d/2+wide_d/2+0.5);
}

module grid() {
    linear_extrude(base_h)
        difference() {
            offset(r=0.8) offset(delta=-0.8) square([W,D]);
            for (x=[0:nx-1], y=[0:ny-1])
                translate([rib+x*(cell+rib),rib+y*(cell+rib)])
                    square([cell,cell]);
        }
}
module screw_post() {
    // Keine Freistiche! Unterer Bereich hat volle umlaufende Einsatzwand.
    cylinder(d=wide_d,h=wide_top);
    cylinder(d=neck_d,h=board_z);
    translate([0,0,base_h]) cylinder(d1=root_d,d2=wide_d,h=root_h);
    cylinder(d=root_d+0.4,h=base_h);
}
module support_post() {
    cylinder(d=support_d,h=board_z);
    translate([0,0,base_h]) cylinder(d1=6,d2=support_d,h=root_h);
    cylinder(d=6.4,h=base_h);
}
module mount() {
    difference() {
        union() {
            grid();
            for(i=threaded) translate(holes[i]) screw_post();
            for(i=supported) translate(holes[i]) support_post();
            for(w=wood) translate(w) cylinder(d=wood_pad_d,h=wood_pad_h);
        }
        for(i=threaded) translate(holes[i]) {
            // Von unten offene Einbaukammer; keine Sacklochmontage von oben.
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
module pcb_outline() {
    // Originalkontur: vier Viertelkreise Radius 2.54 mm.
    offset(r=pcb_r) translate([pcb_r,pcb_r])
        square([pcb_w-2*pcb_r,pcb_d-2*pcb_r]);
}
module pcb() {
    translate([origin[0],origin[1],board_z+0.03])
        linear_extrude(board_t)
            difference() {
                pcb_outline();
                for(h=holes) translate(h-origin) circle(d=2.5);
                for(p=pins) translate(p-origin) circle(d=1);
            }
}
module envelopes() {
    // Symbolische maximale Loet-/Pinhuellen, KEINE reale Header-Geometrie.
    for(p=pins) translate(p) {
        translate([0,0,board_z-pin_overhang])
            cylinder(r=pin_radius,h=pin_overhang);
        translate([0,0,board_z-0.8])
            cylinder(r1=pin_radius,r2=solder_radius,h=0.8);
    }
}
module inserts() {
    // Nennhuelle mit maximalem Aussendurchmesser; keine Raendelung/Gewinde.
    for(i=threaded) translate(holes[i])
        translate([0,0,insert_setback]) difference() {
            cylinder(d=insert_max_d,h=insert_l);
            translate([0,0,-eps]) cylinder(d=2.5,h=insert_l+2*eps);
        }
}
color([0.92,0.57,0.18]) mount();
if ($preview && show_board) color([0.25,0.48,0.37,0.30]) pcb();
if ($preview && show_board && show_envelopes)
    color([0.8,0.13,0.12,0.55]) envelopes();
if ($preview && show_board && show_inserts)
    color([0.8,0.68,0.25]) inserts();
echo("NEU: B/T/H",W,D,board_z,"PCB-Ursprung",origin);
echo("Einsatzwand um max. Aussendurchmesser",(wide_d-insert_max_d)/2);
echo("Einsaetze von UNTEN, Unterkante",insert_setback,"Kammerende",pocket_top);
echo("Pinreserve vertikal",board_z-wide_top,"Auflage-D",neck_d);
echo("Holzschraubenanzahl",len(wood),"Eingriff nominal",wood_screw_l-wood_pad_h);
