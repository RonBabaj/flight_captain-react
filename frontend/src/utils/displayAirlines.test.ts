/**
 * Run: npx --yes tsx src/utils/displayAirlines.test.ts
 */
import { displayAirlineLabel, distinctMarketingCarriers } from './displayAirlines';
import type { FlightOption } from '../types';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

const option = {
  legs: [
    {
      segments: [
        {
          marketingCarrier: { code: '', name: 'Condor' },
          from: { code: 'TLV' },
          to: { code: 'VIE' },
        },
      ],
    },
    {
      segments: [
        {
          marketingCarrier: { code: '', name: 'Condor' },
          from: { code: 'VIE' },
          to: { code: 'TLV' },
        },
      ],
    },
  ],
} as FlightOption;

assert(distinctMarketingCarriers(option).join(',') === 'DE', 'resolve Condor name → DE');
assert(displayAirlineLabel(option) === 'Condor', 'show Condor not blank');

console.log('displayAirlines.test.ts: OK');
