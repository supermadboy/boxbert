include <geometry.scad>
$fn=48; eps=0.02; show_board=true;
module grid(){
    linear_extrude(base_h) difference(){
        profile([-2.2,-2.2,47.1,44.8],1.8);
        // Clip cells to the inner area: continuous 2 mm perimeter, no teeth.
        intersection(){
            offset(delta=-2)profile([-2.2,-2.2,47.1,44.8],1.8);
            union()for(i=[0:7],j=[0:7])
                translate([0.2+6*i,0.2+6*j])square([4,4]);
        }
    }
}
module guides(){
    intersection(){
        difference(){
            union(){
                linear_extrude(wood_z+guide_h-lead_h) opening_profile(fit);
                hull(){
                    translate([0,0,wood_z+guide_h-lead_h-eps])linear_extrude(eps)opening_profile(fit);
                    translate([0,0,wood_z+guide_h-eps])linear_extrude(eps)opening_profile(fit+lead_in);
                }
            }
            translate([0,0,-eps])linear_extrude(wood_z+guide_h+2*eps)opening_profile(fit+guide_wall);
        }
        for(x=[opening[0],opening[0]+opening[2]-3.5])
            for(y=[opening[1],opening[1]+opening[3]-3.5])translate([x,y,0])cube([3.5,3.5,wood_z+guide_h]);
    }
}
module screw_post(){
    cylinder(d=9,h=base_h);
    cylinder(d=post_d,h=post_top);
    translate([0,0,post_top])cylinder(d1=post_d,d2=neck_d,h=2);
    cylinder(d=neck_d,h=board_z);
}
module mount(){
    difference(){
        union(){
            grid();guides();
            for(h=board_holes)translate(h)screw_post();
            for(p=support_xy)translate(p){cylinder(d=6,h=base_h);cylinder(d=2.8,h=board_z);}
            for(w=wood_points){
                if(w[0]<0){
                    // Straight brace now possible: the I2C exit is at the top.
                    translate([-2.2,w[1]-3,0])cube([2.4,6,wood_z]);
                    translate([w[0],w[1]-3,wood_z-tab_h])cube([10.2,6,tab_h]);
                } else {
                    translate([w[0]-3,39.6,0])cube([6,3,wood_z]);
                    translate([w[0]-3,39.6,wood_z-tab_h])cube([6,12,tab_h]);
                }
                translate([0,0,wood_z-tab_h])linear_extrude(tab_h)
                    if(w[0]<0)profile([w[0]-6,w[1]-5.5,12,11],1.5);
                    else profile([w[0]-5.5,w[1]-6,11,12],1.5);
            }
            // Inward cable-tie bridge, lower than wood; NOT a connector pocket.
            translate([11,40.6,0])cube([8,3,6]);
            translate([0,0,4])linear_extrude(2)profile([10,39.9,10,12.5],1);
        }
        for(h=board_holes)translate(h){
            translate([0,0,-eps])cylinder(d=pcb_screw_clear,h=board_z+2*eps);
            translate([0,0,-eps])cylinder(d=nut_af/cos(30),h=nut_pocket_h+eps,$fn=6);
        }
        for(w=wood_points)translate([w[0],w[1],wood_z-tab_h-eps]){
            cylinder(d=wood_d,h=tab_h+2*eps);
            cylinder(d1=head_d+2*eps,d2=wood_d,h=(head_d-wood_d)/2+eps);
        }
        for(x=[11,17.5])translate([x,44,4-eps])cube([1.5,6,2+2*eps]);
    }
}
module pcb(){
    translate([0,0,board_z])linear_extrude(pcb_t)difference(){
        square([pcb_w,pcb_d]);for(h=board_holes)translate(h)circle(d=pcb_hole_d);
    }
}
module electronics(){translate([components_rect[0],components_rect[1],board_z-components_h])cube([components_rect[2],components_rect[3],components_h]);}
module connector(){translate([connector_rect[0],connector_rect[1],board_z-connector_h])cube([connector_rect[2],connector_rect[3],connector_h]);}
module cables(){
    // Assumed I2C bundle exits inward then TOP (+y), below wood plane.
    // Kept left of the top-right mounting tab; exact bend radius unmeasured.
    hull(){translate([11,35.9,7.9])cube([10,4,2]);translate([11,48.4,7.9])cube([10,2,2]);}
    translate([11,48.4,7.9])cube([10,7,2]);
}
module screw_heads(){for(h=board_holes)translate([h[0],h[1],board_z+pcb_t])cylinder(d=pcb_head_d,h=head_h);}
module antenna_visual(){
    // Stylised only, NOT the real RF copper map. Do not use as PCB fabrication data.
    for(inset=[1.2,2.5,3.8])translate([inset,inset,board_z+pcb_t+0.02])linear_extrude(0.04)
        difference(){square([pcb_w-2*inset,pcb_d-2*inset]);translate([0.3,0.3])square([pcb_w-2*inset-0.6,pcb_d-2*inset-0.6]);}
}
module visible_pcb(){
    color([0.7,0.08,0.1,0.48])pcb();
    color([0.18,0.19,0.22])electronics();
    color([0.08,0.09,0.12])connector();
    color([0.2,0.65,0.95])cables();
    color([0.8,0.6,0.2])antenna_visual();
    color([0.75,0.78,0.8])screw_heads();
}
color([0.96,0.46,0.13])mount();
if($preview && show_board)visible_pcb();
