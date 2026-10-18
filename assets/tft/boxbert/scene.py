"""Boxbert: fully procedural Blender scene, Cycles CPU, deterministic frame index.
Run using render.sh. No downloaded textures/fonts or external assets.
"""
import bpy
import math
import sys
from pathlib import Path
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
out = Path(args[0]) if args else Path(__file__).resolve().parent / 'masters'
out.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
s = bpy.context.scene
s.render.engine = 'CYCLES'
s.render.compositor_device = 'CPU'
s.cycles.device = 'CPU'
s.cycles.samples = 48
s.cycles.seed = 106
s.cycles.use_animated_seed = False
s.cycles.use_denoising = False
s.render.threads_mode = 'FIXED'
s.render.threads = 4
s.render.resolution_x = s.render.resolution_y = 64
s.render.resolution_percentage = 100
s.render.image_settings.file_format = 'PNG'
s.render.image_settings.color_mode = 'RGB'
s.render.image_settings.color_depth = '8'
s.render.film_transparent = True
s.render.dither_intensity = 0
s.view_settings.view_transform = 'Standard'
s.view_settings.look = 'None'
s.view_settings.exposure = 0
s.view_settings.gamma = 1
s.world.color = (0.18, 0.18, 0.18)
# Transparent film over an exact sRGB 16/255 background, in scene-linear space.
v = ((16 / 255 + 0.055) / 1.055) ** 2.4
nt = bpy.data.node_groups.new('Boxbert compositor', 'CompositorNodeTree')
s.compositing_node_group = nt
nt.interface.new_socket(name='Image', in_out='OUTPUT', socket_type='NodeSocketColor')
rl = nt.nodes.new('CompositorNodeRLayers')
over = nt.nodes.new('CompositorNodeAlphaOver')
over.inputs['Background'].default_value = (v, v, v, 1)
nt.links.new(rl.outputs['Image'], over.inputs['Foreground'])
comp = nt.nodes.new('NodeGroupOutput')
nt.links.new(over.outputs[0], comp.inputs[0])

root = bpy.data.objects.new('BoxbertRoot', None)
s.collection.objects.link(root)

def material(name, color, roughness=0.48):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = roughness
    return m

teal = material('teal shell', (0.025, 0.39, 0.33))
wood = material('warm birch face', (0.75, 0.43, 0.19))
yellow = material('honey handle', (1.0, 0.58, 0.095))
white = material('warm eye white', (0.92, 0.95, 0.89), .24)
black = material('charcoal', (.009, .018, .024), .36)
rose = material('rose cheeks', (.9, .22, .17))

def finish(obj, name, mat):
    obj.name = name
    obj.data.materials.append(mat)
    obj.parent = root
    return obj

def box(name, loc, scale, mat, bevel=.10):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = o.modifiers.new('soft rounded corners', 'BEVEL')
    mod.width = bevel
    mod.segments = 5
    o.modifiers.new('weighted normals', 'WEIGHTED_NORMAL')
    return finish(o, name, mat)

def ball(name, loc, scale, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1, location=loc)
    o = bpy.context.object
    o.scale = scale
    for p in o.data.polygons:
        p.use_smooth = True
    return finish(o, name, mat)

box('rounded musicbox', (0,0,0), (1.85,1.15,1.65), teal, .20)
box('birch front inset', (0,-.585,-.01), (1.64,.075,1.43), wood, .16)
for x in [-.57,.57]:
    box('small rubber foot', (x,-.04,-.91), (.40,.62,.24), black, .10)
    box('handle upright', (x,0,.96), (.17,.25,.43), yellow, .08)
box('carry handle', (0,0,1.16), (1.30,.25,.18), yellow, .08)
# Speaker grille lower on the face, readable as a musicbox at native resolution.
box('speaker recess', (0,-.65,-.39), (.78,.07,.40), black, .16)
for z in [-.47,-.38,-.29]:
    box('speaker slit', (0,-.696,z), (.54,.02,.026), teal, .012)
eyes = []
for x in [-.43,.43]:
    eye = ball('large friendly eye', (x,-.68,.33), (.34,.14,.38), white)
    pupil = ball('pupil', (x+.055,-.813,.34), (.145,.065,.195), black)
    glint = ball('catchlight', (x+.015,-.874,.42), (.047,.018,.06), white)
    eyes.append((eye,pupil,glint))
    ball('cheek', (x*1.45,-.65,-.10), (.105,.024,.056), rose)
# Two bright top buttons reinforce the portable music player silhouette.
for x,mat in [(-.35,rose),(.13,yellow)]:
    ball('top button', (x,-.22,.855), (.13,.13,.07), mat)

bpy.ops.object.camera_add(location=(2.5,-7.0,2.6))
cam = bpy.context.object
cam.rotation_euler = (Vector((0,0,.10)) - cam.location).to_track_quat('-Z','Y').to_euler()
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 3.25
s.camera = cam
for name,loc,power,size in [('key',(-3,-4,6),400,4), ('fill',(4,-2,2),150,3), ('rim',(1,3,4),350,3)]:
    bpy.ops.object.light_add(type='AREA', location=loc)
    light=bpy.context.object
    light.name=name
    light.data.energy=power
    light.data.shape='DISK'
    light.data.size=size
    light.rotation_euler = (-light.location).to_track_quat('-Z','Y').to_euler()

for i in range(12):
    phase=2*math.pi*i/12
    root.rotation_euler[2] = .015 * math.sin(phase)
    root.location.z = .010 * math.sin(phase)
    blink={7:.55,8:.075,9:.55}.get(i,1)
    for eye,pupil,glint in eyes:
        eye.scale.z=.38*blink
        pupil.scale.z=.195*blink
        glint.scale.z=.06*blink
        pupil.location.z=.33 + .01*blink
        glint.location.z=.33 + .09*blink
    s.render.filepath=str(out / f'frame-{i:03d}.png')
    bpy.ops.render.render(write_still=True)
print(f'BOXBERT rendered 12 PNG masters to {out}; Blender {bpy.app.version_string}')
