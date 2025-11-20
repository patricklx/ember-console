import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import chalk from 'chalk';

interface TextSignature {
  Args: {
    color?: string;
    backgroundColor?: string;
    dimColor?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    inverse?: boolean;
    wrap?: 'wrap' | 'truncate' | 'truncate-start' | 'truncate-middle' | 'truncate-end';
  };
  Blocks: {
    default: [];
  };
  Element: HTMLElement;
}

/**
 * Text component for terminal rendering
 * Displays styled text with color, formatting, and wrapping options
 */
export default class Text extends Component<TextSignature> {
  /**
   * Apply text transformations based on props
   */
  get transformedContent(): string {
    // Get the text content from the block
    // In a real implementation, this would come from the rendered block content
    let text = ''; // Placeholder - will be replaced with actual content
    
    const {
      color,
      backgroundColor,
      dimColor = false,
      bold = false,
      italic = false,
      underline = false,
      strikethrough = false,
      inverse = false,
    } = this.args;

    // Apply dim first
    if (dimColor) {
      text = chalk.dim(text);
    }

    // Apply colors
    if (color) {
      text = this.colorize(text, color, 'foreground');
    }

    if (backgroundColor) {
      text = this.colorize(text, backgroundColor, 'background');
    }

    // Apply text styles
    if (bold) {
      text = chalk.bold(text);
    }

    if (italic) {
      text = chalk.italic(text);
    }

    if (underline) {
      text = chalk.underline(text);
    }

    if (strikethrough) {
      text = chalk.strikethrough(text);
    }

    if (inverse) {
      text = chalk.inverse(text);
    }

    return text;
  }

  /**
   * Colorize text with chalk
   */
  private colorize(text: string, color: string, type: 'foreground' | 'background'): string {
    // Handle hex colors
    if (color.startsWith('#')) {
      return type === 'foreground' 
        ? chalk.hex(color)(text)
        : chalk.bgHex(color)(text);
    }

    // Handle rgb colors
    if (color.startsWith('rgb(')) {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match;
        return type === 'foreground'
          ? chalk.rgb(Number(r), Number(g), Number(b))(text)
          : chalk.bgRgb(Number(r), Number(g), Number(b))(text);
      }
    }

    // Handle named colors
    const chalkMethod = type === 'foreground' ? color : `bg${color.charAt(0).toUpperCase()}${color.slice(1)}`;
    if (typeof (chalk as any)[chalkMethod] === 'function') {
      return (chalk as any)[chalkMethod](text);
    }

    return text;
  }

  <template>
    <terminal-text
      data-color={{@color}}
      data-bg-color={{@backgroundColor}}
      data-dim={{@dimColor}}
      data-bold={{@bold}}
      data-italic={{@italic}}
      data-underline={{@underline}}
      data-strikethrough={{@strikethrough}}
      data-inverse={{@inverse}}
      data-wrap={{@wrap}}
      ...attributes
    >
      {{yield}}
    </terminal-text>
  </template>
}
