// Symmetric difference: regenerated current source versus retained print STL.
// Supply absolute paths using -D old_file="..." / -D new_file="...".
old_file=""; new_file="";
union(){
    difference(){import(old_file);import(new_file);}
    difference(){import(new_file);import(old_file);}
}
