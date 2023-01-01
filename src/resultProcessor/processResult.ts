/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { SARASStatus, SARASTextLanguage } from '@dvsa/ftts-saras-model';
import { buildEmailContent } from '../services/notifications/content/builders';
import { notificationsGateway } from '../services/notifications/notifications-gateway';
import { validateMessage } from '../validation/validateMessage';
import { BusinessTelemetryEvent, logger } from '../utils/logger';
import { ResultMessage } from '../interfaces/result-message';
import { BusinessIdentifiers, getIdentifiers } from '../utils/identifiers';
import config from '../config';
import { EmailCategory, NotificationLanguage, Target } from '../interfaces/enums';

export const processResult = async (resultMessage: ResultMessage): Promise<void> => {
  const identifiers = getIdentifiers(resultMessage);
  try {
    if (!config.disableSuccessEventLogs) {
      logger.event(BusinessTelemetryEvent.DR_MESSAGE_RECEIVED, 'processResult:: sending results as email', {
        ...identifiers,
        testEndTime: resultMessage.results.TestInformation.EndTime,
      });
    }

    validateMessage(resultMessage);
    if (config.featureToggle.enableSendEmailsUsingSendNotificationEndpoint) {
      await sendNotification(resultMessage, identifiers);
    } else {
      const { subject, body } = buildEmailContent(resultMessage);
      await sendEmail(resultMessage.email, subject, body, resultMessage.target, identifiers.trace_id as string);
    }

    if (!config.disableSuccessEventLogs) {
      logger.event(BusinessTelemetryEvent.DR_MESSAGE_PROCESSED_SUCCESSFULLY, 'processResult:: result processed successfully', {
        ...identifiers,
        testEndTime: resultMessage.results.TestInformation.EndTime,
      });
    }
  } catch (error) {
    const processResultError = error as Error;
    logger.event(BusinessTelemetryEvent.DR_MESSAGE_PROCESSING_FAILED, 'processResult:: result processing failed', {
      ...identifiers,
    });
    logger.error(processResultError, 'processResult:: failed to process results', {
      message: processResultError.message,
      ...identifiers,
    });
    throw error;
  }
};

const sendEmail = async (emailAddress: string, subject: string, body: string, target: Target, reference: string): Promise<void> => {
  await notificationsGateway.sendEmail(
    emailAddress,
    {
      subject,
      body,
    },
    reference,
    target,
  );
};

const sendNotification = async (resultMessage: ResultMessage, identifiers: BusinessIdentifiers): Promise<void> => {
  const {
    bookingId, tracing, target, results,
  } = resultMessage;
  const emailCategory = results.TestInformation.OverallStatus === SARASStatus.PASS
    ? EmailCategory.DIGITAL_RESULTS_PASS : EmailCategory.DIGITAL_RESULTS_FAIL;

  const language = results.TestInformation.TextLanguage === SARASTextLanguage.ENGLISH ? NotificationLanguage.ENGLISH : NotificationLanguage.WELSH;

  await notificationsGateway.sendNotification(
    bookingId,
    tracing.bookingProductId,
    target,
    language,
    emailCategory,
    resultMessage.email,
    identifiers.appointmentId as string,
    identifiers.trace_id as string,
  );
};
