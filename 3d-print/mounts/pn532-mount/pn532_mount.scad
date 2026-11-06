include <geometry.scad>
$fn=48; eps=0.02; show_board=true;
module grid(){
 linear_extrude(base_h)difference(){
  profile([-2.2,-2.2,47.1,44.8],1.8);
  intersection(){offset(delta=-2)profile([-2.2,-2.2,47.1,44.8],1.8);
   union()for(i=[0:7],j=[0:7])translate([0.2+6*i,0.2+6*j])square([4,4]);}
 }
}
module guides(){
 intersection(){
  linear_extrude(stop_z)difference(){opening_profile(fit);opening_profile(fit+guide_wall);}
  for(x=[opening[0],opening[0]+opening[2]-3.5])for(y=[opening[1],opening[1]+opening[3]-3.5])
   translate([x,y,0])cube([3.5,3.5,stop_z]);
 }
}
module mount(){
 difference(){
  union(){
   grid();guides();
   for(h=board_holes)translate(h)cylinder(d=post_d,h=board_z);
   for(p=support_xy)translate(p){cylinder(d=6,h=base_h);cylinder(d=2.8,h=board_z);}
   for(w=wood_points){
    // No arm enters the PCB projection above its support plane.
    translate([-2.2,w[1]-3,0])cube([2,6,stop_z+tab_h]);
    translate([w[0],w[1]-3,stop_z])cube([9.8,6,tab_h]);
    translate([0,0,stop_z])linear_extrude(tab_h)profile([w[0]-6,w[1]-5.5,12,11],1.5);
   }
   translate([-2.2,17,0])cube([2,6,14]);
   translate([-12,16,12])cube([11.8,8,2]);
  }
  for(h=board_holes)translate([h[0],h[1],board_z-insert_depth])cylinder(d=insert_d,h=insert_depth+eps);
  for(w=wood_points)translate([w[0],w[1],stop_z-eps]){
   cylinder(d=wood_d,h=tab_h+2*eps);
   translate([0,0,tab_h-(head_d-wood_d)/2])cylinder(d1=wood_d,d2=head_d+2*eps,h=(head_d-wood_d)/2+2*eps);
  }
  for(y=[17,21.5])translate([-10,y,12-eps])cube([6,1.5,2+2*eps]);
 }
}
module pcb(){translate([0,0,board_z])linear_extrude(pcb_t)difference(){square([pcb_w,pcb_d]);for(h=board_holes)translate(h)circle(d=pcb_hole_d);}}
module electronics(){translate([components_rect[0],components_rect[1],board_z+pcb_t])cube([components_rect[2],components_rect[3],components_h]);}
module connector(){translate([connector_rect[0],connector_rect[1],board_z+pcb_t])cube([connector_rect[2],connector_rect[3],connector_h]);}
module unused_pins(){translate([unused_rect[0],unused_rect[1],board_z+pcb_t])cube([unused_rect[2],unused_rect[3],unused_h]);}
module cables(){translate([-16,14.2,27.5])cube([20.5,12,2]);}
module screw_heads(extra=0){for(h=board_holes)translate([h[0],h[1],board_z+pcb_t])cylinder(d=pcb_head_d+2*extra,h=head_h);}
module inserts(){for(h=board_holes)translate([h[0],h[1],board_z-insert_l])cylinder(d=insert_max_d,h=insert_l);}
module visible_pcb(){
 color([0.75,0.08,0.1,0.5])pcb();
 color([0.15,0.17,0.2])electronics();color([0.08,0.09,0.12]){connector();unused_pins();}
 color([0.85,0.65,0.2]){
  for(i=[0:3])translate([2.5,16.39+2.54*i,board_z+pcb_t])cylinder(d=0.7,h=17);
  for(i=[0:7])translate([13.11+2.54*i,37.9,board_z+pcb_t])cylinder(d=0.7,h=9);
  inserts();
 }
 color([0.2,0.65,0.95,0.5])cables();
 color([0.8,0.8,0.83])screw_heads();
}
color([0.4,0.25,0.8])mount();
if($preview && show_board)visible_pcb();
