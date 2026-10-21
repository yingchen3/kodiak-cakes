# Kodiak Pancake Wilderness

Serve dist/ with a static server or open dist/index.html directly.

For a local preview from the repository folder:

```sh
python3 -m http.server 8765 --directory dist
```

Then visit http://localhost:8765/. Any static host can serve the dist/ directory.
No installation, Node.js, Storybook, or VS Code required to use the site.

## Pages

- index.html: drag, zoom, and explore the canvas.
- stack.html: scroll through the same pancakes in one tall stack.
- edit-labels.html: edit contributor names and supporting text.

Use the View stack / Explore canvas links to switch public views. The editor
is a separate team utility; it is not linked in the visitor interface.

## Edit labels without changing code

1. Open edit-labels.html in your browser.
2. Change contributor names and supporting text beside the photos.
3. Use Preview changes to see edits in both views on this browser.
4. Use Download submissions.js and replace dist/submissions.js in the project
   with that file to keep the edits for everyone. Refresh open views afterward.

Browser previews are local to this browser and origin. They do not update the
project files or other visitors. Clear browser preview restores the project data.
The editor is not an authenticated admin service and cannot write to a server.

## Data and artwork

The 10000 × 8000 world contains 70 placements: the original 35 plus 35
active designs from the Figma section named new pancakes. The dolphin is retired. Only Joe Staluppi's
credit was supplied in the Figma file. All other credits remain samples.
Pancakes use irregular, repeatable positions with a minimum spacing; scenery
is scattered independently, with waves paired with every fish and small tree
groups beside bears. Standalone scenery is reduced to keep the landscape open.
Existing Figma artwork near the starting view remains.
The same entries power the canvas, stack, and label editor, in catalog.js.
The Figma asset manifest is new-assets.js. Every imported photo and outline
is combined into one SVG. The three added scenery assets are mushroom 1,
mushroom 2, and grass 3 (grass patch). Their accents are kept sparse.

Approved entries live in dist/submissions.js. Each has id, kind, x, y, width,
height, name, and message. An optional image property points to a custom asset
(e.g. assets/approved/pancake-001.png). Transparent prepared cutouts work best.
Sample placements are generated until there are at least 35 entries. To remove
the demo population for launch, remove that generation loop in catalog.js.

Gin Regular is bundled at 26px for names; Roboto Condensed is 20px for labels.
Each original pancake combines its photo and vector outline in one SVG asset,
so both scale together. The Figma source file has not been modified.

## Upload API: next integration

No live public upload endpoint, shared database, approval queue, authentication,
or automatic photo cutout service is connected in this static version.

A backend can accept a photo plus name/message as a pending submission. After
team approval and image preparation it should return records with the same
fields as the approved entries above. Both views should load that approved
feed before building the shared catalog. Store the uploaded photo separately
from the prepared transparent cutout; approval must happen on the server.
The editor's browser preview/export is intentionally local, not a live admin.

Label backgrounds use the original Figma red band SVG group, with its masks and
texture preserved and export backdrops omitted. Text remains editable.

Contribution statements are copied exactly from Figma section 13:904 into
dist/contributions.js. Bear and habitat artwork follow their Figma groups.
Ecosystem artwork uses all six locations in a deterministic shuffled rotation.
Only placeholder messages are replaced; Joe Staluppi and custom editor copy
are preserved. The shared catalog applies this to the canvas, stack, and editor.
