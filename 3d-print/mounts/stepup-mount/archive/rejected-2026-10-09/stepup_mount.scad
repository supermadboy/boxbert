// ============================================================
// Boxbert Mount — TPS61023 MiniBoost (Adafruit 4654) — v3
// Stand: 09.10.2026 — BEISPIEL-Mount, noch nicht gedruckt/getestet
//
// Konzept (Daddelbert): KEINE Waende. Flache Gitterplatte (4 mm),
// daraus ragt ein Post (+ 2 gleichhohe Stuetzstege in L-Form).
// In den Post wird der ruthex RX-M2.5x5.7 eingelötet; die Platine
// wird auf den Post-Kopf geschraubt und "schwebt" 7 mm ueber Holz.
// Grund fuer die Stuetzstege: die Platine hat nur EIN Loch —
// nur der Post allein wuerde kippeln.
//
// Quellen (nicht geraten):
//   Platine 17.8 x 11.3 mm, Hoehe 5.6 mm -> adafruit.com/product/4654
//   Bohrbild: github.com/adafruit/Adafruit-TPS61023-PCB (.brd)
//     - EIN Montageloch Ø2.5 (M2.5), je 2.54 mm von Lang-/Schmalkante,
//       Ecke diagonal zum 4-Pin-Header JP1 (0.1"-Raster, Reihe
//       2.54 mm ab Gegenseite)
//     - alle SMD-Bauteile Oberseite (kein 'M'-rot im .brd)
//   ruthex RX-M2.5x5.7, offizielles STEP: Koerper Ø4.06,
//   Kragen Ø4.6, L 5.7 -> Pocket Ø4.2 / Tiefe 5.8
//
// Schrauben:
//   Platine: M2.5 x 7 (M2.5x8 staende am Pocket-Boden an)
//   Mount->Holz: 1x M4 Zylinderkopf, K-B Ø7.5, in Einschlagmutter M4
//   ⚠ 1 Holzschraube = Mount kann theoretisch rotieren. Praktisch
//   halten Nachbar-Mounts + Flachbandkabel; sonst 2. Loch ergänzen.
//
// Header-Freiraum: Pin-Spitzen enden bei z ~4.5, Loetpunkte ~5.5 —
// beide ueber der Platte (4.0). Der rechte Stuetzsteg beginnt erst
// unterhalb des letzten Pins (Loetpunkt-Freiraum am letzten Pin).
//
// VOR DEM DRUCK: Pocket-Ø 4.2 an ECHTEM Einsatz testen (Probewürfel),
// Platine auf Post/Stege legen, Lochposition gegenprüfen (Klon-Gefahr).
// ============================================================

/* [Platine — Adafruit 4654] */
board_l = 11.43;
board_w = 17.78;
hole_from_x = 2.54;      // Loch ab linker Kante
hole_from_y_top = 2.54;  // Loch ab oberer Kante
header_from_y = 2.54;    // Header-Reihe ab unterer Kante

/* [ruthex RX-M2.5x5.7] */
pocket_d = 4.2;          // STEP-Koerper Ø4.06 + Spiel -> PROBEDRUCK
pocket_l = 5.8;          // STEP-Laenge 5.7 + 0.1

/* [Mount] */
plate_t  = 4.0;          // Gitterplatte
post_top = 7.0;          // Oberkante Post + Stuetzstege
post_d   = 9.0;
sup_w    = 2.0;          // Stuetzstegbreite
rib_w    = 2.5;          // Gitterrippen
margin_l = 4.0;          // links (Post-Seite)
margin_r = 7.0;          // rechts
margin_b = 7.0;          // unten (Platz Holzschraube)
margin_t = 5.5;          // oben
wood_d   = 4.3;          // M4-Durchgang
wood_cb_d = 7.5;         // Kopf-K-B M4 Zylinderkopf
wood_cb_t = 2.8;
corner_r = 2.0;
$fn = 48;

// --- abgeleitet ---
outer_l = margin_l + board_l + margin_r;   // 22.43
outer_w = margin_b + board_w + margin_t;   // 30.28
bx = margin_l; by = margin_b;              // Platinenursprung (4, 7)
boss_x = bx + hole_from_x;                 // 6.54
boss_y = by + board_w - hole_from_y_top;   // 22.24
header_y = by + header_from_y;             // 9.54
header_xs = [for (i=[0:3]) bx + 5.715 + (i-1.5)*2.54];
screw_pos = [17.2, 5.0];                   // M4 -> Einschlagmutter Holz
edge = 0.4;                                // Mindeststeg zwischen Aussparungen

// ================= 2D-Grundkoerper =================
module outline() {
    offset(r = corner_r) offset(delta = -corner_r)
        square([outer_l, outer_w]);
}

// Platte (z 0..plate_t)
module plate2d() {
    union() {
        difference() { outline(); offset(r = -rib_w) outline(); }  // Ring
        translate([rib_w/2, by - rib_w/2])                         // Rippe unten (bordnetze)
            square([outer_l - rib_w, rib_w]);
        translate([bx - rib_w/2, rib_w/2])                         // Rippe links (2.25 breit)
            square([rib_w - 0.25, outer_w - rib_w]);
        translate([screw_pos[0], screw_pos[1]]) circle(d = 9);     // Pad Holzschraube
    }
}

// Erhabene Teile (z 0..post_top)
module raised2d() {
    union() {
        translate([boss_x, boss_y]) circle(d = post_d);            // Post
        // Stuetzsteg unter Platinen-Oberkante (bis zum rechten Steg)
        translate([bx - 1.25, by + board_w - 1.28])
            square([(bx + board_l - 1.0) - (bx - 1.25), sup_w]);
        // Stuetzsteg rechts, abstandshalber zum letzten Header-Pin
        translate([bx + board_l - 1.0, header_y + 2.0])
            square([sup_w, (by + board_w - 1.28 + sup_w) - (header_y + 2.0)]);
    }
}

// Aussparungen in der Platte (Gitter)
module cuts2d() {
    union() {
        // grosse Mitte (Header-Pins haengen hier frei in der Luft)
        translate([bx + 1.4, by + 2.2])   // y ab 9.2: K-B der Holzschraube (bis 8.75) frei lassen
            square([(bx + board_l - 1.3) - (bx + 1.4),
                    (boss_y - post_d/2 - edge) - (by + 1.7)]);
        // rechts neben dem Post (bis vor den rechten Stuetzsteg)
        translate([boss_x + post_d/2 + 0.3, boss_y - post_d/2 + 0.3])
            square([(bx + board_l - 1.3) - (boss_x + post_d/2 + 0.3),
                    (by + board_w - 1.28 - edge) - (boss_y - post_d/2 + 0.3)]);
        // rechts zwischen Stuetzsteg und Aussenring
        translate([bx + board_l - 1.0 + sup_w + edge, header_y + 2.0])
            square([(outer_l - rib_w - edge) - (bx + board_l - 1.0 + sup_w + edge),
                    (outer_w - rib_w - edge) - (header_y + 2.0)]);
        // Streifen oberhalb des oberen Stuetzstegs (erst RECHTS vom Post!)
        translate([boss_x + post_d/2 + edge, by + board_w - 1.28 + sup_w + edge])
            square([(bx + board_l - 1.0 + sup_w + edge) - (boss_x + post_d/2 + edge),
                    (outer_w - rib_w - edge) - (by + board_w - 1.28 + sup_w + edge)]);
        // Streifen unterhalb der unteren Rippe (links vom Schrauben-Pad)
        translate([bx + 1.4, rib_w + edge])
            square([12.4 - (bx + 1.4), (by - rib_w/2 - edge) - (rib_w + edge)]);
    }
}

// ================= 3D =================
module holes() {
    // Pocket im Post (von oben)
    translate([boss_x, boss_y, post_top - pocket_l])
        cylinder(d = pocket_d, h = pocket_l + 0.1);
    // Holzschraube: Durchgang + Kopf-K-B von oben
    translate([screw_pos[0], screw_pos[1], 0]) {
        translate([0, 0, -0.1]) cylinder(d = wood_d, h = plate_t + 0.2);
        translate([0, 0, plate_t - wood_cb_t])
            cylinder(d = wood_cb_d, h = wood_cb_t + 0.05);
    }
}

module mount() {
    difference() {
        union() {
            linear_extrude(plate_t) plate2d();
            linear_extrude(post_top) raised2d();   // Post/Steg durchgehend ab z0
        }
        translate([0, 0, -0.1]) linear_extrude(plate_t + 0.2) cuts2d();
        holes();
    }
}

mount();

echo("Aussen:", outer_l, "x", outer_w, " Post-Top:", post_top);
echo("Boss:", boss_x, boss_y, " Header-Y:", header_y);
echo("Header-Pins X:", header_xs, " Schraube:", screw_pos);
