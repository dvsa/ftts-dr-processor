/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import axios, { AxiosInstance, AxiosError } from 'axios';
import axiosRetry, { isNetworkError, isRetryableError } from 'axios-retry';

import { RetryPolicy } from '../config';
import { calculateRetryDelay, CustomAxiosError, is429Error } from './axios-retry-client-helper';

export class AxiosRetryClient {
  axiosRetryClient: AxiosInstance;

  constructor(private retryPolicy: RetryPolicy) {
    this.axiosRetryClient = axios.create();
    this.setupAxiosRetry();
  }

  public getClient(): AxiosInstance {
    return this.axiosRetryClient;
  }

  private setupAxiosRetry() {
    axiosRetry(this.axiosRetryClient, {
      retries: this.retryPolicy.maxRetries,
      // Retry if network/connection error, 5xx response or 429 response
      retryCondition: (err: Error | CustomAxiosError) => isNetworkError(err as Error) || isRetryableError(err as Error) || is429Error(err as CustomAxiosError),
      retryDelay: (retryCount: number, err: AxiosError) => calculateRetryDelay(retryCount, err, this.retryPolicy),
    });
  }
}
