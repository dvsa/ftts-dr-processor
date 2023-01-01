interface Identity {
  azureTenantId: string;
  azureClientId: string;
  azureClientSecret: string;
  scope: string;
  userAssignedEntityClientId: string;
}
export interface RetryPolicy {
  defaultRetryDelay: number;
  exponentialBackoff: boolean;
  maxRetries: number;
  maxRetryAfter: number;
}

export interface Config {
  websiteSiteName: string;
  defaultTimeZone: string;
  notification: {
    baseUrl: string;
    identity: Identity;
    retryPolicy: RetryPolicy;
  };
  disableSuccessEventLogs?: boolean;
  featureToggle: {
    enableSendEmailsUsingSendNotificationEndpoint: boolean;
  };
}

const config: Config = {
  websiteSiteName: process.env.WEBSITE_SITE_NAME || 'ftts-dr-processor',
  defaultTimeZone: process.env.TZ || 'Europe/London',
  notification: {
    baseUrl: process.env.NOTIFICATION_API_BASE_URL || '',
    identity: {
      azureTenantId: process.env.NOTIFICATIONS_TENANT_ID || '',
      azureClientId: process.env.NOTIFICATIONS_CLIENT_ID || '',
      azureClientSecret: process.env.NOTIFICATIONS_CLIENT_SECRET || '',
      scope: process.env.NOTIFICATION_API_SCOPE || '',
      userAssignedEntityClientId: process.env.USER_ASSIGNED_ENTITY_CLIENT_ID || '',
    },
    retryPolicy: {
      defaultRetryDelay: parseInt(process.env.NOTIFICATION_RETRY_CLIENT_DEFAULT_DELAY || '300', 10),
      exponentialBackoff: process.env.NOTIFICATION_RETRY_CLIENT_EXPONETIAL_BACKOFF === 'true',
      maxRetries: parseInt(process.env.NOTIFICATION_RETRY_CLIENT_MAX_RETRIES || '3', 10),
      maxRetryAfter: parseInt(process.env.NOTIFICATION_RETRY_CLIENT_MAX_RETRY_AFTER || '1000', 10),
    },
  },
  disableSuccessEventLogs: process.env.DISABLE_SUCCESS_EVENT_LOGS === 'true',
  featureToggle: {
    enableSendEmailsUsingSendNotificationEndpoint: process.env.ENABLE_SEND_EMAILS_USING_SEND_NOTIFICATION_ENDPOINT === 'true',
  },
};

export default config;
