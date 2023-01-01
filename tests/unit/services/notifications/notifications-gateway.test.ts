import { AxiosError, AxiosStatic } from 'axios';
import { mock } from 'jest-mock-extended';
import { ManagedIdentityAuth } from '../../../../src/services/auth/managed-identity-auth';
import { NotificationsGateway } from '../../../../src/services/notifications/notifications-gateway';
import { BusinessTelemetryEvent, logger } from '../../../../src/utils/logger';
import { EmailContent } from '../../../../src/interfaces/email';
import config from '../../../../src/config';
import mocked = jest.mocked;
import {
  Agency, EmailCategory, NotificationLanguage, Target,
} from '../../../../src/interfaces/enums';

const mockedAxios = jest.createMockFromModule<jest.Mocked<AxiosStatic>>('axios');

jest.mock('../../../../src/services/auth/managed-identity-auth');
const mockedManagedIdentityAuth = mock<ManagedIdentityAuth>();

jest.mock('../../../../src/config');
const mockedConfig = mocked(config);

describe('Notifications API gateway', () => {
  let notifications: NotificationsGateway;

  const mockNotificationsUrl = 'notifications.com/notification/';
  const mockContextId = 'BOOKING-APP';
  const mockBookingRef = '12345';
  const mockAccessToken = { value: '1234-5678' };
  const mockEmailAddress = 'mock@email.com';
  const mockEmailContent: EmailContent = {
    subject: 'mockSubject',
    body: 'mockBody',
  };
  const mockTarget = Target.GB;
  const mockBookingId = 'mockBookingId';
  const mockProductBookingId = 'mockProductBookingId';
  const mockLanguage = NotificationLanguage.ENGLISH;

  beforeEach(() => {
    mockedManagedIdentityAuth.getAuthHeader.mockResolvedValue({
      headers: {
        Authorization: `Bearer ${mockAccessToken.value}`,
      },
    });

    notifications = new NotificationsGateway(
      mockedManagedIdentityAuth,
      mockedAxios,
      mockNotificationsUrl,
      mockContextId,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('sendEmail', () => {
    test('should send a request with correct email payload and auth headers set', async () => {
      await notifications.sendEmail(mockEmailAddress, mockEmailContent, mockBookingRef, mockTarget);

      const expectedUrl = `${mockNotificationsUrl}email`;
      const expectedPayload = {
        email_address: mockEmailAddress,
        reference: mockBookingRef,
        target: mockTarget,
        message_subject: mockEmailContent.subject,
        message_content: mockEmailContent.body,
        context_id: mockContextId,
      };
      const expectedConfig = { headers: { Authorization: `Bearer ${mockAccessToken.value}` } };
      expect(mockedAxios.post).toHaveBeenCalledWith(expectedUrl, expectedPayload, expectedConfig);
    });

    test('should log and rethrow if request fails without http code', async () => {
      mockedAxios.post.mockImplementationOnce(() => {
        throw Error('ntf error');
      });

      await expect(notifications.sendEmail('mock@email.com', mockEmailContent, mockBookingRef, Target.GB)).rejects.toThrow();

      expect(logger.error).toHaveBeenCalledWith(Error('ntf error'), 'NotificationsGateway::sendEmail: Notification API send email request failed');
    });

    test.each([
      [401, BusinessTelemetryEvent.DR_NOTIF_AUTH_ISSUE],
      [403, BusinessTelemetryEvent.DR_NOTIF_AUTH_ISSUE],
      [500, BusinessTelemetryEvent.DR_NOTIF_ERROR],
      [503, BusinessTelemetryEvent.DR_NOTIF_ERROR],
      [400, BusinessTelemetryEvent.DR_NOTIF_REQUEST_ISSUE],
      [404, BusinessTelemetryEvent.DR_NOTIF_REQUEST_ISSUE],
    ])('when valid non successful http response, should log an event', async (statusCode: number, expectedEvent: BusinessTelemetryEvent) => {
      const axiosError = new AxiosError(
        'fail',
        'code',
        undefined,
        undefined,
        {
          config: { },
          data: {},
          headers: {},
          status: statusCode,
          statusText: '',
        },
      );
      mockedAxios.post.mockRejectedValueOnce(axiosError);

      await expect(notifications.sendEmail('mock@email.com', mockEmailContent, mockBookingRef, Target.GB)).rejects.toThrow();

      expect(logger.event).toHaveBeenCalledWith(
        expectedEvent,
        'NotificationsGateway::sendEmail: Notification API send email request failed',
        {
          reference: mockBookingRef,
          error: axiosError.toString(),
          status: axiosError.response?.status,
          response: axiosError.response?.data,
        },
      );
    });

    test('when getToken fails throw an error', async () => {
      const expectedError = new Error('failed to get token');
      mockedManagedIdentityAuth.getAuthHeader.mockRejectedValueOnce(expectedError);

      await expect(notifications.sendEmail('mock@email.com', mockEmailContent, mockBookingRef, Target.GB)).rejects.toThrow(expectedError);
    });
  });

  describe('sendNotification', () => {
    beforeAll(() => {
      mockedConfig.featureToggle.enableSendEmailsUsingSendNotificationEndpoint = true;
    });

    test('should send a request with correct email payload and auth headers set', async () => {
      await notifications.sendNotification(mockBookingId, mockProductBookingId, mockTarget, mockLanguage, EmailCategory.DIGITAL_RESULTS_PASS, mockEmailAddress, mockBookingRef, mockContextId);

      const expectedUrl = `${mockNotificationsUrl}send-notification`;
      const expectedPayload = {
        bookingId: mockBookingId,
        bookingProductId: mockProductBookingId,
        channel: 'email',
        agency: Agency.DVSA,
        language: 'English',
        category: EmailCategory.DIGITAL_RESULTS_PASS,
        email_address: mockEmailAddress,
        reference: mockBookingRef,
        context_id: mockContextId,
      };
      const expectedConfig = { headers: { Authorization: `Bearer ${mockAccessToken.value}` } };
      expect(mockedAxios.post).toHaveBeenCalledWith(expectedUrl, expectedPayload, expectedConfig);
    });

    test('should log and rethrow if request fails without http code', async () => {
      mockedAxios.post.mockImplementationOnce(() => {
        throw Error('ntf error');
      });

      await expect(notifications.sendNotification(
        mockBookingId,
        mockProductBookingId,
        mockTarget,
        mockLanguage,
        EmailCategory.DIGITAL_RESULTS_PASS,
        mockEmailAddress,
        mockBookingRef,
        mockContextId,
      )).rejects.toThrow();

      expect(logger.error).toHaveBeenCalledWith(Error('ntf error'), 'NotificationsGateway::sendNotification: Notification API send email notification request failed');
    });

    test.each([
      [401, BusinessTelemetryEvent.DR_NOTIF_AUTH_ISSUE],
      [403, BusinessTelemetryEvent.DR_NOTIF_AUTH_ISSUE],
      [500, BusinessTelemetryEvent.DR_NOTIF_ERROR],
      [503, BusinessTelemetryEvent.DR_NOTIF_ERROR],
      [400, BusinessTelemetryEvent.DR_NOTIF_REQUEST_ISSUE],
      [404, BusinessTelemetryEvent.DR_NOTIF_REQUEST_ISSUE],
    ])('when valid non successful http response, should log an event', async (statusCode: number, expectedEvent: BusinessTelemetryEvent) => {
      const axiosError = new AxiosError(
        'fail',
        'code',
        undefined,
        undefined,
        {
          config: { },
          data: {},
          headers: {},
          status: statusCode,
          statusText: '',
        },
      );
      mockedAxios.post.mockRejectedValueOnce(axiosError);

      await expect(notifications.sendNotification(
        mockBookingId,
        mockProductBookingId,
        mockTarget,
        mockLanguage,
        EmailCategory.DIGITAL_RESULTS_PASS,
        mockEmailAddress,
        mockBookingRef,
        mockContextId,
      )).rejects.toThrow();

      expect(logger.event).toHaveBeenCalledWith(
        expectedEvent,
        'NotificationsGateway::sendNotification: Notification API send email notification request failed',
        {
          reference: mockBookingRef,
          error: axiosError.toString(),
          status: axiosError.response?.status,
          response: axiosError.response?.data,
        },
      );
    });

    test('when getToken fails throw an error', async () => {
      const expectedError = new Error('failed to get token');
      mockedManagedIdentityAuth.getAuthHeader.mockRejectedValueOnce(expectedError);

      await expect(notifications.sendNotification(
        mockBookingId,
        mockProductBookingId,
        mockTarget,
        mockLanguage,
        EmailCategory.DIGITAL_RESULTS_PASS,
        mockEmailAddress,
        mockBookingRef,
        mockContextId,
      )).rejects.toThrow(Error('failed to get token'));
    });
  });
});
