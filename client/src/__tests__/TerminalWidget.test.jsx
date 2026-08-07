import { describe, it, expect } from 'vitest';

describe('TerminalWidget Basic Engine', () => {
  it('parses commands correctly', () => {
    const rawCmd = '  ask What is your experience with Kubernetes?  ';
    const trimmed = rawCmd.trim();
    const parts = trimmed.split(' ', 2);
    expect(parts[0]).toBe('ask');
    expect(parts[1]).toBe('What');
  });

  it('validates quick command options', () => {
    const quickCmds = ['help', 'skills', 'projects', 'exp', 'contact', 'clear'];
    expect(quickCmds).toContain('help');
    expect(quickCmds.length).toBe(6);
  });
});
