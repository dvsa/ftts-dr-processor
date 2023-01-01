import { BusinessTelemetryEvent } from '../../../src/utils/logger';
import { MessageValidationError } from '../../../src/validation/messageValidationError';
import { validateMessage } from '../../../src/validation/validateMessage';
import { validateSchema } from '../../../src/validation/validateSchema';
import { mockedLogger } from '../../mocks/logger.mock';
import { mockedResultMessage } from '../../mocks/result-message.mock';

jest.mock('../../../src/utils/logger');
jest.mock('../../../src/validation/validateSchema');
const mockedValidateSchema = jest.mocked(validateSchema, true);

const message = mockedResultMessage();
describe('validateMessage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('for valid schema no error is thrown', () => {
    validateMessage(message);

    expect(mockedLogger.event).not.toHaveBeenCalled();
  });

  test('for invalid message error is thrown', () => {
    const validationErrors = [];
    mockedValidateSchema.mockReturnValue(validationErrors);
    const expectedError = new MessageValidationError('validateMessage: Result record schema validation failed', validationErrors);

    expect(() => validateMessage(message)).toThrow(expectedError);
    expect(mockedLogger.event).toHaveBeenCalledWith(
      BusinessTelemetryEvent.DR_MESSAGE_VALIDATION_ERROR,
      'validateMessage: Result record schema validation failed',
      {
        validationErrors,
      },
    );
  });

  test('for invalid saras result error is thrown', () => {
    const validationErrors = [];
    mockedValidateSchema.mockReturnValueOnce(undefined);
    mockedValidateSchema.mockReturnValueOnce(validationErrors);
    const expectedError = new MessageValidationError('validateMessage: Result record schema validation failed', validationErrors);

    expect(() => validateMessage(message)).toThrow(expectedError);
    expect(mockedLogger.event).toHaveBeenCalledWith(
      BusinessTelemetryEvent.DR_MESSAGE_VALIDATION_ERROR,
      'validateMessage: Result record schema validation failed',
      {
        validationErrors,
      },
    );
  });
});
