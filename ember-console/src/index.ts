/**
 * Ember-Ink - Terminal UI library for Ember.js
 * Inspired by Ink (React for CLIs)
 */

// Export setup and render
export { setup } from './setup.js';
export { render } from './render.js';
export type { RenderOptions, RenderInstance } from './render.js';

// Export DOM nodes
export { default as ViewNode } from './dom/nodes/ViewNode.js';
export { default as TerminalElementNode } from './dom/nodes/TerminalElementNode.js';
export { default as Text } from './dom/nodes/TerminalTextNode.js';
export { default as TerminalDocumentNode } from './dom/nodes/TerminalDocumentNode.js';

// Export types
export type { TerminalStyles, OutputTransformer } from './dom/nodes/TerminalElementNode.js';

// Note: Text component will be exported once Glimmer VM integration is complete
