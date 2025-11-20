/**
 * Render function for Ember-Ink
 * Renders Glimmer components to terminal output
 */

import { setup } from './setup.js';
import TerminalDocumentNode from './dom/nodes/TerminalDocumentNode.js';
import TerminalElementNode from './dom/nodes/TerminalElementNode.js';

export interface RenderOptions {
  /**
   * Output stream where app will be rendered.
   * @default process.stdout
   */
  stdout?: NodeJS.WriteStream;

  /**
   * Input stream where app will listen for input.
   * @default process.stdin
   */
  stdin?: NodeJS.ReadStream;

  /**
   * Error stream.
   * @default process.stderr
   */
  stderr?: NodeJS.WriteStream;
}

export interface RenderInstance {
  /**
   * The root document node
   */
  document: TerminalDocumentNode;

  /**
   * Unmount the app
   */
  unmount: () => void;

  /**
   * Clear the terminal output
   */
  clear: () => void;
}

/**
 * Render a Glimmer component to the terminal
 */
export function render(
  component: any,
  options: RenderOptions = {}
): RenderInstance {
  const {
    stdout = process.stdout,
    stdin = process.stdin,
    stderr = process.stderr,
  } = options;

  // Setup the terminal environment
  const document = setup();

  // For now, we'll just render the component tree to the document
  // Full Glimmer VM integration will come in the next phase
  
  // Create a root element
  const root = document.createElement('terminal-root') as TerminalElementNode;
  document.body.appendChild(root);

  // Render the component (placeholder - will be replaced with Glimmer VM)
  // For now, just log that we're ready
  console.log('Ember-Ink initialized');
  console.log('Document structure:', document.body.childNodes.length, 'children');

  return {
    document,
    unmount() {
      // Clear the document
      while (document.body.childNodes.length > 0) {
        document.body.removeChild(document.body.childNodes[0]!);
      }
    },
    clear() {
      stdout.write('\x1Bc'); // Clear terminal
    },
  };
}
