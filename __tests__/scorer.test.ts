import { calculateViralityScore } from '../src/generator/scorer.js';

describe('calculateViralityScore', () => {
  it('should calculate weighted score correctly', () => {
    const score = calculateViralityScore({
      specificity: 1.0,
      tension: 1.0,
      emotion: 1.0,
      zero_friction: 1.0,
      tag_target: 1.0,
    });
    // (1*0.30 + 1*0.25 + 1*0.20 + 1*0.15 + 1*0.10) * 100 = 100
    expect(score).toBe(100);
  });

  it('should return 0 for all zeros', () => {
    const score = calculateViralityScore({
      specificity: 0,
      tension: 0,
      emotion: 0,
      zero_friction: 0,
      tag_target: 0,
    });
    expect(score).toBe(0);
  });

  it('should weight specificity highest (0.30)', () => {
    const scoreHigh = calculateViralityScore({
      specificity: 1.0,
      tension: 0,
      emotion: 0,
      zero_friction: 0,
      tag_target: 0,
    });
    expect(scoreHigh).toBe(30);
  });

  it('should weight tension at 0.25', () => {
    const score = calculateViralityScore({
      specificity: 0,
      tension: 1.0,
      emotion: 0,
      zero_friction: 0,
      tag_target: 0,
    });
    expect(score).toBe(25);
  });

  it('should weight emotion at 0.20', () => {
    const score = calculateViralityScore({
      specificity: 0,
      tension: 0,
      emotion: 1.0,
      zero_friction: 0,
      tag_target: 0,
    });
    expect(score).toBe(20);
  });

  it('should weight zero_friction at 0.15', () => {
    const score = calculateViralityScore({
      specificity: 0,
      tension: 0,
      emotion: 0,
      zero_friction: 1.0,
      tag_target: 0,
    });
    expect(score).toBe(15);
  });

  it('should weight tag_target at 0.10', () => {
    const score = calculateViralityScore({
      specificity: 0,
      tension: 0,
      emotion: 0,
      zero_friction: 0,
      tag_target: 1.0,
    });
    expect(score).toBe(10);
  });

  it('should round to nearest integer', () => {
    const score = calculateViralityScore({
      specificity: 0.73,
      tension: 0.81,
      emotion: 0.65,
      zero_friction: 0.90,
      tag_target: 0.55,
    });
    // (0.73*0.30 + 0.81*0.25 + 0.65*0.20 + 0.90*0.15 + 0.55*0.10) * 100
    // = (0.219 + 0.2025 + 0.13 + 0.135 + 0.055) * 100
    // = 0.7415 * 100 = 74.15 -> 74
    expect(score).toBe(74);
  });

  it('should handle mid-range values', () => {
    const score = calculateViralityScore({
      specificity: 0.5,
      tension: 0.5,
      emotion: 0.5,
      zero_friction: 0.5,
      tag_target: 0.5,
    });
    expect(score).toBe(50);
  });

  it('should handle mixed high and low values', () => {
    const score = calculateViralityScore({
      specificity: 0.9,
      tension: 0.1,
      emotion: 0.9,
      zero_friction: 0.1,
      tag_target: 0.9,
    });
    // (0.9*0.30 + 0.1*0.25 + 0.9*0.20 + 0.1*0.15 + 0.9*0.10) * 100
    // = (0.27 + 0.025 + 0.18 + 0.015 + 0.09) * 100
    // = 0.58 * 100 = 58
    expect(score).toBe(58);
  });

  it('should produce score >= 70 for good content', () => {
    const score = calculateViralityScore({
      specificity: 0.8,
      tension: 0.8,
      emotion: 0.8,
      zero_friction: 0.7,
      tag_target: 0.7,
    });
    expect(score).toBeGreaterThanOrEqual(70);
  });
});
