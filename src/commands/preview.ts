import chalk from 'chalk';
import { renderTemplate } from '../renderer/inject.js';
import { PLATFORMS, getThemeColors } from '../config/platforms.js';
import { calculateFontSize } from '../config/platforms.js';
import type { Format, TemplateVars } from '../types.js';

const DUMMY_DATA: Record<Format, Partial<TemplateVars>> = {
  'relatable': {
    content: 'When you finally fix the bug and realize you caused 3 more',
  },
  'hot-take': {
    content: 'Most productivity advice is just procrastination with extra steps',
  },
  'comparison': {
    content: 'Expectation vs Reality',
    left_label: 'What I planned',
    right_label: 'What happened',
    rows: [
      ['8 hours of deep work', 'Meetings all day'],
      ['Ship the feature', 'Debug CSS'],
      ['Learn Rust', 'Watch tutorials'],
      ['Gym at 6am', 'Snoozed 4 times'],
    ],
  },
  'fake-tweet': {
    content: 'just mass renamed all my variables to "thing" and somehow the code still works',
    name: 'Developer Thoughts',
    handle_name: '@devthoughts',
    likes: '14.2K',
    retweets: '2.1K',
  },
  'fake-text': {
    content: 'Them: Can you fix this real quick? Me: Define "real quick"',
    messages: [
      { sender: 'them', text: 'hey can you fix this real quick?' },
      { sender: 'me', text: 'define "real quick"' },
      { sender: 'them', text: 'like 5 minutes' },
      { sender: 'me', text: 'it took you 3 weeks to write it' },
    ],
  },
  'list-card': {
    content: 'Things They Dont Tell You About Remote Work',
    title: 'Things They Dont Tell You About Remote Work',
    items: [
      'Your commute is now 10 steps to the couch',
      'Pants become optional after week 2',
      'You will talk to your plants',
      'Lunch break is now a nap break',
      'Nobody knows youre working from bed',
      'The fridge calls your name every hour',
    ],
  },
  'quote-card': {
    content: 'The code you write today is the legacy code of tomorrow',
  },
  'roast': {
    content: 'Signs you are a Senior Developer',
    title: 'Signs you are a Senior Developer',
    items: [
      'You Google the same thing 3 times a day',
      'Stack Overflow is your spirit animal',
      'You fear your own code from 6 months ago',
      'You have opinions about tabs vs spaces',
      'Your git history is a crime scene',
      'You refactor code instead of sleeping',
      'You say "it works on my machine" unironically',
    ],
  },
};

export async function runPreview(format: Format): Promise<void> {
  const dims = PLATFORMS.tiktok;
  const colors = getThemeColors('dark-minimal');
  const dummyContent = DUMMY_DATA[format];

  if (!dummyContent) {
    console.error(chalk.red(`Unknown format: ${format}`));
    process.exit(1);
  }

  const vars: TemplateVars = {
    content: dummyContent.content || 'Preview content',
    width: dims.width,
    height: dims.height,
    background: colors.background,
    text_color: colors.text_color,
    accent_color: colors.accent_color,
    handle_color: colors.handle_color,
    font: 'Inter',
    font_size: calculateFontSize(dummyContent.content?.length || 50),
    handle: '@viral',
    theme: 'dark-minimal',
    ...dummyContent,
  };

  const templateMap: Record<Format, string> = {
    'relatable': 'relatable',
    'hot-take': 'hot-take',
    'comparison': 'comparison',
    'fake-tweet': 'fake-tweet',
    'fake-text': 'fake-text',
    'list-card': 'list-card',
    'quote-card': 'quote-card',
    'roast': 'roast-checklist',
  };

  try {
    const html = await renderTemplate(templateMap[format], vars);
    console.log(html);
    console.log(chalk.green(`\nTemplate rendered for format: ${format}`));
  } catch (error) {
    console.error(chalk.red(`Preview failed: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}
