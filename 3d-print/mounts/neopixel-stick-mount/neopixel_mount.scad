include <geometry.scad>
$fn=64;
eps=0.02;
show_board=true;
module grid(){
    linear_extrude(base_h) difference(){
        profile([-4.5,-3.5,59.8,18.16],1.4);
        for(i=[0:8],j=[0:1]) translate([-2.5+6*i,-1.5+6*j]) square([4,4]);
    }
}
module guides(){
    intersection(){
        difference(){
            union(){
                linear_extrude(wood_z+guide_h-lead_h) opening_profile(fit);
                hull(){
                    translate([0,0,wood_z+guide_h-lead_h-eps]) linear_extrude(eps) opening_profile(fit);
                    translate([0,0,wood_z+guide_h-eps]) linear_extrude(eps) opening_profile(fit+lead_in);
                }
            }
            translate([0,0,-eps]) linear_extrude(wood_z+guide_h+2*eps) opening_profile(fit+guide_wall);
        }
        for(x=[opening[0],opening[0]+opening[2]-4])
            for(y=[opening[1],opening[1]+opening[3]-4]) translate([x,y,0]) cube([4,4,wood_z+guide_h]);
    }
}
module screw_post(){
    cylinder(d=9,h=base_h);
    cylinder(d=post_d,h=post_top);
    translate([0,0,post_top]) cylinder(d1=post_d,d2=neck_d,h=2);
    cylinder(d=neck_d,h=board_z);
}
module support_post(){
    cylinder(d=6,h=base_h);
    cylinder(d=2.8,h=board_z);
}
module mount(){
    difference(){
        union(){
            grid(); guides();
            for(h=board_holes) translate(h) screw_post();
            for(x=[8,43]) translate([x,1.1,0]) support_post();
            for(w=wood_points){
                translate([w[0]-3,-4,0]) cube([6,3,wood_z]);
                translate([0,0,wood_z-tab_h]) profile_tab(w[0]);
            }
            // Cable-tie pad, cable exits LEFT then down/forward into interior.
            linear_extrude(base_h) profile([-12,-2.5,8.5,6],1);
        }
        for(h=board_holes) translate(h){
            translate([0,0,-eps]) cylinder(d=m2_clear,h=board_z+2*eps);
            // Open from back; seated nut ceiling z=2.2. No M2.5 insert forced in PCB.
            translate([0,0,-eps]) cylinder(d=nut_af/cos(30),h=nut_pocket_h+eps,$fn=6);
        }
        for(w=wood_points) translate([w[0],w[1],wood_z-tab_h-eps]){
            cylinder(d=wood_d,h=tab_h+2*eps);
            cylinder(d1=head_d+2*eps,d2=wood_d,h=(head_d-wood_d)/2+eps);
        }
        for(x=[-10.8,-6]) translate([x,-1.5,-eps]) cube([1.5,4,base_h+2*eps]);
    }
}
module profile_tab(x){linear_extrude(tab_h) profile([x-5.5,-23,11,20.5],1.5);}
module pcb(){
    translate([0,0,board_z]) linear_extrude(pcb_t) difference(){
        square([pcb_w,pcb_d]);
        for(h=board_holes) translate(h) circle(d=2.2);
    }
}
module leds(){for(p=led_xy) translate([p[0]-2.5,p[1]-2.5,board_z+pcb_t]) cube([5,5,led_h]);}
module caps(){for(p=cap_xy) translate([p[0]-1.65,p[1]-0.8,board_z+pcb_t]) cube([3.3,1.6,1.2]);}
module screw_heads(){for(h=board_holes) translate([h[0],h[1],board_z+pcb_t]) cylinder(d=pcb_head_d,h=head_h);}
module cables(){
    // Assumed direct-solder/heatshrink envelope, NOT a measured Dupont connector.
    translate([-1,0.2,6]) cube([5,9.76,board_z-6]);
    translate([-16,1,3]) cube([20,8,6]);
}
module cable_visual(){
    for(y=[2.54,5.08,7.62]) color(y<3?"red":y<6?"black":"dodgerblue"){
        translate([1.4,y,6]) cylinder(d=1.5,h=board_z-6);
        translate([-16,y,6]) rotate([0,90,0]) cylinder(d=1.5,h=17.4);
    }
}
module visible_pcb(){
    color([0.1,0.5,0.3,0.45]) translate([0,0,0.03]) pcb();
    color([1,1,0.75]) leds();
    color([0.55,0.35,0.12]) caps();
    color([0.75,0.78,0.82]) screw_heads();
    cable_visual();
}
color([0.96,0.46,0.13]) mount();
if($preview && show_board) visible_pcb();
echo("Adafruit basis only; DIN left; M2 not M2.5; nominal PCB bottom",board_z,"LED/glass gap",optical_gap);
