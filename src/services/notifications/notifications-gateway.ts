import { AxiosError } from 'axios';
import config from '../../config';
import { EmailContent } from '../../interfaces/email';
import { AxiosRetryClient } from '../../utils/axios-retry-client';
import { BusinessTelemetryEvent, logger } from '../../utils/logger';
import { AuthHeader, ManagedIdentityAuth } from '../auth/managed-identity-auth';
import {
  Agency, EmailCategory, NotificationLanguage, Target,
} from '../../interfaces/enums';

const EMAIL_ENDPOINT = 'email';
type EmailPayload = {
  email_address: string;
  message_subject: string;
  message_content: string;
  reference: string;
  target: Target;
  context_id: string;
};

const NOTIFICATION_ENDPOINT = 'send-notification';
type NotificationPayload = {
  bookingId: string;
  bookingProductId: string;
  channel: 'email';
  agency: Agency;
  language: NotificationLanguage;
  category: EmailCategory;
  email_address: string;
  reference: string;
  context_id: string;
};

type Payload = EmailPayload | NotificationPayload;

class NotificationsGateway {
  constructor(
    private auth: ManagedIdentityAuth,
    private axiosRetryClient = new AxiosRetryClient(config.notification.retryPolicy).getClient(),
    private apiUrl: string = config.notification.baseUrl,
    private contextId: string = config.websiteSiteName,
  ) { }

  public async sendEmail(emailAddress: string, content: EmailContent, reference: string, target: Target): Promise<void> {
    const { subject, body } = content;
    const payload: EmailPayload = {
      email_address: emailAddress,
      message_subject: subject,
      message_content: body,
      reference,
      target,
      context_id: this.contextId,
    };

    try {
      await this.sendRequest(EMAIL_ENDPOINT, payload);
    } catch (error) {
      const errorMessage = 'NotificationsGateway::sendEmail: Notification API send email request failed';
      this.handleError(error as AxiosError, errorMessage, reference);
      throw error;
    }
  }

  public async sendNotification(
    bookingId: string,
    bookingProductId: string,
    target: Target,
    language: NotificationLanguage,
    emailCategory: EmailCategory,
    emailAddress: string,
    reference: string,
    context_id: string,
  ): Promise<void> {
    const agency = target === Target.GB ? Agency.DVSA : Agency.DVA;

    const payload: NotificationPayload = {
      bookingId,
      bookingProductId,
      channel: 'email',
      agency,
      language,
      category: emailCategory,
      email_address: emailAddress,
      reference,
      context_id,
    };

    try {
      await this.sendRequest(NOTIFICATION_ENDPOINT, payload);
    } catch (error) {
      const errorMessage = 'NotificationsGateway::sendNotification: Notification API send email notification request failed';
      this.handleError(error as AxiosError, errorMessage, reference);
      throw error;
    }
  }

  private handleError(axiosError: AxiosError, errorMessage: string, reference: string): void {
    logger.error(axiosError, errorMessage);
    const errorPayload = {
      reference,
      error: axiosError.toString(),
      status: axiosError.response?.status,
      response: axiosError.response?.data,
    };
    const status = axiosError.response?.status || 0;
    switch (true) {
      case status === 401:
      case status === 403:
        logger.event(BusinessTelemetryEvent.DR_NOTIF_AUTH_ISSUE, errorMessage, errorPayload);
        break;
      case status >= 500 && status < 600:
        logger.event(BusinessTelemetryEvent.DR_NOTIF_ERROR, errorMessage, errorPayload);
        break;
      case status >= 400 && status < 500:
        logger.event(BusinessTelemetryEvent.DR_NOTIF_REQUEST_ISSUE, errorMessage, errorPayload);
        break;
      default:
        logger.warn('NotificationsGateway::sendEmail: Notification API email send failed', {
          errorMessage,
          errorPayload,
        });
    }
  }

  private async sendRequest(endpoint: string, payload: Payload): Promise<void> {
    const url = `${this.apiUrl}${endpoint}`;
    const header = await this.getToken();
    logger.debug('NotificationsGateway::sendRequest: Raw request payload', {
      url,
      payload,
    });
    const response = await this.axiosRetryClient.post(url, payload, header);
    logger.debug('NotificationsGateway::sendRequest: Raw response', {
      url,
      ...response,
    });
  }

  private async getToken(): Promise<AuthHeader> {
    try {
      return await this.auth.getAuthHeader();
    } catch (error) {
      logger.event(BusinessTelemetryEvent.DR_NOTIF_AUTH_ISSUE, 'NotificationsGateway::getToken: Token call failed', { error });
      throw error;
    }
  }
}

const notificationsGateway = new NotificationsGateway(new ManagedIdentityAuth(config.notification.identity));

export {
  notificationsGateway,
  NotificationsGateway,
};
