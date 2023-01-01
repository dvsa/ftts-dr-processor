import content from '.';
import { ResultMessage } from '../../../interfaces/result-message';
import { EmailContent } from '../../../interfaces/email';
import { getOverallStatus } from './helpers';

export const buildEmailContent = (resultMessage: ResultMessage): EmailContent => {
  const sarasStatus = getOverallStatus(resultMessage.results);
  // eslint-disable-next-line security/detect-object-injection
  const { subject, buildBody } = content.email[sarasStatus][resultMessage.target][resultMessage.results.TestInformation.TextLanguage];
  return {
    subject: subject(resultMessage),
    body: buildBody(resultMessage),
  };
};
