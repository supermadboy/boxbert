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
  linear_extrude(guide_tip_z)difference(){opening_profile(fit);opening_profile(fit+guide_wall);}
  for(x=[opening[0],opening[0]+opening[2]-3.5])for(y=[opening[1],opening[1]+opening[3]-3.5])
   translate([x,y,0])cube([3.5,3.5,guide_tip_z]);
 }
}
// Clearance slots through rear grid for the INWARD connector envelopes.
module rear_clearance(){
 for(r=[connector_rect,unused_rect])translate([r[0]-0.5,r[1]-0.5,-eps])cube([r[2]+1,r[3]+1,board_z+eps]);
}
module wood_tabs(){
 // Left upper arm; both wood contact surfaces are at stop_z.
 translate([-2.2,29.675,0])cube([2,6,stop_z]);
 translate([-10,29.675,stop_z-tab_h])cube([9.9,6,tab_h]);
 // Bottom arm points DOWN in photo XY; never relocated to the right edge.
 translate([bottom_tab_x-3,-2.2,0])cube([6,2.1,stop_z]);
 translate([bottom_tab_x-3,-10,stop_z-tab_h])cube([6,9.9,tab_h]);
 for(w=wood_points)translate([0,0,stop_z-tab_h])linear_extrude(tab_h)profile([w[0]-6,w[1]-5.5,12,11],1.5);
}
module mount(){
 difference(){
  union(){
   grid();guides();
   for(h=board_holes)translate(h)cylinder(d=post_d,h=board_z);
   for(p=support_xy)translate(p){cylinder(d=6,h=base_h);cylinder(d=2.8,h=board_z);}
   wood_tabs();
   translate([-12,16,0])cube([11.9,8,2]);
  }
  for(h=board_holes)translate([h[0],h[1],board_z-insert_depth])cylinder(d=insert_d,h=insert_depth+eps);
  rear_clearance();
  for(w=wood_points)translate([w[0],w[1],stop_z-tab_h-eps]){
   cylinder(d=wood_d,h=tab_h+2*eps);
   cylinder(d1=head_d+2*eps,d2=wood_d,h=(head_d-wood_d)/2+2*eps);
  }
  for(y=[17,21.5])translate([-10,y,-eps])cube([6,1.5,2+2*eps]);
 }
}
module pcb(){translate([0,0,board_z])linear_extrude(pcb_t)difference(){square([pcb_w,pcb_d]);for(h=board_holes)translate(h)circle(d=pcb_hole_d);}}
module electronics(){translate([components_rect[0],components_rect[1],board_z+pcb_t])cube([components_rect[2],components_rect[3],components_h]);}
module connector(){translate([connector_rect[0],connector_rect[1],board_z-connector_h])cube([connector_rect[2],connector_rect[3],connector_h]);}
module unused_pins(){translate([unused_rect[0],unused_rect[1],board_z-unused_h])cube([unused_rect[2],unused_rect[3],unused_h]);}
module solder_front(){translate([0,0,board_z+pcb_t])linear_extrude(1.5){
 for(i=[0:3])translate([2.5,16.39+2.54*i])circle(d=1.3);
 for(i=[0:7])translate([13.11+2.54*i,37.9])circle(d=1.3);
}}
module cables(){translate([-16,14.2,-8])cube([20.5,12,2]);}
module screw_heads(extra=0){for(h=board_holes)translate([h[0],h[1],board_z+pcb_t])cylinder(d=pcb_head_d+2*extra,h=head_h);}
module inserts(){for(h=board_holes)translate([h[0],h[1],board_z-insert_l])cylinder(d=insert_max_d,h=insert_l);}
module visible_pcb(){
 color([0.75,0.08,0.1,0.5])pcb();
 color([0.15,0.17,0.2])electronics();color([0.08,0.09,0.12]){connector();unused_pins();}
 color([0.85,0.65,0.2]){
  for(i=[0:3])translate([2.5,16.39+2.54*i,board_z-connector_h])cylinder(d=0.7,h=connector_h);
  for(i=[0:7])translate([13.11+2.54*i,37.9,board_z-unused_h])cylinder(d=0.7,h=unused_h);
  solder_front();inserts();
 }
 color([0.2,0.65,0.95,0.5])cables();
 color([0.8,0.8,0.83])screw_heads();
}
color([0.4,0.25,0.8])mount();
if($preview && show_board)visible_pcb();
