import { describe, it, expect } from 'vitest';
import { buildPrompt } from '../components/AIExaminationScreen';

describe('buildPrompt', () => {
  it('includes the state-of-life label', () => {
    const prompt = buildPrompt('married', 'recent', 'general', 'brief');
    expect(prompt).toContain('a married Catholic');
  });

  it('includes the time-since-last-confession label', () => {
    const prompt = buildPrompt('lay', 'year', 'general', 'brief');
    expect(prompt).toContain('about a year');
  });

  it('includes the focus label', () => {
    const prompt = buildPrompt('lay', 'recent', 'prayer', 'brief');
    expect(prompt).toContain('prayer and faith life');
  });

  it('includes the depth count for "brief"', () => {
    const prompt = buildPrompt('lay', 'recent', 'general', 'brief');
    expect(prompt).toContain('8 to 10');
  });

  it('includes the depth count for "thorough"', () => {
    const prompt = buildPrompt('lay', 'recent', 'general', 'thorough');
    expect(prompt).toContain('15 to 20');
  });

  it('includes JSON structure instructions', () => {
    const prompt = buildPrompt('parent', 'months', 'family', 'brief');
    expect(prompt).toContain('"categories"');
    expect(prompt).toContain('"questions"');
  });

  it('includes "Return ONLY valid JSON" instruction', () => {
    const prompt = buildPrompt('young', 'first', 'purity', 'thorough');
    expect(prompt).toContain('Return ONLY valid JSON');
  });

  it.each([
    ['lay',       'a lay Catholic'],
    ['married',   'a married Catholic'],
    ['parent',    'a Catholic parent'],
    ['single',    'a single adult Catholic'],
    ['religious', 'a religious or priest'],
    ['young',     'a young Catholic person'],
  ] as const)('state "%s" maps to prompt "%s"', (state, expected) => {
    const prompt = buildPrompt(state, 'recent', 'general', 'brief');
    expect(prompt).toContain(expected);
  });

  it.each([
    ['recent', 'a few weeks'],
    ['months', 'several months'],
    ['year',   'about a year'],
    ['long',   'several years'],
    ['first',  'never (first confession)'],
  ] as const)('time "%s" maps to prompt "%s"', (time, expected) => {
    const prompt = buildPrompt('lay', time, 'general', 'brief');
    expect(prompt).toContain(expected);
  });

  it.each([
    ['general', 'general examination of conscience'],
    ['charity', 'charity and relationships with others'],
    ['prayer',  'prayer and faith life'],
    ['work',    'work, justice, and honesty'],
    ['family',  'family duties and responsibilities'],
    ['purity',  'chastity and purity'],
  ] as const)('focus "%s" maps to prompt "%s"', (focus, expected) => {
    const prompt = buildPrompt('lay', 'recent', focus, 'brief');
    expect(prompt).toContain(expected);
  });
});
