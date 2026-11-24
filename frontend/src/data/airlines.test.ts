/**
 * Run: npx --yes tsx src/data/airlines.test.ts
 */
import { iataFromAirlineName, resolveCarrierCode, resolveAirlineLabel } from './airlines';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(iataFromAirlineName('Condor') === 'DE', 'Condor → DE');
assert(iataFromAirlineName('Austrian Airlines') === 'OS', 'Austrian → OS');
assert(resolveCarrierCode('', 'Condor') === 'DE', 'empty code + Condor name');
assert(resolveCarrierCode('DE', 'Condor') === 'DE', 'keep IATA');
assert(resolveAirlineLabel('', 'Condor') === 'Condor', 'label from name');
assert(resolveAirlineLabel('DE', '') === 'Condor', 'label from code');

console.log('airlines.test.ts: OK');
