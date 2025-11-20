/**
 * Setup function to initialize the terminal environment for Ember/Glimmer
 * Similar to ember-native's setup but for terminal rendering
 */

import TerminalDocumentNode from './dom/nodes/DocumentNode.js';
import TerminalElementNode from './dom/nodes/TerminalElementNode.js';
import ViewNode from "./dom/nodes/ViewNode";

export function setup() {
  // Create the terminal document
  const document = TerminalDocumentNode.getInstance();

  // Setup global objects for Glimmer/Ember compatibility
  const g = globalThis as any;

  // Set up document
  g.document = document;

  // Set up Element constructors
  g.Element = ViewNode;
  g.Node = ViewNode;
  g.HTMLElement = ViewNode;
  g.NodeList = Array;

  // Set up window object (minimal for Ember compatibility)
  if (!g.window) {
    g.window = globalThis;
  }

  g.window.document = document;
  g.window.location = {
    href: '',
    host: '',
    hostname: '',
    pathname: '',
    search: '',
    origin: '',
    protocol: 'terminal:',
  };

  // Stub for MouseEvent (not used in terminal but needed for Ember)
  class MouseEvent {
    type: string;
    eventOpts: any;

    constructor(type: string, eventOpts?: any) {
      this.type = type;
      this.eventOpts = eventOpts;
    }
  }

  g.MouseEvent = MouseEvent;

  // Stub for Window
  class Window {}
  g.Window = Window;

  // Add requestAnimationFrame stub (for Ember's rendering)
  if (!g.requestAnimationFrame) {
    g.requestAnimationFrame = (callback: (time: number) => void) => {
      return setTimeout(() => callback(Date.now()), 16) as any; // ~60fps
    };
  }

  if (!g.cancelAnimationFrame) {
    g.cancelAnimationFrame = (id: number) => {
      clearTimeout(id);
    };
  }

  return document;
}
