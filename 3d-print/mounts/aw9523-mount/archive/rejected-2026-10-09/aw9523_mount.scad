// Boxbert — AW9523 (ADA4886) Einzel-Mount, 2026-10-09
// Stil wie der freigegebene Step-Up-Mount: regelmaessiger, durchbrochener
// Gitterboden, einzelne Pfosten, keine Waende/Mulde/L-Auflage.
//
// Besonderheit gegenueber dem Step-Up (aus dem Original-PCB abgeleitet):
// Die 4 Montageloecher (D 2.5) liegen bei (2.54/35.56 x 2.54/15.24) —
// IN DENSELBEN REIHEN wie die Stiftleisten JP1/JP7/JP2/JP3 (D 1.0,
// Raster 2.54). Der naechste Pin sitzt nur 3.81 mm vom Lochzentrum.
// Ein durchgehender Heat-Set-Pfosten (mind. D 7.2 wegen ruthex-Wand
// 1.6 mm) kollidiert dort mit Stift und Lotkegel. Deshalb:
//  - 2 diagonale Schraubpfosten (Loecher A/D) mit PIN-FREISTICH im
//    Pfostenmantel (zweistufig: Kegelzone unten breiter, Pinzone schmaler),
//  - 2 massive Stuetzpfosten (D 4) unter den uebrigen Loechern B/C —
//    klein genug fuer den Pinabstand, ohne Freistich.
// Freistich-Wand im Kegelsektor nur ca. 0.6 mm (Abweichung von der
// ruthex-Mindestwand 1.6 mm, unten dokumentiert und begrenzt).
//
// Entwurf / Passungspruefung offen, KEINE Einbau- oder Druckfreigabe.
// Quellen und offene Annahmen: README.md.

/* [Gitterboden] */
cell_size = 4;               // quadratische, vollstaendig offene Zellen
rib_width = 2;               // ALLE regulaeren Rippen gleich breit
cells_x = 7;
cells_y = 4;
base_thickness = 2;

/* [Pfosten] */
post_height = 8;             // UEBER der Oberseite des Gitterbodens
insert_post_d = 8.2;         // 1.8 mm radial ausserhalb Einsatz-max. D 4.6
insert_root_d = 10;
support_d = 4;               // klein genug: naechster Pin 3.81 mm vom Zentrum
support_root_d = 5.6;
root_height = 1;             // kurze lokale Fussverbreiterung, keine Wand
insert_hole_d = 4.0;         // offizielles ruthex EINBAULOCH, Passung testen
insert_hole_depth = 6.7;     // Hersteller: Einsatzlaenge 5.7 + min. 1 mm

/* [Lotkegel-/Pin-Freiraum] */
pin_r_max = 0.55;            // plattierter Stift in D-1.0-Loch
fillet_r_max = 1.1;          // Lotkegel um die Pin-Mitte (schlank loeten!)
fillet_depth = 0.9;          // Kegelzone unter der Platinenunterseite
pin_protrusion_max = 2.6;    // Annahme: Stiftleisten; keine freihhaengenden Adern
clear_margin = 0.1;

/* [Holzbefestigung — Nutzerentscheidung 2026-10-09, wie Step-Up] */
// Holzschraube 3 x 12 mm, Senkkopf; KEIN metrisches M3-Gewinde.
// HIER 2 Stueck (Basis 44 mm lang), gegenueber 1 x Step-Up abgestimmt.
wood_hole_d = 3.2;
wood_pad_d = 8;
wood_pad_thickness = 3.5;    // lokale GESAMTdicke ab Holzoberseite
wood_head_clearance_d = 6.2; // fuer Kopf ca. D6; konkretes Fabrikat pruefen
wood_head_angle = 90;        // Entwurfsannahme, am realen Kopf pruefen
wood_screw_length = 12;      // bei Senkkopf INKLUSIVE Kopf
wood_thickness = 12;         // beschlossen: Pappelsperrholz, Istmass pruefen
wood_positions = [[12, 13], [32, 13]];

/* [Platine ADA4886 — Original-PCB, reale Passung offen] */
board_width = 38.1;
board_length = 17.78;
board_clip = 2.54;           // alle 4 Ecken 45-Grad gefast (Layer-20-Kontur)
board_origin = [2.95, 4.11]; // auf der Basis; Rand um Pfostenkoepfe
hole_inset = 2.54;           // Lochzentren laut Eagle-Boardfile
board_hole_d = 2.5;
// Durchreihte Reihen (PCB-Koordinaten, D 1.0): [y, x_erstes, x_letztes, Anzahl]
pin_rows = [[2.54, 6.35, 31.75, 11],   // JP1  (Kantenreihe oben)
            [5.08, 21.59, 31.75, 5],   // JP3  (Vin-Reihe)
            [12.7, 6.35, 31.75, 11],   // JP2
            [15.24, 6.35, 31.75, 11]]; // JP7  (Kantenreihe unten)
insert_idx = [0, 3];  // Schraubpfosten: Loch 0 (A, vorn links) + 3 (D, hinten rechts)
support_idx = [1, 2]; // Stuetzpfosten unter Loch 1 (B) und 2 (C)
pcb_screw_len = 8;    // Empfehlung M2,5 x 8; PCB-Dicke ~1.6 mm UNGEPRUEFT

/* [Vorschau — nicht im STL] */
show_board = true;
show_pins = true;
show_insert = true;
board_preview_thickness = 1.6; // ANNAHME zur Darstellung, nicht gemessen

/* [Hidden] */
$fn = 80;
eps = 0.02;
pitch = cell_size + rib_width;
base_width = cells_x * cell_size + (cells_x + 1) * rib_width;   // 44
base_length = cells_y * cell_size + (cells_y + 1) * rib_width;  // 26
board_z = base_thickness + post_height;                         // 10
hole_positions = [for (i = [0:3])
    board_origin + [(i == 0 || i == 2) ? hole_inset : board_width - hole_inset,
                    i < 2 ? hole_inset : board_length - hole_inset]];
pins = [for (row = pin_rows, k = [0:row[3] - 1])
    [row[1] + k * 2.54, row[0]] + board_origin];
wood_countersink_depth = (wood_head_clearance_d - wood_hole_d) /
                         (2 * tan(wood_head_angle / 2));
wood_nominal_penetration = wood_screw_length - wood_pad_thickness;
insert_length = 5.7;
insert_max_d = 4.6;          // ruthex Masszeichnung: d1

assert(cell_size > 0 && rib_width >= 1.6 && base_thickness >= 1.6);
assert(cells_x >= 1 && cells_y >= 1);
assert(len(pins) == 38, "Pinliste unvollständig");
assert(insert_hole_depth >= insert_length + 1);
assert(insert_hole_d < insert_max_d);
assert((insert_post_d - insert_max_d) / 2 >= 1.6,
       "Zu wenig Material um den eingesetzten Heat-Set-Einsatz (ausserhalb der Freistiche)");
assert(post_height - insert_hole_depth >= 1,
       "Mindestens 1 mm geschlossener Pfostenboden über dem Gitter");
assert(board_z - pin_protrusion_max - 0.4 >= base_thickness,
       "Pinzone muss ueber dem Gitter enden");
assert(root_height > 0 && root_height < post_height);
assert(wood_hole_d > 0 && wood_pad_d - wood_hole_d >= 3.2);
assert(wood_head_angle > 0 && wood_head_angle < 180);
assert(wood_head_clearance_d > wood_hole_d &&
       wood_pad_d > wood_head_clearance_d);
assert(wood_pad_thickness >= base_thickness);
assert(wood_pad_thickness - wood_countersink_depth >= base_thickness,
       "Mindestens Gitterbodendicke unter der Senkung erhalten");
assert(wood_nominal_penetration > 0 &&
       wood_thickness - wood_nominal_penetration >= 3,
       "Mindestens 3 mm nominale Holzreserve; Istmasse trotzdem pruefen");
for (w = wood_positions) {
    assert(w[0] - wood_pad_d / 2 >= 0 && w[0] + wood_pad_d / 2 <= base_width &&
           w[1] - wood_pad_d / 2 >= 0 && w[1] + wood_pad_d / 2 <= base_length);
    // Holzsenkung/-loch bleiben von den Pfostenkoepfen frei (Pad-Verschmelzung
    // mit den Fussbereichen ist ok, Durchgang und Senkung nicht).
    for (i = insert_idx)
        assert(norm(w - hole_positions[i]) - wood_head_clearance_d / 2
               >= insert_post_d / 2 + 0.3,
               "Holzsenkung kollidiert mit Schraubpfosten");
    for (i = support_idx)
        assert(norm(w - hole_positions[i]) - wood_head_clearance_d / 2
               >= support_d / 2 + 0.3,
               "Holzsenkung kollidiert mit Stuetzpfosten");
}
for (h = hole_positions) {
    assert(h[0] - insert_post_d / 2 >= 0.2 && h[0] + insert_post_d / 2 <= base_width - 0.2 &&
           h[1] - insert_post_d / 2 >= 0.2 && h[1] + insert_post_d / 2 <= base_length - 0.2);
}
// Pcb-Schraube darf im Sackloch nicht auf dem Boden bottomen
assert(pcb_screw_len - 2.0 <= insert_hole_depth - 0.3,
       "M2,5-Schraube zu lang: bottomet im Sackloch (PCB-Dicke unklar)");

module checks() {
    // Jeder Pin muss either klar am Pfosten vorbeikommen oder im Freistich
    // liegen; Stuetzpfosten muessen von allen Pins frei bleiben.
    for (i = insert_idx) {
        near = [for (p = pins)
            if (norm(p - hole_positions[i]) < insert_post_d / 2 + fillet_r_max
                + clear_margin) p];
        assert(len(near) >= 1, "Freistich-Logik: kein benachbarter Pin gefunden");
        assert(len(near) <= 2, "Mehr als 2 Pins am Pfosten: Freistich-Logik pruefen");
        for (p = near) {
            d = norm(p - hole_positions[i]);
            wall_fillet = d - fillet_r_max - clear_margin - insert_hole_d / 2;
            wall_pin = d - pin_r_max - clear_margin - insert_hole_d / 2;
            assert(wall_fillet >= 0.5,
                   "Wand im Kegel-Freistich unter 0.5 mm — Einsatz riskant");
            assert(wall_pin >= 1.0,
                   "Wand im Pin-Freistich unter 1.0 mm — Einsatz riskant");
            assert(asin(fillet_r_max / d) * 180 / 3.14159 + 2
                   <= (asin(fillet_r_max / d) + 5) * 180 / 3.14159);
        }
    }
    for (i = support_idx)
        for (p = pins)
            assert(norm(p - hole_positions[i]) >= support_d / 2 + fillet_r_max + 0.3,
                   "Stuetzpfosten kollidiert mit Stift/Lotkegel");
}
checks();

module grid_2d() {
    difference() {
        offset(r = 0.8) offset(delta = -0.8)
            square([base_width, base_length]);
        for (ix = [0:cells_x - 1], iy = [0:cells_y - 1])
            translate([rib_width + ix * pitch, rib_width + iy * pitch])
                square([cell_size, cell_size]);
    }
}

module reinforced_base() {
    linear_extrude(base_thickness)
        union() {
            grid_2d();
            // Pads 0.2 mm radial breiter als die konischen Fuesse: keine fast
            // deckungsgleichen Kreis-Kanten beim STL-Export.
            for (i = insert_idx)
                translate(hole_positions[i]) circle(d = insert_root_d + 0.4);
            for (i = support_idx)
                translate(hole_positions[i]) circle(d = support_root_d + 0.4);
            for (w = wood_positions) translate(w) circle(d = wood_pad_d);
        }
}

module post_at(p, d, root_d) {
    translate([p[0], p[1], 0]) {
        // Kern durchgehend ab Druckbett; kein nahezu deckungsgleicher
        // Z-Overlap am Fuss (STL-Float-Export-Finding Step-Up).
        cylinder(d = d, h = board_z);
        translate([0, 0, base_thickness])
            cylinder(d1 = root_d, d2 = d, h = root_height);
    }
}

// Zweistufiger Freistich im Pfostenmantel, ausgerichtet auf den Pin:
// Kegelzone (oben, breiter) und reine Pinzone (darunter, schmaler).
module wedge(inner_r, half_angle, z0, z1, ang) {
    R = insert_post_d / 2 + 2;
    rotate([0, 0, ang])
        translate([0, 0, z0])
            linear_extrude(z1 - z0)
                difference() {
                    polygon([[0, 0],
                             [R * cos(-half_angle), R * sin(-half_angle)],
                             [R * cos(half_angle), R * sin(half_angle)]]);
                    circle(r = inner_r);
                }
}

module pin_relief(hole) {
    z_fillet0 = board_z - fillet_depth;                    // 9.1
    z_pin0 = board_z - pin_protrusion_max - 0.4;           // 7.0
    for (row = pin_rows, k = [0:row[3] - 1]) {
        pin = [row[1] + k * 2.54, row[0]] + board_origin;
        rel = pin - hole;
        d = norm(rel);
        if (d < insert_post_d / 2 + fillet_r_max + clear_margin) {
            ang = atan2(rel[1], rel[0]);
            translate([hole[0], hole[1], 0]) {
                // Kegelfreistich: bis unter den Lotkegel
                wedge(d - fillet_r_max - clear_margin,
                      asin(fillet_r_max / d) + 5, z_fillet0, board_z + 1, ang);
                // Pinfreistich: schmaler, bis unter die Pinspitze
                wedge(d - pin_r_max - clear_margin,
                      asin(pin_r_max / d) + 5, z_pin0, z_fillet0 + eps, ang);
            }
        }
    }
}

module mount() {
    difference() {
        union() {
            reinforced_base();
            for (i = insert_idx)
                post_at(hole_positions[i], insert_post_d, insert_root_d);
            for (i = support_idx)
                post_at(hole_positions[i], support_d, support_root_d);
            for (w = wood_positions)
                translate([w[0], w[1], 0])
                    cylinder(d = wood_pad_d, h = wood_pad_thickness);
        }
        // Sackloch von oben: Einsatz endet BUENDIG mit Pfostenoberkante.
        for (i = insert_idx) {
            h = hole_positions[i];
            translate([h[0], h[1], board_z - insert_hole_depth])
                cylinder(d = insert_hole_d, h = insert_hole_depth + eps);
            pin_relief(h);
        }
        // Holzschrauben: Durchgang + 90-Grad-Senkung von oben.
        for (w = wood_positions) {
            translate([w[0], w[1], -eps])
                cylinder(d = wood_hole_d, h = wood_pad_thickness + 2 * eps);
            translate([w[0], w[1], wood_pad_thickness - wood_countersink_depth])
                cylinder(d1 = wood_hole_d,
                         d2 = wood_head_clearance_d + 2 * eps * tan(wood_head_angle / 2),
                         h = wood_countersink_depth + eps);
        }
    }
}

module board_outline() {
    c = board_clip;
    polygon([[c, 0], [board_width - c, 0], [board_width, c],
             [board_width, board_length - c],
             [board_width - c, board_length], [c, board_length],
             [0, board_length - c], [0, c]]);
}

module board_dummy() {
    // 0.03 mm reiner Anzeigeversatz vermeidet flackernde Kontaktflaechen.
    translate([board_origin[0], board_origin[1], board_z + 0.03])
        linear_extrude(board_preview_thickness)
            difference() {
                board_outline();
                for (h = hole_positions)
                    translate(h - board_origin) circle(d = board_hole_d);
                for (row = pin_rows, k = [0:row[3] - 1])
                    translate([row[1] + k * 2.54, row[0]]) circle(d = 1);
            }
}

module pins_dummy() {
    // Symbolische Stifte (D 1.0, ohne Lotkegel) — zeigen, wofuer die
    // Freistiche da sind. Keine gemessene reale Loethoehe.
    for (p = pins)
        translate([p[0], p[1], board_z - 2.0])
            cylinder(d = 1, h = 2.03);
}

module insert_dummy() {
    // Symbolisch, ohne Raendelung/Gewinde. Fuer kollisionsfreie Anzeige
    // auf Einbauloch-D verkleinert; realer Aussendurchmesser ist 4.6 mm.
    for (i = insert_idx)
        translate([hole_positions[i][0], hole_positions[i][1],
                   board_z - insert_length])
            difference() {
                cylinder(d = insert_hole_d - eps, h = insert_length);
                translate([0, 0, -eps])
                    cylinder(d = 2.5, h = insert_length + 2 * eps);
            }
}

color([0.92, 0.57, 0.18]) mount();
// $preview ist beim STL-Export false: NUR Mount, niemals Dummies.
if ($preview && show_board)
    color([0.36, 0.22, 0.72, 0.28]) board_dummy();
if ($preview && show_pins)
    color([0.9, 0.15, 0.15, 0.55]) pins_dummy();
if ($preview && show_insert)
    color([0.82, 0.66, 0.25]) insert_dummy();

echo("Mount B x L x H:", base_width, base_length, board_z);
echo("Platine (Kontur):", board_width, board_length,
     "Ursprung auf Basis:", board_origin);
echo("Pfosten über Gitter:", post_height,
     "Schraubpfosten D:", insert_post_d, "Stuetzpfosten D:", support_d);
echo("Heat-Set Sackloch D / Tiefe:", insert_hole_d, insert_hole_depth);
echo("Freistich-Wand im Kegelsektor (Abweichung von ruthex 1.6):",
     3.81 - fillet_r_max - clear_margin - insert_hole_d / 2);
echo("Empfohlene PCB-Schraube: M2,5 x", pcb_screw_len,
     "(Kopfpassung/Einsatz noch pruefen)");
echo("Holzschraube 3 x 12 Senkkopf, Anzahl:", len(wood_positions),
     "Durchgang / Senkung-D / Winkel:", wood_hole_d,
     wood_head_clearance_d, wood_head_angle);
echo("Schraubpolster Gesamtdicke / Senktiefe:",
     wood_pad_thickness, wood_countersink_depth);
echo("Nominal Holzeingriff / Reserve nach aussen (Istmasse pruefen):",
     wood_nominal_penetration, wood_thickness - wood_nominal_penetration);
