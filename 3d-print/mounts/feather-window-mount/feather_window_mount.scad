// ADA5691 window mount: front-right of box, USB toward right side wall.
// Actual Eagle contour/holes; source verification in docs/cad/feather-window/.
// Draft only: window, connector HEIGHTS and wood screw head require real checks.
/* [Window layout - draft, NOT milling dimensions] */
wood_contact_z = 12;        // top faces of tabs touch inner wood surface
board_z = 14;               // electronics-side PCB plane; +z points outside
wood_h = 12;
plexi_h = 3;                // adjustable placeholder, not selected/measured
/* [Carrier] */
base_h = 2;
cell = 4;
rib = 2;
wide_d = 8.2;
wide_top = 8;               // 6 mm below electronics-side PCB
neck_d = 4.6;
insert_d = 4;
insert_depth = 6.7;
insert_setback = 0.2;       // inserts enter from rear/underside of carrier
insert_l = 5.7;
screw_clear_d = 2.8;
/* [Wood tabs] */
tab_h = 3.5;
wood_d = 3.2;
head_d = 6.2;               // assumed 90-degree head; check actual screw
wood_screw_l = 12;
/* [Preview only - unmeasured heights/envelopes] */
board_t = 1.6;
display_h = 2.2;
pin_overhang = 3.4;
solder_r = 1.1;
show_board = true;
show_connections = false;
show_installation = false;
/* [Hidden] */
$fn=64;
eps=0.02;
pcb_w=50.8;
pcb_d=22.86;
pcb_r=2.54;
base_origin=[-5.6,-4.57];
base_size=[62,32];
threaded=[[2.54,2.54],[2.54,20.32]]; // actual plated D2.5 holes
supported=[[48.26,1.8415],[48.26,20.955]]; // actual D2.2: NO M2.5 screw!
holes=concat(threaded,supported);
wood_points=[[25.4,-17],[25.4,39.86]];
pins=concat([for(k=[0:15]) [6.35+k*2.54,1.27]],
            [for(k=[0:11]) [16.51+k*2.54,21.59]]);
// Preview aperture only. Relates to this carrier, NOT a fabrication template.
aperture=[-7,-9,64.8,40.86];
sink_h=(head_d-wood_d)/2;
assert(board_z > wide_top+pin_overhang+0.5);
assert(wide_top-(insert_setback+insert_depth)>=1);
assert((wide_d-4.6)/2>=1.6);
assert(tab_h-sink_h>=2);
assert(wood_h-(wood_screw_l-tab_h)>=3);
assert(wood_contact_z>=tab_h && board_z>wood_contact_z);
assert(wood_contact_z+wood_h-plexi_h > board_z+board_t+display_h+0.5,
       "Draft glass/display planes collide; adjust actual window stack");
for(h=threaded) for(p=pins)
    assert(norm(h-p)>neck_d/2+solder_r+0.4);
for(h=supported) for(p=pins)
    assert(norm(h-p)>1.6+solder_r+0.4);
module rounded_rect(w,d,r=2) {
    offset(r=r) translate([r,r]) square([w-2*r,d-2*r]);
}
module grid_frame() {
    linear_extrude(base_h) difference() {
        translate(base_origin) rounded_rect(base_size[0],base_size[1]);
        for(i=[0:9],j=[0:4])
            translate(base_origin+[rib+i*(cell+rib),rib+j*(cell+rib)])
                square([cell,cell]);
        // Large central access opening, NOT a closed tray.
        translate([7,4]) rounded_rect(36.8,14.86,1);
    }
}
module screw_post() {
    cylinder(d=10.4,h=base_h);
    translate([0,0,base_h]) cylinder(d1=10,d2=wide_d,h=1);
    cylinder(d=wide_d,h=wide_top);
    cylinder(d=neck_d,h=board_z);
}
module support_post() {
    cylinder(d=6.8,h=base_h);
    translate([0,0,base_h]) cylinder(d1=6.4,d2=3.2,h=2);
    cylinder(d=3.2,h=board_z); // flat support, no pin forced into D2.2 hole
}
module step_leg(y, direction) {
    translate([21.4,y,0]) cube([8,3,wood_contact_z]);
    // Local triangular gusset toward tab, not a surrounding wall.
    for(x=[21.4,28.2]) translate([x,y+(direction<0 ? 0 : 3),0])
        rotate([90,0,90]) linear_extrude(1.2)
            polygon([[0,0],[direction*4,0],[0,wood_contact_z-tab_h]]);
}
module wood_tab(y) {
    translate([17.4,y,wood_contact_z-tab_h])
        linear_extrude(tab_h) rounded_rect(16,21,2);
}
module strain_relief_pad() {
    // Cable-tie slots on rear plane. Route/wrap cable only after bend check.
    translate([5.8,24.43,0]) linear_extrude(base_h) rounded_rect(10,6,1);
}
module mount() {
    difference() {
        union() {
            grid_frame();
            for(h=threaded) translate(h) screw_post();
            for(h=supported) translate(h) support_post();
            step_leg(-6.57,-1);
            step_leg(26.43,1);
            wood_tab(-24);
            wood_tab(25.86);
            strain_relief_pad();
        }
        // Cut through the entire UNION, including overlapping grid ribs.
        for(x=[7.2,12.8]) translate([x,25.43,-eps]) cube([1.6,4,base_h+2*eps]);
        for(h=threaded) translate(h) {
            translate([0,0,-eps]) cylinder(d=insert_d,h=insert_setback+insert_depth+eps);
            translate([0,0,-eps]) cylinder(d=screw_clear_d,h=board_z+2*eps);
        }
        // Heads face the box interior (-z), NOT the wood contact surface.
        for(w=wood_points) translate(w) {
            translate([0,0,wood_contact_z-tab_h-eps])
                cylinder(d=wood_d,h=tab_h+2*eps);
            translate([0,0,wood_contact_z-tab_h-eps])
                cylinder(d1=head_d+2*eps,d2=wood_d,h=sink_h+eps);
        }
    }
}
module board() {
    translate([0,0,board_z+0.03]) linear_extrude(board_t) difference() {
        rounded_rect(pcb_w,pcb_d,pcb_r);
        for(i=[0:3]) translate(holes[i]) circle(d=i<2 ? 2.5 : 2.2);
        for(p=pins) translate(p) circle(d=1);
    }
}
module parts() {
    // Actual XY placement/footprint, but heights remain illustrative.
    color([0.12,0.15,0.20,0.75])
        translate([11.291,2.503,board_z+board_t+0.04]) cube([31,17.6,display_h]);
    color([0.15,0.48,0.65,0.85])
        translate([12.891,3.903,board_z+board_t+display_h+0.05]) cube([24.9,14.8,0.05]);
    color([0.7,0.75,0.8,0.65])
        translate([-1,7.03,board_z-3.2]) cube([8,8.8,3.15]); // USB symbol
    color([0.9,0.9,0.85,0.65])
        translate([7.3,14.5,board_z-6]) cube([7,6.5,5.95]); // JST symbol
    color([0.68,0.7,0.73,0.55])
        translate([29.854,5.73,board_z-3]) cube([15.4,11.4,2.95]);
    for(p=pins) color([0.7,0.7,0.72,0.4])
        translate([p[0],p[1],board_z-pin_overhang]) cylinder(r=0.55,h=pin_overhang);
    for(h=threaded) color([0.75,0.58,0.2]) translate(h)
        translate([0,0,insert_setback]) difference() {
            cylinder(d=4.6,h=insert_l);
            translate([0,0,-eps]) cylinder(d=2.5,h=insert_l+2*eps);
        }
}
module connection_envelopes() {
    // Transparent RED boxes are DRAFT reserved space, NOT actual connectors.
    color([0.95,0.12,0.1,0.22]) translate([-23,5.43,9.5]) cube([25,12,6]);
    color([0.95,0.12,0.1,0.22]) translate([5.8,10.8,5]) cube([10,20,8]);
}
module installation() {
    // Only a 2-mm-wide section of the illustrative wall/glass is shown.
    // No visual occlusion from the uncut wall behind the mount.
    color([0.72,0.55,0.34,0.8]) intersection() {
        translate([24.4,-34,wood_contact_z]) cube([2,91,wood_h]);
        difference() {
            translate([-18,-34,wood_contact_z]) cube([87,91,wood_h]);
            translate([aperture[0],aperture[1],wood_contact_z-eps])
                linear_extrude(wood_h+2*eps) rounded_rect(aperture[2],aperture[3],3);
            translate([aperture[0]-2.2,aperture[1]-2.2,wood_contact_z+wood_h-plexi_h])
                cube([aperture[2]+4.4,aperture[3]+4.4,plexi_h+eps]);
        }
    }
    // Illustrative rabbet only; actual glass fixing/edge support still open.
    color([0.4,0.8,0.95,0.6])
        translate([24.4,aperture[1]-2,wood_contact_z+wood_h-plexi_h+0.03])
            cube([2,aperture[3]+4,plexi_h-0.03]);
}
color([0.92,0.48,0.20]) mount();
if($preview && show_board) {color([0.22,0.48,0.36,0.28]) board(); parts();}
if($preview && show_connections) connection_envelopes();
if($preview && show_installation) installation();
echo("Carrier only STL; grid base",base_size,"PCB z",board_z,"wood contact z",wood_contact_z);
echo("PCB holes: two D2.5 screws; two D2.2 flat supports; inserts from REAR");
echo("Draft glass/display gap",wood_contact_z+wood_h-plexi_h-board_z-board_t-display_h);
echo("Wood screw nominal engagement",wood_screw_l-tab_h);
