import { program } from '../src/cli.js';

describe('CLI Command Parsing', () => {
  it('should have generate command', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate');
    expect(cmd).toBeDefined();
  });

  it('should have batch command', () => {
    const cmd = program.commands.find((c) => c.name() === 'batch');
    expect(cmd).toBeDefined();
  });

  it('should have preview command', () => {
    const cmd = program.commands.find((c) => c.name() === 'preview');
    expect(cmd).toBeDefined();
  });

  it('should have themes command', () => {
    const cmd = program.commands.find((c) => c.name() === 'themes');
    expect(cmd).toBeDefined();
  });

  it('should have formats command', () => {
    const cmd = program.commands.find((c) => c.name() === 'formats');
    expect(cmd).toBeDefined();
  });

  it('should have init command', () => {
    const cmd = program.commands.find((c) => c.name() === 'init');
    expect(cmd).toBeDefined();
  });

  it('should have doctor command', () => {
    const cmd = program.commands.find((c) => c.name() === 'doctor');
    expect(cmd).toBeDefined();
  });

  it('should have last command', () => {
    const cmd = program.commands.find((c) => c.name() === 'last');
    expect(cmd).toBeDefined();
  });

  it('should have exactly 8 commands', () => {
    expect(program.commands).toHaveLength(8);
  });

  it('generate command should have platform option', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate')!;
    const opt = cmd.options.find((o) => o.long === '--platform');
    expect(opt).toBeDefined();
  });

  it('generate command should have formats option', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate')!;
    const opt = cmd.options.find((o) => o.long === '--formats');
    expect(opt).toBeDefined();
  });

  it('generate command should have count option', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate')!;
    const opt = cmd.options.find((o) => o.long === '--count');
    expect(opt).toBeDefined();
  });

  it('generate command should have min-score option', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate')!;
    const opt = cmd.options.find((o) => o.long === '--min-score');
    expect(opt).toBeDefined();
  });

  it('generate command should have tone option', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate')!;
    const opt = cmd.options.find((o) => o.long === '--tone');
    expect(opt).toBeDefined();
  });

  it('generate command should have niche option', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate')!;
    const opt = cmd.options.find((o) => o.long === '--niche');
    expect(opt).toBeDefined();
  });

  it('generate command should have theme option', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate')!;
    const opt = cmd.options.find((o) => o.long === '--theme');
    expect(opt).toBeDefined();
  });

  it('generate command should have dry-run option', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate')!;
    const opt = cmd.options.find((o) => o.long === '--dry-run');
    expect(opt).toBeDefined();
  });

  it('generate command should have preview option', () => {
    const cmd = program.commands.find((c) => c.name() === 'generate')!;
    const opt = cmd.options.find((o) => o.long === '--preview');
    expect(opt).toBeDefined();
  });

  it('program should have version 1.0.0', () => {
    expect(program.version()).toBe('1.0.0');
  });

  it('program should have correct name', () => {
    expect(program.name()).toBe('viral');
  });
});
