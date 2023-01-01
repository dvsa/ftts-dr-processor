import { SARASResultBody } from '@dvsa/ftts-saras-model';
import { ResultMessage } from '../interfaces/result-message';
import { BusinessTelemetryEvent, logger } from '../utils/logger';
import { MessageValidationError } from './messageValidationError';
import {
  validateResultsMessage, validateSarasTestResult, validateSchema, ValidationError,
} from './validateSchema';

export const validateMessage = (data: ResultMessage): void => {
  const validationErrors = validateSchema(validateResultsMessage, data as unknown as Record<string, unknown>);
  if (validationErrors) {
    logAndThrow(validationErrors);
  }
  validateSarasResults(data.results);
};

const validateSarasResults = (data: SARASResultBody): void => {
  const validationErrors = validateSchema(validateSarasTestResult, data as unknown as Record<string, unknown>);
  if (validationErrors) {
    logAndThrow(validationErrors);
  }
};

const logAndThrow = (validationErrors: ValidationError[]): void => {
  logger.event(
    BusinessTelemetryEvent.DR_MESSAGE_VALIDATION_ERROR,
    'validateMessage: Result record schema validation failed',
    {
      validationErrors,
    },
  );
  throw new MessageValidationError('validateMessage: Result record schema validation failed', validationErrors);
};
