import Yoga, {type Node as YogaNode} from 'yoga-layout';
import applyStyles, {type Styles} from './styles.ts';
import type ElementNode from './nodes/ElementNode.ts';
import type ViewNode from './nodes/ViewNode.ts';
import measureText from '../render/measure-text.ts';

/**
 * Creates a Yoga node for an element and applies styles from attributes
 */
function createYogaNode(element: ElementNode): YogaNode {
	const yogaNode = Yoga.Node.create();
	
	// Apply styles from the element's attributes
	const styleAttr = element.getAttribute('style');
	if (styleAttr && typeof styleAttr === 'object') {
		applyStyles(yogaNode, styleAttr as Styles);
	}
	
	// Apply individual style attributes
	const styles: Partial<Styles> = {};
	
	// Flexbox properties
	if (element.hasAttribute('flexDirection')) {
		styles.flexDirection = element.getAttribute('flexDirection') as any;
	}
	if (element.hasAttribute('flexGrow')) {
		styles.flexGrow = Number(element.getAttribute('flexGrow'));
	}
	if (element.hasAttribute('flexShrink')) {
		styles.flexShrink = Number(element.getAttribute('flexShrink'));
	}
	if (element.hasAttribute('flexBasis')) {
		styles.flexBasis = element.getAttribute('flexBasis') as any;
	}
	if (element.hasAttribute('flexWrap')) {
		styles.flexWrap = element.getAttribute('flexWrap') as any;
	}
	if (element.hasAttribute('alignItems')) {
		styles.alignItems = element.getAttribute('alignItems') as any;
	}
	if (element.hasAttribute('alignSelf')) {
		styles.alignSelf = element.getAttribute('alignSelf') as any;
	}
	if (element.hasAttribute('justifyContent')) {
		styles.justifyContent = element.getAttribute('justifyContent') as any;
	}
	
	// Dimensions
	if (element.hasAttribute('width')) {
		styles.width = element.getAttribute('width') as any;
	}
	if (element.hasAttribute('height')) {
		styles.height = element.getAttribute('height') as any;
	}
	if (element.hasAttribute('minWidth')) {
		styles.minWidth = element.getAttribute('minWidth') as any;
	}
	if (element.hasAttribute('minHeight')) {
		styles.minHeight = element.getAttribute('minHeight') as any;
	}
	
	// Spacing
	if (element.hasAttribute('margin')) {
		styles.margin = Number(element.getAttribute('margin'));
	}
	if (element.hasAttribute('marginX')) {
		styles.marginX = Number(element.getAttribute('marginX'));
	}
	if (element.hasAttribute('marginY')) {
		styles.marginY = Number(element.getAttribute('marginY'));
	}
	if (element.hasAttribute('marginTop')) {
		styles.marginTop = Number(element.getAttribute('marginTop'));
	}
	if (element.hasAttribute('marginBottom')) {
		styles.marginBottom = Number(element.getAttribute('marginBottom'));
	}
	if (element.hasAttribute('marginLeft')) {
		styles.marginLeft = Number(element.getAttribute('marginLeft'));
	}
	if (element.hasAttribute('marginRight')) {
		styles.marginRight = Number(element.getAttribute('marginRight'));
	}
	
	if (element.hasAttribute('padding')) {
		styles.padding = Number(element.getAttribute('padding'));
	}
	if (element.hasAttribute('paddingX')) {
		styles.paddingX = Number(element.getAttribute('paddingX'));
	}
	if (element.hasAttribute('paddingY')) {
		styles.paddingY = Number(element.getAttribute('paddingY'));
	}
	if (element.hasAttribute('paddingTop')) {
		styles.paddingTop = Number(element.getAttribute('paddingTop'));
	}
	if (element.hasAttribute('paddingBottom')) {
		styles.paddingBottom = Number(element.getAttribute('paddingBottom'));
	}
	if (element.hasAttribute('paddingLeft')) {
		styles.paddingLeft = Number(element.getAttribute('paddingLeft'));
	}
	if (element.hasAttribute('paddingRight')) {
		styles.paddingRight = Number(element.getAttribute('paddingRight'));
	}
	
	// Gap
	if (element.hasAttribute('gap')) {
		styles.gap = Number(element.getAttribute('gap'));
	}
	if (element.hasAttribute('columnGap')) {
		styles.columnGap = Number(element.getAttribute('columnGap'));
	}
	if (element.hasAttribute('rowGap')) {
		styles.rowGap = Number(element.getAttribute('rowGap'));
	}
	
	// Position
	if (element.hasAttribute('position')) {
		styles.position = element.getAttribute('position') as any;
	}
	
	// Display
	if (element.hasAttribute('display')) {
		styles.display = element.getAttribute('display') as any;
	}
	
	// Border
	if (element.hasAttribute('borderStyle')) {
		styles.borderStyle = element.getAttribute('borderStyle') as any;
	}
	if (element.hasAttribute('borderTop')) {
		styles.borderTop = element.getAttribute('borderTop') as boolean;
	}
	if (element.hasAttribute('borderBottom')) {
		styles.borderBottom = element.getAttribute('borderBottom') as boolean;
	}
	if (element.hasAttribute('borderLeft')) {
		styles.borderLeft = element.getAttribute('borderLeft') as boolean;
	}
	if (element.hasAttribute('borderRight')) {
		styles.borderRight = element.getAttribute('borderRight') as boolean;
	}
	// Apply collected styles
	if (Object.keys(styles).length > 0) {
		applyStyles(yogaNode, styles);
	}
	
	// Set measure function for text elements
	if (element.tagName === 'terminal-text') {
		yogaNode.setMeasureFunc((width) => {
			const text = (element as any).text || '';
			const dimensions = measureText(text);
			return {
				width: dimensions.width,
				height: dimensions.height,
			};
		});
	}
	
	return yogaNode;
}

/**
 * Recursively builds Yoga node tree from DOM tree
 */
function buildYogaTree(node: ViewNode): void {
	// Only process element nodes
	if (node.nodeType !== 1) {
		return;
	}
	
	const element = node as ElementNode;
	
	// Create Yoga node if it doesn't exist
	if (!element.yogaNode) {
		element.yogaNode = createYogaNode(element);
	}
	
	// Process children
	let childIndex = 0;
	for (let i = 0; i < element.childNodes.length; i++) {
		const child = element.childNodes[i];
		
		if (child && child.nodeType === 1) {
			const childElement = child as ElementNode;
			
			// Build child's Yoga tree
			buildYogaTree(childElement);
			
			// Insert child Yoga node (only if not already a child)
			if (childElement.yogaNode && element.yogaNode) {
				// Check if child already has a parent, remove it first
				const childYogaNode = childElement.yogaNode;
				const parentYogaNode = element.yogaNode;
				
				// Try to get parent - if it has one and it's different, remove it
				try {
					const currentParent = childYogaNode.getParent();
					if (currentParent && currentParent !== parentYogaNode) {
						currentParent.removeChild(childYogaNode);
					}
				} catch (e) {
					// getParent might not exist or child might not have parent yet
				}
				
				// Only insert if not already a child of this parent
				const childCount = parentYogaNode.getChildCount();
				let alreadyChild = false;
				for (let j = 0; j < childCount; j++) {
					if (parentYogaNode.getChild(j) === childYogaNode) {
						alreadyChild = true;
						break;
					}
				}
				
				if (!alreadyChild) {
					parentYogaNode.insertChild(childYogaNode, childIndex);
				}
				childIndex++;
			}
		}
	}
}

/**
 * Calculates layout for the entire tree starting from root
 */
export function calculateLayout(
	rootNode: ViewNode,
	width?: number,
	height?: number,
): void {
	if (rootNode.nodeType !== 1) {
		return;
	}
	
	const rootElement = rootNode as ElementNode;
	
	// Build or update Yoga tree
	buildYogaTree(rootElement);
	
	// Calculate layout
	if (rootElement.yogaNode) {
		rootElement.yogaNode.calculateLayout(
			width ?? Number.NaN,
			height ?? Number.NaN,
			Yoga.DIRECTION_LTR,
		);
	}
}

/**
 * Updates styles on an existing Yoga node
 */
export function updateYogaNodeStyles(
	element: ElementNode,
	styles: Styles,
): void {
	if (!element.yogaNode) {
		element.yogaNode = createYogaNode(element);
	}
	
	applyStyles(element.yogaNode, styles);
}

/**
 * Cleans up Yoga nodes recursively
 */
export function cleanupYogaTree(node: ViewNode): void {
	if (node.nodeType !== 1) {
		return;
	}
	
	const element = node as ElementNode;
	
	// Clean up children first
	for (const child of element.childNodes) {
		cleanupYogaTree(child);
	}
	
	// Clean up this node
	if (element.yogaNode) {
		element.yogaNode.unsetMeasureFunc();
		element.yogaNode.freeRecursive();
		element.yogaNode = undefined;
	}
}

/**
 * Gets computed layout for an element
 */
export function getComputedLayout(element: ElementNode): {
	left: number;
	top: number;
	width: number;
	height: number;
} | null {
	if (!element.yogaNode) {
		return null;
	}
	
	return {
		left: element.yogaNode.getComputedLeft(),
		top: element.yogaNode.getComputedTop(),
		width: element.yogaNode.getComputedWidth(),
		height: element.yogaNode.getComputedHeight(),
	};
}
