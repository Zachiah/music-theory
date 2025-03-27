# Music Theory

## TODO List

- [ ] Improve the fretboard preset creation process
  - [ ] Store preset state higher up in the tree so it isn't reset when switching to keyboard
  - [ ] Implement state persistance with `localStorage` (also store chord display options there while we are ate it)
  - [ ] Show a live fretboard somewhere on the creation screen so they get visual feedback
  - [ ] Make the live fretboard interactive and editable
  - [ ] Make a text field that makes it really easy to fuzzily create a simple fretboard (like notes separated by commas or whatever, the octave number isn't required for notes here it will guess based on other notes if it isn't provided)
  - [ ] Make a first step before the current page where they choose their starting preset. There will be tons and tons of options here with a searchable select sort of thing
- [ ] Implement fretboard dots
  - [ ] Actually render them in `FretboardDisplay.svelte`
  - [ ] Add them for the built in presets
  - [ ] Allow users to create them in the preset editor
- [ ] Make fretboard/keyboard be in the url
- [ ] Allow showing of `CanonicalPitch` on the keyboard like it is on the fretboard
- [ ] Allow optionally picking a scale for chord identification to be based on
  - [ ] Should show labels based on the scale (as in enharmonic and such)
  - [ ] There could be an option to show all notes in the scale in the neutral tone on the keyboard/fretboard
  - [ ] At some point we may be able to actually factor in the scale into the heuristic of guessing the chord
