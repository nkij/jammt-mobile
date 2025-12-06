## Png file naming convention
## These files must exist:
## component[_flavor]_default_active.png
##
## Other files have to follow the convention:
## component[_flavor]_mode_state.png
##
## component: handle, lens, substrate, beam-analyzer, text-label, clipping
## flavor: convex-convex, concave-concave, plan-plan
##         plan-convex, plan-concave, convex-concave
## mode: rotate, default
## state: active, inactive
##

import sys, os

svg_file = "images.svg"
sharedImages = []

components = ('handle', 'lens', 'substrate', 'beam-analyzer', 'clipping', 'text-label')
flavors = ('convex-convex', 'concave-concave', 'plan-plan', 'plan-convex', 'plan-concave', 'convex-concave')
modes = ('default', 'rotate')
states = ('active', 'inactive')

f = open(svg_file)
lines = f.readlines()
f.close()

svg = ""
for line in lines:
    svg += line

names = []
for component in components:
    for mode in modes:
        for state in states:
            if component == 'lens':
                for flavor in flavors[0:2]:
                    names.append("%s_%s_%s_%s" % (component, flavor, mode, state))
            elif component == 'substrate':
                for flavor in flavors:
                    names.append("%s_%s_%s_%s" % (component, flavor, mode, state))
            else:
                names.append("%s_%s_%s" % (component, mode, state))

valid_names = []
for name in names:
    if name in svg:
        valid_names.append(name)

for name in valid_names:
    cmd = "inkscape --export-id=%s --export-png=%s.png %s" % (name, name, svg_file)
    os.system(cmd)

# copy  the images that are shared
for share in sharedImages:
    for name in share[1:]:
        cmd = "cp %s.png %s.png" % (share[0], name)
        print cmd
        os.system(cmd)

