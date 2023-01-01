import { SARASTextLanguage } from '@dvsa/ftts-saras-model';
import { processResult } from '../../../src/resultProcessor/processResult';
import { buildEmailContent } from '../../../src/services/notifications/content/builders';
import { notificationsGateway } from '../../../src/services/notifications/notifications-gateway';
import { BusinessTelemetryEvent } from '../../../src/utils/logger';
import { validateMessage } from '../../../src/validation/validateMessage';
import { mockedResultMessage } from '../../mocks/result-message.mock';
import { mockedLogger } from '../../mocks/logger.mock';
import { MessageValidationError } from '../../../src/validation/messageValidationError';
import { getIdentifiers } from '../../../src/utils/identifiers';
import '../../../src/dayjs-config';
import config from '../../../src/config';
import { EmailCategory, NotificationLanguage, Target } from '../../../src/interfaces/enums';

jest.mock('../../../src/services/notifications/notifications-gateway');
jest.mock('../../../src/utils/logger');
const mockedNotificationsGateway = jest.mocked(notificationsGateway, true);

jest.mock('../../../src/validation/validateMessage');
const mockedValidateMessage = jest.mocked(validateMessage, true);

const resultMessage = mockedResultMessage();

jest.mock('../../../src/config');
const mockedConfig = jest.mocked(config);

describe('processResult', () => {
  afterEach(() => {
    jest.resetAllMocks();
    mockedConfig.disableSuccessEventLogs = false;
  });

  describe('when using sendEmail', () => {
    test('for valid message email is sent', async () => {
      await processResult(resultMessage);

      expect(mockedNotificationsGateway.sendEmail).toHaveBeenCalled();
      expect(mockedLogger.error).not.toHaveBeenCalled();
    });

    test('for invalid message email is not sent and error thrown', async () => {
      const expectedError = new MessageValidationError('failed', []);
      mockedValidateMessage.mockImplementation(() => { throw expectedError; });

      await expect(processResult(resultMessage)).rejects.toThrow(expectedError);

      expect(mockedNotificationsGateway.sendEmail).not.toHaveBeenCalled();
    });

    test('for valid message and failed notification service email is not sent and error is thrown', async () => {
      const expectedError = new Error('notification failed');
      mockedNotificationsGateway.sendEmail.mockImplementation(() => { throw expectedError; });

      await expect(processResult(resultMessage)).rejects.toThrow(expectedError);
    });

    test('when happy-path, should call logger.event and notificationsGateway.sendEmail with the right params', async () => {
      const { subject, body } = buildEmailContent(resultMessage);
      await processResult(resultMessage);

      expect(mockedLogger.event).toHaveBeenNthCalledWith(
        1,
        BusinessTelemetryEvent.DR_MESSAGE_RECEIVED,
        'processResult:: sending results as email',
        {
          ...getIdentifiers(resultMessage),
          testEndTime: '2022-09-12T15:50:00.000Z',
        },
      );

      expect(mockedLogger.event).toHaveBeenNthCalledWith(
        2,
        BusinessTelemetryEvent.DR_MESSAGE_PROCESSED_SUCCESSFULLY,
        'processResult:: result processed successfully',
        {
          ...getIdentifiers(resultMessage),
          testEndTime: '2022-09-12T15:50:00.000Z',
        },
      );

      expect(notificationsGateway.sendEmail).toHaveBeenCalledWith(
        resultMessage.email,
        {
          subject,
          body,
        },
        resultMessage.tracing.trace_id,
        'gb',
      );
    });

    test('should not call logger.event when config.enabledLogs is false', async () => {
      const digitalResults = mockedResultMessage();
      mockedConfig.disableSuccessEventLogs = true;
      await processResult(digitalResults);

      expect(mockedLogger.event).not.toHaveBeenCalled();
    });

    test('when notificationsGateway.sendEmail throws exception, should throw exception', async () => {
      const testException = new Error('Test exception');
      mockedNotificationsGateway.sendEmail.mockImplementation(() => Promise.reject(testException));
      const digitalResults = mockedResultMessage();

      await expect(processResult(digitalResults)).rejects.toThrow(testException);
      expect(mockedLogger.event).toHaveBeenNthCalledWith(
        1,
        BusinessTelemetryEvent.DR_MESSAGE_RECEIVED,
        'processResult:: sending results as email',
        {
          ...getIdentifiers(digitalResults),
          testEndTime: '2022-09-12T15:50:00.000Z',
        },
      );
      expect(mockedLogger.event).toHaveBeenNthCalledWith(
        2,
        BusinessTelemetryEvent.DR_MESSAGE_PROCESSING_FAILED,
        'processResult:: result processing failed',
        {
          ...getIdentifiers(digitalResults),
        },
      );
      expect(mockedLogger.error).toHaveBeenCalledWith(
        testException,
        'processResult:: failed to process results',
        {
          message: testException.message,
          appointmentId: 'fake-appointment-id',
          candidateId: '4ddab30e-f90e-eb11-a813-000d3a7f128d',
          context_id: 'fake-context-id',
          reference: 'fake-reference',
          trace_id: 'fake-trace-id',
        },
      );
    });
  });

  describe('when using sendNotification', () => {
    beforeAll(() => {
      mockedConfig.featureToggle.enableSendEmailsUsingSendNotificationEndpoint = true;
    });

    test('for valid message email notification is sent', async () => {
      await processResult(resultMessage);

      const {
        bookingId, tracing, target, email,
      } = resultMessage;
      expect(mockedNotificationsGateway.sendNotification).toHaveBeenCalledWith(
        bookingId,
        tracing.bookingProductId,
        target,
        NotificationLanguage.ENGLISH,
        EmailCategory.DIGITAL_RESULTS_PASS,
        email,
        tracing.AppointmentId,
        tracing.trace_id,
      );
      expect(mockedLogger.error).not.toHaveBeenCalled();
    });

    test('for valid message with different sarasTextLanguage email notification is sent', async () => {
      resultMessage.results.TestInformation.TextLanguage = SARASTextLanguage.WELSH;
      await processResult(resultMessage);

      const {
        bookingId, tracing, target, email,
      } = resultMessage;
      expect(mockedNotificationsGateway.sendNotification).toHaveBeenCalledWith(
        bookingId,
        tracing.bookingProductId,
        target,
        NotificationLanguage.WELSH,
        EmailCategory.DIGITAL_RESULTS_PASS,
        email,
        tracing.AppointmentId,
        tracing.trace_id,
      );
      expect(mockedLogger.error).not.toHaveBeenCalled();
    });

    test('for valid message with different target email notification is sent', async () => {
      resultMessage.target = Target.NI;
      await processResult(resultMessage);

      const {
        bookingId, tracing, target, email,
      } = resultMessage;
      expect(mockedNotificationsGateway.sendNotification).toHaveBeenCalledWith(
        bookingId,
        tracing.bookingProductId,
        target,
        NotificationLanguage.WELSH,
        EmailCategory.DIGITAL_RESULTS_PASS,
        email,
        tracing.AppointmentId,
        tracing.trace_id,
      );
      expect(mockedLogger.error).not.toHaveBeenCalled();
    });

    test('for invalid message email notification is not sent and error thrown', async () => {
      const expectedError = new MessageValidationError('failed', []);
      mockedValidateMessage.mockImplementation(() => { throw expectedError; });

      await expect(processResult(resultMessage)).rejects.toThrow(expectedError);

      expect(mockedNotificationsGateway.sendNotification).not.toHaveBeenCalled();
    });

    test('for valid message and failed notification service email notification is not sent and error is thrown', async () => {
      const expectedError = new Error('notification failed');
      mockedNotificationsGateway.sendNotification.mockImplementation(() => { throw expectedError; });

      await expect(processResult(resultMessage)).rejects.toThrow(expectedError);
    });

    test('when happy-path, should call logger.event and notificationsGateway.sendNotification with the right params', async () => {
      await processResult(resultMessage);

      expect(mockedLogger.event).toHaveBeenNthCalledWith(
        1,
        BusinessTelemetryEvent.DR_MESSAGE_RECEIVED,
        'processResult:: sending results as email',
        {
          ...getIdentifiers(resultMessage),
          testEndTime: '2022-09-12T15:50:00.000Z',
        },
      );

      expect(mockedLogger.event).toHaveBeenNthCalledWith(
        2,
        BusinessTelemetryEvent.DR_MESSAGE_PROCESSED_SUCCESSFULLY,
        'processResult:: result processed successfully',
        {
          ...getIdentifiers(resultMessage),
          testEndTime: '2022-09-12T15:50:00.000Z',
        },
      );

      expect(notificationsGateway.sendNotification).toHaveBeenCalledWith(
        'mockBookingId',
        'fake-booking-product-id',
        'ni',
        'Welsh',
        'digital-results-pass',
        'email@company.com',
        'fake-appointment-id',
        'fake-trace-id',
      );
    });

    test('should not call logger.event when config.enabledLogs is false', async () => {
      const digitalResults = mockedResultMessage();
      mockedConfig.disableSuccessEventLogs = true;
      await processResult(digitalResults);

      expect(mockedLogger.event).not.toHaveBeenCalled();
    });

    test('when notificationsGateway.sendNotification throws exception, should throw exception', async () => {
      const testException = new Error('Test exception');
      mockedNotificationsGateway.sendNotification.mockImplementation(() => Promise.reject(testException));
      const digitalResults = mockedResultMessage();

      await expect(processResult(digitalResults)).rejects.toThrow(testException);
      expect(mockedLogger.event).toHaveBeenNthCalledWith(
        1,
        BusinessTelemetryEvent.DR_MESSAGE_RECEIVED,
        'processResult:: sending results as email',
        {
          ...getIdentifiers(digitalResults),
          testEndTime: '2022-09-12T15:50:00.000Z',
        },
      );
      expect(mockedLogger.event).toHaveBeenNthCalledWith(
        2,
        BusinessTelemetryEvent.DR_MESSAGE_PROCESSING_FAILED,
        'processResult:: result processing failed',
        {
          ...getIdentifiers(digitalResults),
        },
      );
      expect(mockedLogger.error).toHaveBeenCalledWith(
        testException,
        'processResult:: failed to process results',
        {
          message: testException.message,
          appointmentId: 'fake-appointment-id',
          candidateId: '4ddab30e-f90e-eb11-a813-000d3a7f128d',
          context_id: 'fake-context-id',
          reference: 'fake-reference',
          trace_id: 'fake-trace-id',
        },
      );
    });
  });
});
