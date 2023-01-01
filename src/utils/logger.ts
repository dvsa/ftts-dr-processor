import { Context } from '@azure/functions';
import { getOperationId, Logger as AzureLogger } from '@dvsa/azure-logger';
import config from '../config';

export class Logger extends AzureLogger {
  constructor() {
    super('FTTS', config.websiteSiteName);
  }

  getOperationId(context: Context): string {
    return getOperationId(context);
  }
}

export enum BusinessTelemetryEvent {
  DR_NOTIF_AUTH_ISSUE = 'DR_NOTIF_AUTH_ISSUE', // 401 or 403 response from Notification API
  DR_NOTIF_ERROR = 'DR_NOTIF_ERROR', // 5** response from Notification API
  DR_NOTIF_REQUEST_ISSUE = 'DR_NOTIF_REQUEST_ISSUE', // other 4** response from Notification API
  NOT_WHITELISTED_URL_CALL = 'NOT_WHITELISTED_URL_CALL',

  // The following are only used in TelemetryEvents to capture various stages/status of Digital Results Messages
  DR_MESSAGE_RECEIVED = 'DR_MESSAGE_RECEIVED',
  DR_MESSAGE_VALIDATION_ERROR = 'DR_MESSAGE_VALIDATION_ERROR',
  DR_MESSAGE_PROCESSED_SUCCESSFULLY = 'DR_MESSAGE_PROCESSED_SUCCESSFULLY',
  DR_MESSAGE_PROCESSING_FAILED = 'DR_MESSAGE_PROCESSING_FAILED',
}

export const logger = new Logger();
