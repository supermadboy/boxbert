// Shared CNC/print interface, mm. Draft dimensions, not physical approval.
// Local +z points outside. USB at x=0, toward box right (inside view).
wood_contact_z = 22;
wood_h = 12;
plexi_h = 3;
board_z = 24;
fit_clearance = 0.20; // PER SIDE; calibrate actual printer/material/wood
pocket_depth = 4;
guide_height = 3;
guide_wall = 3;
lead_in = 0.4;
lead_height = 0.6;
pocket = [-7,-7,64.8,36.86];
pocket_r = 3; // CNC cutter diameter <=6 mm
opening = [-2,-2,54.8,26.86];
opening_r = 3;
glass_rebate = [-6,-6,62.8,34.86];
glass_r = 3;
glass_clearance = 0.2; // per side, also an untested allowance
panel_origin = [-24,-43.57];
panel_size = [250,110]; // front elevation, outside box width x height
wood_points = [[25.4,-17],[25.4,39.86]];
assert(fit_clearance > 0 && fit_clearance < 0.6);
assert(guide_height < pocket_depth);
assert(pocket_depth + plexi_h < wood_h);
module window_profile(rect, radius=3, inset=0) {
    translate([rect[0]+radius,rect[1]+radius])
        offset(r=radius-inset)
            square([rect[2]-2*radius,rect[3]-2*radius]);
}
module pocket_profile(inset=0) { window_profile(pocket,pocket_r,inset); }
// Same-depth reliefs, BETWEEN the guiding corners. USB exits to box side.
module machining_pocket_profile() {
    union() {
        pocket_profile();
        window_profile([-25,4,20,15],2); // open inner USB channel to panel edge
        window_profile([4.8,27,12,5],2); // JST cable sweep, beyond guide rectangle
    }
}
module opening_profile() { window_profile(opening,opening_r); }
module glass_profile(inset=0) { window_profile(glass_rebate,glass_r,inset); }
