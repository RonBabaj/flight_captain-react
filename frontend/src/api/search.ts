/**
 * Flight search session API. Endpoints per backend contract.
 */

import {
  CreateSearchSessionRequest,
  SearchSession,
  SearchSessionResultsResponse,
} from '../types';
import { apiGet, apiPost } from './client';

const SESSIONS_PATH = '/api/search/sessions';

/** Create a new search session (stub: placeholder endpoint). */
export async function createSearchSession(
  params: CreateSearchSessionRequest
): Promise<SearchSession> {
  const session = await apiPost<SearchSession>(SESSIONS_PATH, params);
  return session;
}

/** Get session status and results; optional sinceVersion for incremental. */
export async function getSearchSessionResults(
  sessionId: string,
  sinceVersion?: number
): Promise<SearchSessionResultsResponse> {
  const query = sinceVersion != null ? `?sinceVersion=${sinceVersion}` : '';
  return apiGet<SearchSessionResultsResponse>(
    `${SESSIONS_PATH}/${sessionId}${query}`
  );
}

/** Cancel search session (optional, MVP+). */
export async function cancelSearchSession(sessionId: string): Promise<void> {
  await apiPost(`${SESSIONS_PATH}/${sessionId}/cancel`, {});
}
