import assert from 'node:assert/strict';
import type { BookingResolveResponse } from '../api/booking';
import {
  bookingResolveErrorMessage,
  bookingResolveFetchErrorMessage,
} from './bookingResolveMessage';

const t = (key: string) => key;

const base: BookingResolveResponse = {
  found: false,
  status: 'not_found',
};

assert.equal(
  bookingResolveErrorMessage({ ...base, status: 'not_found' }, t),
  'no_verified_booking',
);
assert.equal(
  bookingResolveErrorMessage(
    { ...base, status: 'not_found', message: 'Custom not found' },
    t,
  ),
  'Custom not found',
);
assert.equal(
  bookingResolveErrorMessage({ ...base, status: 'search_unavailable' }, t),
  'booking_search_unavailable',
);
assert.equal(
  bookingResolveErrorMessage(
    {
      ...base,
      status: 'search_unavailable',
      message: 'Booking lookup is busy. Please try again in a moment.',
    },
    t,
  ),
  'Booking lookup is busy. Please try again in a moment.',
);
assert.equal(
  bookingResolveErrorMessage({ ...base, status: 'timeout' }, t),
  'booking_search_timeout',
);
assert.equal(
  bookingResolveFetchErrorMessage(new Error('Booking search timed out. Please try again.'), t),
  'booking_search_timeout',
);
assert.equal(
  bookingResolveFetchErrorMessage(new Error('failed to fetch'), t),
  'booking_search_unavailable',
);

console.log('bookingResolveMessage.test.ts: ok');