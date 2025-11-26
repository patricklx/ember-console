/**
 * Fake TTY implementation for testing terminal output
 * Captures all writes to stdout and provides TTY-like properties
 */
export class FakeTTY {
  public output: string[] = [];
  public rows: number = 24;
  public columns: number = 80;
  public isTTY: boolean = true;
  private cursorX: number = 0;
  private cursorY: number = 0;
  private lastClearIndex: number = 0; // Track where we last cleared

  write(data: string): boolean {
    this.output.push(data);
    return true;
  }

  /**
   * Move cursor to absolute position
   */
  cursorTo(x: number, y?: number, callback?: () => void): boolean {
    this.cursorX = x;
    if (y !== undefined) {
      this.cursorY = y;
      // ANSI: ESC[{row};{col}H (1-based positioning)
      this.output.push(`\x1b[${y + 1};${x + 1}H`);
    } else {
      // Move to column only: ESC[{col}G
      this.output.push(`\x1b[${x + 1}G`);
    }
    if (callback) callback();
    return true;
  }

  /**
   * Move cursor relative to current position
   */
  moveCursor(dx: number, dy: number, callback?: () => void): boolean {
    this.cursorX += dx;
    this.cursorY += dy;
    
    if (dy < 0) {
      // Move up: ESC[{n}A
      this.output.push(`\x1b[${Math.abs(dy)}A`);
    } else if (dy > 0) {
      // Move down: ESC[{n}B
      this.output.push(`\x1b[${dy}B`);
    }
    
    if (dx > 0) {
      // Move right: ESC[{n}C
      this.output.push(`\x1b[${dx}C`);
    } else if (dx < 0) {
      // Move left: ESC[{n}D
      this.output.push(`\x1b[${Math.abs(dx)}D`);
    }
    
    if (callback) callback();
    return true;
  }

  /**
   * Clear line
   * @param dir -1 = to the left, 1 = to the right, 0 = entire line
   */
  clearLine(dir: -1 | 0 | 1, callback?: () => void): boolean {
    if (dir === -1) {
      // Clear from cursor to start of line: ESC[1K
      this.output.push('\x1b[1K');
    } else if (dir === 1) {
      // Clear from cursor to end of line: ESC[0K
      this.output.push('\x1b[0K');
    } else {
      // Clear entire line: ESC[2K
      this.output.push('\x1b[2K');
    }
    if (callback) callback();
    return true;
  }

  /**
   * Clear screen from cursor down
   */
  clearScreenDown(callback?: () => void): boolean {
    // Clear from cursor to end of screen: ESC[0J
    this.output.push('\x1b[0J');
    if (callback) callback();
    return true;
  }

  getFullOutput(): string {
    return this.output.join('');
  }

  /**
   * Clear the output buffer and mark the clear point
   * This allows getting only new output since last clear
   */
  clear(): void {
    this.lastClearIndex = this.output.length;
  }

  /**
   * Get output since last clear() call
   */
  private getOutputSinceClear(): string {
    return this.output.slice(this.lastClearIndex).join('');
  }

  /**
   * Get ALL output without ANSI cursor control codes (cumulative)
   */
  private getAllVisibleOutput(): string {
    return this.output.join('')
      // Remove cursor hide/show
      .replace(/\x1b\[\?25[lh]/g, '')
      // Remove cursor positioning
      .replace(/\x1b\[\d+;\d+H/g, '')
      .replace(/\x1b\[\d+H/g, '')
      .replace(/\x1b\[\d+G/g, '')
      // Remove cursor movement
      .replace(/\x1b\[\d+[ABCD]/g, '')
      // Remove clear screen sequences
      .replace(/\x1b\[2J/g, '')
      .replace(/\x1b\[3J/g, '')
      .replace(/\x1b\[0J/g, '')
      // Remove clear line sequences
      .replace(/\x1b\[0K/g, '')
      .replace(/\x1b\[1K/g, '')
      .replace(/\x1b\[2K/g, '');
  }

  /**
   * Get output without ANSI cursor control codes for easier testing
   * Returns output since last clear() call
   */
  getVisibleOutput(): string {
    return this.getOutputSinceClear()
      // Remove cursor hide/show
      .replace(/\x1b\[\?25[lh]/g, '')
      // Remove cursor positioning
      .replace(/\x1b\[\d+;\d+H/g, '')
      .replace(/\x1b\[\d+H/g, '')
      .replace(/\x1b\[\d+G/g, '')
      // Remove cursor movement
      .replace(/\x1b\[\d+[ABCD]/g, '')
      // Remove clear screen sequences
      .replace(/\x1b\[2J/g, '')
      .replace(/\x1b\[3J/g, '')
      .replace(/\x1b\[0J/g, '')
      // Remove clear line sequences
      .replace(/\x1b\[0K/g, '')
      .replace(/\x1b\[1K/g, '')
      .replace(/\x1b\[2K/g, '');
  }

  /**
   * Get output with all ANSI codes removed (colors, cursor, etc.)
   * Returns cumulative output (all output, not just since last clear)
   */
  getCleanOutput(): string {
    const visible = this.getAllVisibleOutput();
    // Remove ANSI color codes
    const withoutColors = visible.replace(/\x1b\[[0-9;]*m/g, '');
    // Remove reset codes
    return withoutColors.replace(/\x1b\[0m/g, '');
  }

  /**
   * Get lines from output (split by newlines)
   */
  getLines(): string[] {
    const output = this.getVisibleOutput();
    return output.split('\n').filter(line => line.length > 0);
  }

  /**
   * Reset the TTY state completely
   */
  reset(): void {
    this.output = [];
    this.lastClearIndex = 0;
    this.rows = 24;
    this.columns = 80;
    this.cursorX = 0;
    this.cursorY = 0;
  }
}
