import { nonHttpTriggerContextWrapper } from '@dvsa/azure-logger';
import { index as wrapped, serviceBusQueueTrigger } from '../../../src/resultProcessor';
import { processResult } from '../../../src/resultProcessor/processResult';
import { mockedContext } from '../../mocks/context.mock';
import { mockedResultMessage } from '../../mocks/result-message.mock';

jest.mock('../../../src/resultProcessor/processResult');
const mockedProcessResult = jest.mocked(processResult, true);

const resultMessage = mockedResultMessage();

describe('reasultProcessor/index', () => {
  describe('serviceBusQueueTrigger', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test('GIVEN message WHEN receive THEN processResult', async () => {
      await serviceBusQueueTrigger(mockedContext, resultMessage);

      expect(mockedProcessResult).toHaveBeenCalledWith(resultMessage);
    });
  });

  describe('serviceBusTrigger wrapped by nonHttpTriggerContextWrapper', () => {
    test('GIVEN azure function WHEN invoke wrapper THEN wrapped function is invoked', async () => {
      await wrapped(mockedContext, resultMessage);

      expect(nonHttpTriggerContextWrapper).toHaveBeenCalledWith(expect.any(Function), mockedContext, resultMessage);
    });
  });
});
