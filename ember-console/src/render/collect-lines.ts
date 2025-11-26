import ElementNode from "../dom/nodes/ElementNode";
import { calculateLayout } from "../dom/layout.js";
import Output from "./Output.js";
import { renderNodeToOutput } from "./renderNodeToOutput.js";
import { TerminalBoxElement } from "../dom/native-elements/TerminalBoxElement.js";

// Cache for static element output
let staticOutputCache: string[] = [];
// Track which static elements have been rendered
let renderedStaticElements = new WeakSet<ElementNode>();

/**
 * Check if an element or any of its ancestors is a static element
 */
function isInStaticElement(node: ElementNode): boolean {
	let current: ElementNode | null = node;
	while (current) {
		if (current.getAttribute && current.getAttribute('internal_static')) {
			return true;
		}
		current = current.parentNode as ElementNode | null;
	}
	return false;
}

/**
 * Find all static elements in the tree
 */
function findStaticElements(node: ElementNode): TerminalBoxElement[] {
	const staticElements: TerminalBoxElement[] = [];
	
	if (node.getAttribute && node.getAttribute('internal_static')) {
		staticElements.push(node as TerminalBoxElement);
	}
	
	for (const child of node.childNodes) {
		if (child.nodeType === 1) {
			staticElements.push(...findStaticElements(child as ElementNode));
		}
	}
	
	return staticElements;
}

/**
 * Extract lines from the document tree using layout-based rendering
 *
 * This function:
 * 1. Calculates layout using Yoga
 * 2. Creates an Output instance for coordinate-based rendering
 * 3. Renders each node using renderNodeToOutput
 * 4. Extracts the final output and converts to lines
 * 5. Handles static elements separately - they are cached and not re-rendered
 */
export function extractLines(rootNode: ElementNode): {
	static: string[],
	dynamic: string[],
} {
	// Get terminal dimensions
	const terminalWidth = process.stdout.columns || 80;
	const terminalHeight = process.stdout.rows || 24;

	// Find all static elements
	const staticElements = findStaticElements(rootNode);
	
	// Check if we have any new static elements to render
	const newStaticElements = staticElements.filter(el => !renderedStaticElements.has(el));
	
	// Calculate layout for the entire tree
	const staticHeight = staticOutputCache.length;
	calculateLayout(rootNode, terminalWidth, Math.max(0, terminalHeight - staticHeight));

	// If we have new static elements, render them
	if (newStaticElements.length > 0) {
		for (const staticElement of newStaticElements) {
			const height = staticElement.yogaNode?.getComputedHeight() || 0;
			const width = staticElement.yogaNode?.getComputedWidth() || terminalWidth;
			
			const staticOutput = new Output({
				width: width,
				height: height,
			});

			// Render the static element
			renderNodeToOutput(staticElement, staticOutput, {
				offsetX: 0,
				offsetY: 0,
				transformers: [],
				skipStaticElements: false,
			});

			const { output: renderedOutput } = staticOutput.get();
			const lines = renderedOutput.split('\n');
			
			// Add to cache
			staticOutputCache.push(...lines);
			
			// Mark as rendered
			renderedStaticElements.add(staticElement);
		}
	}

	// Calculate height for dynamic content
	const height = rootNode.childNodes.map(c => c.yogaNode?.getComputedHeight() || 0).reduce((x, y) => x + y, 0);
	
	// Create output buffer for dynamic content
	const output = new Output({
		width: rootNode.yogaNode?.getComputedWidth(),
		height: height,
	});

	// Render the node tree, skipping static elements
	renderNodeToOutput(rootNode, output, {
		offsetX: 0,
		offsetY: 0,
		transformers: [],
		skipStaticElements: true,
	});

	// Extract the final output
	const { output: renderedOutput } = output.get();
	const dynamicLines = renderedOutput.split('\n');

	return {
		static: staticOutputCache,
		dynamic: dynamicLines
	};
}

/**
 * Reset the static cache (for testing)
 */
export function resetStaticCache() {
	staticOutputCache = [];
	renderedStaticElements = new WeakSet<ElementNode>();
}