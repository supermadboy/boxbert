// Boxbert — TPS61023 Einzel-Mount, NEUENTWURF 2026-10-09
// Nutzer-OK: regelmaessiges Gitter, ein Schraubpfosten am Montageloch,
// zwei einzelne Stuetzpfosten mittig; keine Waende oder L-Auflage.
// Entwurf / Passungspruefung offen, KEINE Einbau- oder Druckfreigabe.
// Quellen und offene Annahmen: README.md.

/* [Gitterboden] */
cell_size = 4;               // quadratische, vollstaendig offene Zellen
rib_width = 2;               // ALLE regulaeren Rippen gleich breit
cells_x = 4;
cells_y = 5;
base_thickness = 2;

/* [Abstandspfosten] */
post_height = 8;             // UEBER der Oberseite des Gitterbodens
insert_post_d = 8.2;         // 1.8 mm radial ausserhalb Einsatz-max. D 4.6
insert_root_d = 10;
support_d = 2.8;
support_root_d = 4.4;
root_height = 1;             // kurze lokale Fussverbreiterung, keine Wand
insert_hole_d = 4.0;         // offizielles ruthex EINBAULOCH, Passung testen
insert_hole_depth = 6.7;     // Hersteller: Einsatzlaenge 5.7 + min. 1 mm

/* [Holzbefestigung — Nutzerentscheidung 2026-10-09] */
// Holzschraube 3 x 12 mm, Senkkopf; KEIN metrisches M3-Gewinde.
wood_hole_d = 3.2;           // Durchgang fuer nominal 3-mm-Holzschraube
wood_pad_d = 8;
wood_pad_thickness = 3.5;    // lokale GESAMTdicke ab Holzoberseite
wood_head_clearance_d = 6.2; // fuer Kopf ca. D6; konkretes Fabrikat pruefen
wood_head_angle = 90;       // Entwurfsannahme, am realen Kopf pruefen
wood_screw_length = 12;     // bei Senkkopf INKLUSIVE Kopf
wood_thickness = 12;        // beschlossen: Pappelsperrholz, Istmass pruefen
wood_position = [22, 4];

/* [Platine — Original-PCB, reale Passung offen] */
board_width = 11.43;
board_length = 17.78;
board_origin = [6, 8];
board_mount_hole = [2.54, 15.24];
board_mount_hole_d = 2.5;
// Nur massive Auflagen, KEINE weiteren Gewindeeinsaetze.
// Mittig und fern der Anschlussreihe (y=2.54 in Platinenkoordinaten).
support_positions = [[board_width/2, 6.5], [board_width/2, 10]];

/* [Vorschau — nicht im STL] */
show_board = true;
show_insert = true;
board_preview_thickness = 1.6; // ANNAHME zur Darstellung, nicht gemessen

/* [Hidden] */
$fn = 80;
eps = 0.02;
pitch = cell_size + rib_width;
base_width = cells_x * cell_size + (cells_x + 1) * rib_width;
base_length = cells_y * cell_size + (cells_y + 1) * rib_width;
board_z = base_thickness + post_height;
insert_position = board_origin + board_mount_hole;
insert_max_d = 4.6;          // ruthex Masszeichnung: d1
insert_length = 5.7;
wood_countersink_depth = (wood_head_clearance_d-wood_hole_d)/
                         (2*tan(wood_head_angle/2));
wood_nominal_penetration = wood_screw_length-wood_pad_thickness;

assert(cell_size > 0 && rib_width >= 1.6 && base_thickness >= 1.6);
assert(cells_x >= 1 && cells_y >= 1);
assert(insert_hole_depth >= insert_length + 1);
assert(insert_hole_d < insert_max_d);
assert((insert_post_d - insert_max_d)/2 >= 1.6,
       "Zu wenig Material um den eingesetzten Heat-Set-Einsatz");
assert(post_height - insert_hole_depth >= 1,
       "Mindestens 1 mm geschlossener Pfostenboden ueber dem Gitter");
assert(root_height > 0 && root_height < post_height);
assert(wood_hole_d > 0 && wood_pad_d - wood_hole_d >= 3.2);
assert(wood_head_angle > 0 && wood_head_angle < 180);
assert(wood_head_clearance_d > wood_hole_d &&
       wood_pad_d > wood_head_clearance_d);
assert(wood_pad_thickness >= base_thickness);
assert(wood_pad_thickness-wood_countersink_depth >= base_thickness,
       "Mindestens Gitterbodendicke unter der Senkung erhalten");
assert(wood_nominal_penetration > 0 &&
       wood_thickness-wood_nominal_penetration >= 3,
       "Mindestens 3 mm nominale Holzreserve; Istmasse trotzdem pruefen");
assert(wood_position[0] - wood_pad_d/2 >= 0 &&
       wood_position[0] + wood_pad_d/2 <= base_width &&
       wood_position[1] - wood_pad_d/2 >= 0 &&
       wood_position[1] + wood_pad_d/2 <= base_length);
for (p = support_positions) {
    assert(p[0] - support_d/2 > 0 &&
           p[0] + support_d/2 < board_width &&
           p[1] - support_d/2 > 4 &&
           p[1] + support_d/2 < board_length);
    assert(norm(p-board_mount_hole) > (insert_post_d+support_d)/2+0.3,
           "Stuetzpfosten muss vom Schraubpfosten getrennt bleiben");
}
assert(norm(support_positions[0]-support_positions[1]) > support_d+0.3,
       "Stuetzpfosten muessen einzeln bleiben");

module grid_2d() {
    difference() {
        offset(r=0.8) offset(delta=-0.8)
            square([base_width, base_length]);
        for (ix = [0:cells_x-1], iy = [0:cells_y-1])
            translate([rib_width + ix*pitch, rib_width + iy*pitch])
                square([cell_size, cell_size]);
    }
}

module reinforced_base() {
    linear_extrude(base_thickness)
        union() {
            grid_2d();
            // Pad 0.2 mm radial breiter als Fuss: keine fast identischen
            // Kreis-/Kegelkanten bei Booleschen Operationen/Float-Export.
            translate(insert_position) circle(d=insert_root_d+0.4);
            for (p = support_positions)
                translate(board_origin + p) circle(d=support_root_d+0.4);
            translate(wood_position) circle(d=wood_pad_d);
        }
}

module post_at(p, d, root_d) {
    translate([p[0], p[1], 0]) {
        // Kern durchgehend ab Druckbett; kein nahezu deckungsgleicher
        // Z-Overlap am Fuss, der beim STL-Float-Export Nullflaechen erzeugt.
        cylinder(d=d, h=board_z);
        translate([0, 0, base_thickness])
            cylinder(d1=root_d, d2=d, h=root_height);
    }
}

module mount() {
    difference() {
        union() {
            reinforced_base();
            // Nur dieses kleine Polster ragt 1.5 mm ueber das Gitter.
            translate([wood_position[0], wood_position[1], 0])
                cylinder(d=wood_pad_d, h=wood_pad_thickness);
            post_at(insert_position, insert_post_d, insert_root_d);
            for (p = support_positions)
                post_at(board_origin + p, support_d, support_root_d);
        }
        // Sackloch von oben: Einsatz endet BUENDIG mit Pfostenoberkante.
        translate([insert_position[0], insert_position[1],
                   board_z-insert_hole_depth])
            cylinder(d=insert_hole_d, h=insert_hole_depth+eps);
        // Genau EIN Holzbefestigungsloch + 90-Grad-Senkung von oben.
        translate([wood_position[0], wood_position[1], -eps])
            cylinder(d=wood_hole_d, h=wood_pad_thickness+2*eps);
        translate([wood_position[0], wood_position[1],
                   wood_pad_thickness-wood_countersink_depth])
            cylinder(d1=wood_hole_d,
                     d2=wood_head_clearance_d+2*eps*tan(wood_head_angle/2),
                     h=wood_countersink_depth+eps);
    }
}

module board_outline() {
    // Original-PCB: untere Ecken rechtwinklig, obere Radius 2.54.
    r = 2.54;
    union() {
        square([board_width, board_length-r]);
        translate([r, board_length-r]) square([board_width-2*r, r]);
        for (x = [r, board_width-r])
            translate([x, board_length-r]) circle(r=r);
    }
}

module board_dummy() {
    // 0.03 mm reiner Anzeigeversatz vermeidet flackernde Kontaktflaechen.
    translate([board_origin[0], board_origin[1], board_z+0.03])
        linear_extrude(board_preview_thickness)
            difference() {
                board_outline();
                translate(board_mount_hole) circle(d=board_mount_hole_d);
                for (x = [1.905, 4.445, 6.985, 9.525])
                    translate([x, 2.54]) circle(d=1);
            }
}

module insert_dummy() {
    // Symbolisch, ohne Raendelung/Gewinde. Fuer kollisionsfreie Anzeige
    // auf Einbauloch-D verkleinert; realer Aussendurchmesser ist 4.6 mm.
    translate([insert_position[0], insert_position[1], board_z-insert_length])
        difference() {
            cylinder(d=insert_hole_d-eps, h=insert_length);
            translate([0, 0, -eps])
                cylinder(d=2.5, h=insert_length+2*eps);
        }
}

color([0.92, 0.57, 0.18]) mount();
// $preview ist beim STL-Export false: NUR Mount, niemals Dummies.
if ($preview && show_board)
    color([0.36, 0.22, 0.72, 0.28]) board_dummy();
if ($preview && show_insert)
    color([0.82, 0.66, 0.25]) insert_dummy();

echo("Mount B x L x H:", base_width, base_length, board_z);
echo("Abstand Platinenunterseite / Gitteroberseite:", post_height);
echo("Heat-Set Sackloch D / Tiefe:", insert_hole_d, insert_hole_depth);
echo("Holzschraube 3 x 12 Senkkopf: Durchgang / Senkung-D / Winkel:",
     wood_hole_d, wood_head_clearance_d, wood_head_angle);
echo("Schraubpolster Gesamtdicke / Senktiefe:",
     wood_pad_thickness, wood_countersink_depth);
echo("Nominal Holzeingriff / Reserve nach aussen (Istmasse pruefen):",
     wood_nominal_penetration, wood_thickness-wood_nominal_penetration);
