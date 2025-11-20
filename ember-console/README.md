# Ember-Ink

Terminal UI library for Ember.js, inspired by [Ink](https://github.com/vadimdemedes/ink).

## Overview

Ember-Ink brings the power of Ember.js and Glimmer components to terminal applications. Build beautiful command-line interfaces using familiar Ember patterns and components.

## Current Status

**Phase 1: Foundation** ✅ (In Progress)

- ✅ Project structure created
- ✅ DOM abstraction layer implemented
  - `ViewNode`: Base node class
  - `TerminalElementNode`: Element nodes with styles
  - `TerminalTextNode`: Text content nodes
- ✅ Text component created (`Text.gts`)
- ✅ Demo application scaffolded
- 🚧 Glimmer VM integration (Next)
- 🚧 Layout engine (Yoga) integration (Next)
- 🚧 Rendering pipeline (Next)

## Architecture

### DOM Abstraction

Ember-Ink uses a custom DOM abstraction layer optimized for terminal rendering:

```typescript
// Base node with parent-child relationships
ViewNode
  ├── TerminalElementNode  // Styled containers and elements
  └── TerminalTextNode     // Text content
```

### Components

Components are written in `.gts` (Glimmer TypeScript) format:

```typescript
// ember/src/components/Text.gts
import Component from '@glimmer/component';

export default class Text extends Component<TextSignature> {
  <template>
    <terminal-text ...attributes>
      {{yield}}
    </terminal-text>
  </template>
}
```

## Components

### Text

Display styled text in the terminal.

**Props:**
- `color` - Text color (named, hex, or rgb)
- `backgroundColor` - Background color
- `bold` - Bold text
- `italic` - Italic text
- `underline` - Underlined text
- `strikethrough` - Strikethrough text
- `dimColor` - Dim the color
- `inverse` - Invert colors
- `wrap` - Text wrapping mode

**Example:**
```gts
<Text @color="green" @bold={{true}}>
  Success!
</Text>
```

## Installation

```bash
cd ember
npm install
npm run build
```

## Demo

```bash
cd ember-ink-demo
npm install
npm start
```

## Development Roadmap

### Phase 1: Foundation (Current)
- [x] DOM abstraction layer
- [x] Text component
- [ ] Glimmer VM renderer
- [ ] Basic rendering pipeline

### Phase 2: Layout & Box
- [ ] Yoga layout integration
- [ ] Box component
- [ ] Flexbox properties
- [ ] Borders and backgrounds

### Phase 3: Advanced Components
- [ ] Static component
- [ ] Transform component
- [ ] Newline & Spacer

### Phase 4: Interactivity
- [ ] Input service
- [ ] Focus management
- [ ] Keyboard handling

### Phase 5: Polish
- [ ] Full test suite
- [ ] Documentation
- [ ] Examples

## Differences from Ink

1. **Ember.js instead of React**: Uses Glimmer components and Ember's reactivity
2. **Services over Hooks**: Ember services for app state and I/O
3. **Modifiers**: Ember modifiers instead of React hooks
4. **GTS Syntax**: Template-first component syntax
5. **Dependency Injection**: Ember's DI system

## Contributing

This is an early-stage project. Contributions welcome!

## License

MIT

## Acknowledgments

- [Ink](https://github.com/vadimdemedes/ink) - The original React-based terminal UI library
- [Ember-Native](https://github.com/ember-native/ember-native) - Inspiration for DOM abstraction patterns
- [Yoga](https://github.com/facebook/yoga) - Flexbox layout engine
