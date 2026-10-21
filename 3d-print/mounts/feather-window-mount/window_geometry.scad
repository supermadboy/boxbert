// CURRENT: machine ONLY from outside: through-opening + glass rabbet.
// Local +z points outside; USB x~0 points to box right (inside view).
wood_contact_z = 22;
wood_h = 12;
plexi_h = 3;
board_z = 25.2; // 2 mm nominal TFT/glass gap with assumed board/display heights
fit_clearance = 0.20; // PER SIDE; calibrate in print + real wood
// Corner guides enter the THROUGH-OPENING. There is NO inner pocket.
guide_height = 4.5;
guide_wall = 3;
lead_in = 0.4;
lead_height = 0.6;
guide_outline = [-7,-7,64.8,36.86];
guide_r = 3;
include <../common/wave.scad>
// Conservative envelope; profile follows opening INCLUDING the JST notch.
glass_rebate = [-17,-17,84.8,59];
glass_r = 3;
glass_clearance = 0.2;
panel_origin = [-24,-43.57];
panel_size = [250,110];
wood_points = [[25.4,-17],[25.4,39.86]];
assert(fit_clearance > 0 && fit_clearance < 0.6);
assert(guide_height < wood_h-plexi_h);
module window_profile(rect, radius=3, inset=0) {
    translate([rect[0]+radius,rect[1]+radius])
        offset(r=radius-inset)
            square([rect[2]-2*radius,rect[3]-2*radius]);
}
module guide_profile(inset=0) { window_profile(guide_outline,guide_r,inset); }
module opening_profile() {
    union() {
        guide_profile();
        window_profile([4.8,27,12,5],2); // full-depth JST cable notch
    }
}
module glass_profile(inset=0) {
    wave_profile(guide_outline,guide_r,10,inset,[[4.8,27,12,5,2]]);
}
