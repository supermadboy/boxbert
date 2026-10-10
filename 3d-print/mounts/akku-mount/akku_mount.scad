// Boxbert LiPo holder CONCEPT, not a fit/safety approval. Dimensions in mm.
// Battery envelope from docs/kernwerte.md; cable/PCM geometry NOT measured.
$fn=64;
part="assembly"; // base | bridge | assembly
show_battery=true;
base_x=100; base_y=76; floor_h=2;
battery_l=81.1; battery_w=49.8; battery_h=5.7;
liner_h=0.5; // Proposed separate smooth insulating sheet, not printed/exported.
bridge_z=10.5; bridge_h=3;
post_d=9; pocket_d=4; pocket_depth=6.7;
post_y=[6,70];
assert(bridge_z-(floor_h+liner_h+battery_h)>=2);
assert((post_d-4.6)/2>=1.6);
assert(bridge_z-pocket_depth>=floor_h);
module rounded_box(l,w,h,r=1){
 linear_extrude(h) hull() for(x=[r,l-r],y=[r,w-r])
 translate([x,y]) circle(r=r);
}
module base(){
 difference(){
  union(){
   // Real regular 4 mm cells / 2 mm ribs, bounded by perimeter.
   difference(){
    rounded_box(base_x,base_y,floor_h);
    for(x=[2:6:92],y=[2:6:68]) translate([x,y,-0.1]) cube([4,4,floor_h+0.2]);
   }
   for(y=post_y) translate([50,y,0]) cylinder(d=post_d,h=bridge_z);
   // Local pads around wood screws, outside battery envelope.
   for(x=[4.5,95.5]) translate([x,38,0]) cylinder(d=8.4,h=3.5);
   // Rounded stops: short, not clamping the pouch. Inner space 83 x 52.
   for(y=[18,48]) translate([6.5,y,0]) rounded_box(2,10,5.5,0.8);
   for(y=[18,48]) translate([91.5,y,0]) rounded_box(2,10,5.5,0.8);
   for(x=[18,72]) translate([x,10,0]) rounded_box(10,2,5.5,0.8);
   for(x=[18,72]) translate([x,64,0]) rounded_box(10,2,5.5,0.8);
  }
  for(y=post_y) translate([50,y,bridge_z-pocket_depth])
   cylinder(d=pocket_d,h=pocket_depth+0.1);
  for(x=[4.5,95.5]) translate([x,38,0]){
   translate([0,0,-0.1]) cylinder(d=3.2,h=3.7);
   translate([0,0,2]) cylinder(d1=3.2,d2=6.2,h=1.5);
  }
 }
}
module bridge(){
 // Print flat, smooth lower face toward battery in assembly.
 difference(){
  rounded_box(16,74,bridge_h,2);
  for(y=[5,69]) translate([8,y,-0.1]) cylinder(d=2.8,h=bridge_h+0.2);
 }
}
module assembly(){
 color("Teal") base();
 color("Orange") translate([42,1,bridge_z]) bridge();
 if($preview && show_battery){
  // Simple transparent envelope only: NOT a detailed pouch/PCM/cable model.
  color([0.65,0.75,0.85,0.35]) translate([(base_x-battery_l)/2,(base_y-battery_w)/2,floor_h+liner_h+0.03])
   rounded_box(battery_l,battery_w,battery_h,1);
  color([0.85,0.85,0.85,0.55]) translate([9,12.5,floor_h+0.01]) cube([82,51,liner_h]);
 }
}
if(part=="base") base();
else if(part=="bridge") bridge();
else if($preview) assembly();
else assert(false,"Export base and bridge separately; assembly is preview only.");
