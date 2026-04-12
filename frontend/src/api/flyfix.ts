/**
 * Fly-fix: POST refined debugger / analyzer issues (backend flyfix package).
 */

import { apiPost } from './client';

const REFINE_PATH = '/api/flyfix/refine-issues';

export interface FlyfixIssue {
  file: string;
  line?: number | null;
  severity: string;
  category: string;
  message: string;
  explanation: string;
  suggested_fix: string;
  rolled_up_count?: number;
}

export interface FlyfixSummary {
  critical_errors: number;
  warnings: number;
  suggestions: number;
  total_issues: number;
}

export interface FlyfixRefinedReport {
  issues: FlyfixIssue[];
  summary: FlyfixSummary;
}

export interface FlyfixInsightsGroup {
  errors?: FlyfixIssue[];
  warnings?: FlyfixIssue[];
  suggestions?: FlyfixIssue[];
}

export interface RefineIssuesRequestBody {
  repo_root?: string;
  issues?: FlyfixIssue[];
  insights?: FlyfixInsightsGroup;
  run_tsc?: boolean;
}

/** Dedupe toolchain noise and optionally run tsc --noEmit per JS workspace under repo_root. */
export async function refineIssues(body: RefineIssuesRequestBody): Promise<FlyfixRefinedReport> {
  return apiPost<FlyfixRefinedReport>(REFINE_PATH, body);
}
