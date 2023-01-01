import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { logger } from './logger';
import { RetryPolicy } from '../config';

export type CustomAxiosError = {
  isAxiosError?: boolean;
  response?: {
    data?: unknown;
    status?: number;
  };
};

export function is429Error(err: CustomAxiosError): boolean {
  return err.response?.status === 429;
}

export function parseRetryAfter(header: string): number | undefined {
  // Header value may be a string containing number of *seconds*
  const parsed = parseFloat(header);
  if (!Number.isNaN(parsed) && parsed >= 0) {
    return parsed * 1000;
  }
  // Or a date in http datetime string format
  const date = dayjs(header);
  if (date.isValid()) {
    const now = dayjs();
    const diff = date.diff(now, 'ms');
    if (diff >= 0) {
      return diff;
    }
  }
  return undefined; // Otherwise invalid
}

export function calculateRetryDelay(retryCount: number, err: AxiosError, retryPolicy: RetryPolicy):number {
  let delay = retryPolicy.exponentialBackoff ? retryPolicy.defaultRetryDelay * retryCount : retryPolicy.defaultRetryDelay;
  if (is429Error(err)) {
    const retryAfterHeader = err.response?.headers?.['retry-after'];
    if (retryAfterHeader) {
      delay = parseRetryAfter(retryAfterHeader) ?? retryPolicy.defaultRetryDelay;
      if (delay > retryPolicy.maxRetryAfter) {
        throw err;
      }
    }
  }
  const method = err.config?.method || '<unknown>';
  const url = err.config?.url || '<unknown>';
  logger.warn(`axiosRetryClientHelper::calculateRetryDelay:Retrying failed ${method} request to ${url} - attempt ${retryCount} of ${retryPolicy.maxRetries}`, {
    error: err.toString(),
    status: err.response?.status,
    url: err.config?.url,
    retryDelayMs: delay,
  });

  return delay;
}
