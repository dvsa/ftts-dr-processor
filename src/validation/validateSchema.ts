import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import { SARASResultBodyV4 } from '@dvsa/ftts-saras-model';
import ResultsMessageSchema from './resultMessage.schema.json';
import { logger } from '../utils/logger';

const ajv = new Ajv({ allErrors: true });
ajv.addKeyword('notEmpty', {
  type: 'string',
  validate(schema: unknown, data: string, parentSchema: unknown, dataPath: string | undefined) {
    const isValid = typeof data === 'string' && data.trim() !== '';
    if (!isValid) {
      throw new Error(`Validation Error - data${dataPath || ''} String cannot be empty`);
    }
    return isValid;
  },
});
export const validateSarasTestResult = ajv.compile(SARASResultBodyV4);
export const validateResultsMessage = ajv.compile(ResultsMessageSchema);

export type ValidationError = {
  dataPath: string;
  errorMessage: string;
  params: Record<string, string>;
};

export function validateSchema(validateFunction: ValidateFunction, data: Record<string, unknown>): ValidationError[] | undefined {
  const validated = validateFunction(data);
  const validationErrors = validateFunction.errors?.length ? toErrorsArray(validateFunction.errors) : undefined;

  if (!validated) {
    logger.debug('validateSchema: Schema validation failed - data', {
      data,
      validationErrors,
    });
  }

  return validationErrors;
}

const toErrorsArray = (ajvErrors: ErrorObject[]): ValidationError[] => ajvErrors.map((error) => ({
  dataPath: error.dataPath,
  errorMessage: error.message ?? 'unknown',
  params: error.params as Record<string, string>,
}));
