import { renderTemplateString } from '../src/renderer/inject.js';
import type { TemplateVars } from '../src/types.js';

function makeVars(overrides: Partial<TemplateVars> = {}): TemplateVars {
  return {
    content: 'Test content',
    width: 1080,
    height: 1920,
    background: '#0a0a0a',
    text_color: '#ffffff',
    accent_color: '#ff3366',
    handle_color: '#666666',
    font: 'Inter',
    font_size: '56px',
    handle: '@test',
    theme: 'dark-minimal',
    ...overrides,
  };
}

describe('renderTemplateString', () => {
  it('should replace simple variables', () => {
    const template = '<div style="color: {{text_color}}">{{content}}</div>';
    const result = renderTemplateString(template, makeVars());
    expect(result).toContain('color: #ffffff');
    expect(result).toContain('Test content');
  });

  it('should replace width and height', () => {
    const template = '<div style="width: {{width}}px; height: {{height}}px"></div>';
    const result = renderTemplateString(template, makeVars());
    expect(result).toContain('width: 1080px');
    expect(result).toContain('height: 1920px');
  });

  it('should replace background', () => {
    const template = '<body style="background: {{background}}"></body>';
    const result = renderTemplateString(template, makeVars());
    expect(result).toContain('background: #0a0a0a');
  });

  it('should replace font and font_size', () => {
    const template = '<span style="font-family: {{font}}; font-size: {{font_size}}">text</span>';
    const result = renderTemplateString(template, makeVars());
    expect(result).toContain('font-family: Inter');
    expect(result).toContain('font-size: 56px');
  });

  it('should replace handle', () => {
    const template = '<div class="handle">{{handle}}</div>';
    const result = renderTemplateString(template, makeVars());
    expect(result).toContain('@test');
  });

  it('should iterate over items array', () => {
    const template = '{{#each items}}<li>{{this}}</li>{{/each}}';
    const vars = makeVars({ items: ['item1', 'item2', 'item3'] });
    const result = renderTemplateString(template, vars);
    expect(result).toContain('<li>item1</li>');
    expect(result).toContain('<li>item2</li>');
    expect(result).toContain('<li>item3</li>');
  });

  it('should iterate over messages array', () => {
    const template = '{{#each messages}}<div class="{{this.sender}}">{{this.text}}</div>{{/each}}';
    const vars = makeVars({
      messages: [
        { sender: 'them', text: 'hello' },
        { sender: 'me', text: 'hi' },
      ],
    });
    const result = renderTemplateString(template, vars);
    expect(result).toContain('class="them"');
    expect(result).toContain('hello');
    expect(result).toContain('class="me"');
    expect(result).toContain('hi');
  });

  it('should handle conditional blocks', () => {
    const template = '{{#if title}}<h1>{{title}}</h1>{{/if}}';
    const withTitle = renderTemplateString(template, makeVars({ title: 'My Title' }));
    expect(withTitle).toContain('<h1>My Title</h1>');

    const withoutTitle = renderTemplateString(template, makeVars());
    expect(withoutTitle).not.toContain('<h1>');
  });

  it('should handle rows for comparison', () => {
    const template = '{{#each rows}}<tr><td>{{this.[0]}}</td><td>{{this.[1]}}</td></tr>{{/each}}';
    const vars = makeVars({
      rows: [['left1', 'right1'], ['left2', 'right2']],
    });
    const result = renderTemplateString(template, vars);
    expect(result).toContain('<td>left1</td><td>right1</td>');
    expect(result).toContain('<td>left2</td><td>right2</td>');
  });

  it('should handle gradient backgrounds', () => {
    const template = '<body style="background: {{background}}"></body>';
    const vars = makeVars({ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' });
    const result = renderTemplateString(template, vars);
    expect(result).toContain('linear-gradient');
  });

  it('should handle special characters in content', () => {
    const template = '<div>{{content}}</div>';
    const vars = makeVars({ content: 'Test & "quotes" <tags>' });
    const result = renderTemplateString(template, vars);
    expect(result).toContain('&amp;');
    expect(result).toContain('&quot;');
  });

  it('should handle empty template', () => {
    const result = renderTemplateString('', makeVars());
    expect(result).toBe('');
  });

  it('should handle template with no variables', () => {
    const template = '<div>static content</div>';
    const result = renderTemplateString(template, makeVars());
    expect(result).toBe('<div>static content</div>');
  });
});
