// Wavy outside rabbet. Distances are measured to the actual opening, not screws.
// Rounded-rectangle perimeter with continuous normal; optional rounded notches.
function wave_sdf(p,a,r)=let(q=[abs(p[0]-a[0]-a[2]/2)-(a[2]/2-r),abs(p[1]-a[1]-a[3]/2)-(a[3]/2-r)])
    norm([max(q[0],0),max(q[1],0)])+min(max(q[0],q[1]),0)-r;
function wave_distance(p,a,r,extras)=min(concat([wave_sdf(p,a,r)],
    [for(e=extras)wave_sdf(p,[e[0],e[1],e[2],e[3]],e[4])]));
function wave_arc(c,angle,r)=[c[0]+r*cos(angle),c[1]+r*sin(angle),cos(angle),sin(angle)];
function wave_at(s,a,r)=let(x=a[0],y=a[1],w=a[2],h=a[3],u=w-2*r,v=h-2*r,c=PI*r/2)
    s<u ? [x+r+s,y,0,-1] :
    s<u+c ? wave_arc([x+w-r,y+r],270+(s-u)/c*90,r) :
    s<u+c+v ? [x+w,y+r+s-u-c,1,0] :
    s<u+2*c+v ? wave_arc([x+w-r,y+h-r],(s-u-c-v)/c*90,r) :
    s<2*u+2*c+v ? [x+w-r-(s-u-2*c-v),y+h,0,1] :
    s<2*u+3*c+v ? wave_arc([x+r,y+h-r],90+(s-2*u-2*c-v)/c*90,r) :
    s<2*u+3*c+2*v ? [x,y+h-r-(s-2*u-3*c-v),-1,0] :
    wave_arc([x+r,y+r],180+(s-2*u-3*c-2*v)/c*90,r);
function wave_shift(p,d)=[p[0]+p[2]*d,p[1]+p[3]*d];
// Along an outward normal, solve the distance to the UNION including cable notch.
function wave_solve(p,d,a,r,extras,lo=0,hi=40,n=28)=
    n==0 ? (lo+hi)/2 : let(m=(lo+hi)/2)
    wave_distance(wave_shift(p,m),a,r,extras)<d ? wave_solve(p,d,a,r,extras,m,hi,n-1) :
        wave_solve(p,d,a,r,extras,lo,m,n-1);
function wave_points(a,r,waves=8,extras=[],samples=1600)=
    let(perim=2*(a[2]+a[3]-4*r)+2*PI*r)
    [for(i=[0:samples-1])let(p=wave_at(perim*i/samples,a,r),d=7+3*cos(360*waves*i/samples))
        wave_shift(p,len(extras)==0 ? d : wave_solve(p,d,a,r,extras))];
module wave_profile(a,r,waves=8,inset=0,extras=[]){
    // Round inward offset also preserves nominal clearance at concave corners.
    if(inset==0)polygon(wave_points(a,r,waves,extras));
    else offset(r=-inset,$fn=64)polygon(wave_points(a,r,waves,extras));
}
