import { formatAirportPath, formatFlightTimeRange, isolateLTR, LRI, PDI } from './bidi';

describe('bidi', () => {
  it('wraps LTR isolate', () => {
    expect(isolateLTR('TLV')).toBe(`${LRI}TLV${PDI}`);
  });

  it('keeps forward arrow in time range', () => {
    expect(formatFlightTimeRange('07:20', '11:35')).toContain('07:20 → 11:35');
  });

  it('keeps airport order', () => {
    const s = formatAirportPath(['TLV', 'FRA', 'KIN']);
    expect(s).toContain('TLV › FRA › KIN');
  });
});