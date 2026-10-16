// Actual CGAL intersections against explicitly assumed hardware envelopes.
include <sd_mount.scad>
scene="none";
fit_case="pcb";
module obstacle() {
    if(fit_case=="pcb") translate([0,0,0.001]) pcb();
    if(fit_case=="underside") underside_envelope();
    if(fit_case=="pins") solder_envelopes();
    if(fit_case=="pins-control") translate([-2,0,0]) solder_envelopes();
    if(fit_case=="connector") connector_envelope();
    if(fit_case=="connector-control") translate([0,0,-12]) connector_envelope();
    if(fit_case=="card") card_sweep();
    if(fit_case=="card-control") translate([0,0,-14]) card_sweep();
    if(fit_case=="wood") translate([-2,-2,-12]) cube([W+4,D+4,11.999]);
}
if(fit_case=="heads" || fit_case=="heads-tolerance" || fit_case=="heads-control") {
    intersection() {
        screws(head_d=fit_case=="heads-control" ? 6 : (fit_case=="heads-tolerance" ? 4.2 : 4));
        components(margin=fit_case=="heads-tolerance" ? 0.1 : 0);
    }
} else {
    intersection() { mount(); obstacle(); }
}
