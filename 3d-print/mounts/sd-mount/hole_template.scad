// Boxbert HW-125: Lochraster-Pruefschablone, 2026-10-09.
// 38 x 20 mm aus Botland, Nutzer akzeptiert als Entwurfsgrundlage.
// KEIN bestaetigtes Lochbild der realen Platine, kein fertiger Mount.
// Platine real laut Nutzer 23.68 x 41.78; M2.5 passt laut Nutzer.
$fn=80;
hole_pitch_x=20;
hole_pitch_y=38;
hole_d=2.7; // Entwurfs-Spiel fuer M2.5, Druckpassung pruefen
thickness=2;
assert(hole_pitch_x==20 && hole_pitch_y==38);
difference() {
    cube([30,48,thickness]);
    translate([9,9,-0.02]) cube([12,30,thickness+0.04]);
    for(x=[5,25], y=[5,43])
        translate([x,y,-0.02]) cylinder(d=hole_d,h=thickness+0.04);
}
echo("Pruefschablone: 30 x 48 x 2 mm, Lochraster 20 x 38, D2.7");
