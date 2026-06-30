export interface TextEditResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export const applyTextEdit = (
  textarea: HTMLTextAreaElement,
  result: TextEditResult,
): void => {
  textarea.focus();
  textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
};

export const wrapSelection = (
  value: string,
  start: number,
  end: number,
  before: string,
  after: string = before,
  placeholder = 'text',
): TextEditResult => {
  const selected = value.slice(start, end) || placeholder;
  const next =
    value.slice(0, start) + before + selected + after + value.slice(end);
  const selStart = start + before.length;
  const selEnd = selStart + selected.length;
  return { value: next, selectionStart: selStart, selectionEnd: selEnd };
};

export const prefixLines = (
  value: string,
  start: number,
  end: number,
  prefix: string,
): TextEditResult => {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = value.indexOf('\n', end);
  const blockEnd = lineEnd === -1 ? value.length : lineEnd;
  const block = value.slice(lineStart, blockEnd);
  const prefixed = block
    .split('\n')
    .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line}`))
    .join('\n');
  const next = value.slice(0, lineStart) + prefixed + value.slice(blockEnd);
  const delta = prefixed.length - block.length;
  return {
    value: next,
    selectionStart: start,
    selectionEnd: end + delta,
  };
};

export type MarkdownAction =
  | 'bold'
  | 'italic'
  | 'heading'
  | 'quote'
  | 'ul'
  | 'ol'
  | 'code'
  | 'link';

export const runMarkdownAction = (
  value: string,
  start: number,
  end: number,
  action: MarkdownAction,
): TextEditResult => {
  switch (action) {
    case 'bold':
      return wrapSelection(value, start, end, '**', '**', 'bold text');
    case 'italic':
      return wrapSelection(value, start, end, '_', '_', 'italic text');
    case 'heading':
      return prefixLines(value, start, end, '# ');
    case 'quote':
      return prefixLines(value, start, end, '> ');
    case 'ul':
      return prefixLines(value, start, end, '- ');
    case 'ol':
      return prefixLines(value, start, end, '1. ');
    case 'code':
      return wrapSelection(value, start, end, '`', '`', 'code');
    case 'link': {
      const selected = value.slice(start, end) || 'link text';
      const next =
        value.slice(0, start) + `[${selected}](url)` + value.slice(end);
      const urlStart = start + selected.length + 3;
      return {
        value: next,
        selectionStart: urlStart,
        selectionEnd: urlStart + 3,
      };
    }
    default:
      return { value, selectionStart: start, selectionEnd: end };
  }
};
