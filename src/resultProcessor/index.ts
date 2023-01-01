/* eslint-disable @typescript-eslint/no-explicit-any */
import { AzureFunction, Context } from '@azure/functions';
import { nonHttpTriggerContextWrapper } from '@dvsa/azure-logger';
import { withEgressFiltering } from '@dvsa/egress-filtering';
import { ResultMessage } from '../interfaces/result-message';
import { ALLOWED_ADDRESSES, ON_INTERNAL_ACCESS_DENIED_ERROR } from '../security/egress';
import { logger } from '../utils/logger';
import { processResult } from './processResult';
import '../dayjs-config';

export const serviceBusQueueTrigger: AzureFunction = async function resultServiceBusTrigger(context: Context, resultMessage: ResultMessage): Promise<void> {
  await processResult(resultMessage);
};

export const index = (context: Context, resultMessage: any): Promise<void> => nonHttpTriggerContextWrapper(
  withEgressFiltering(
    serviceBusQueueTrigger,
    ALLOWED_ADDRESSES(),
    ON_INTERNAL_ACCESS_DENIED_ERROR,
    logger,
  ),
  context,
  resultMessage,
);
