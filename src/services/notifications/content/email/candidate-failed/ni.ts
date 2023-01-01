import dedent from 'ts-dedent';
import { ResultMessage } from '../../../../../interfaces/result-message';

import {
  getLicenseNumber, getTestDate, getTestType,
} from '../../helpers';

export default {
  subject: ({ results }: ResultMessage) => `Your ${getTestType(results)} theory test result`,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  buildBody: ({ results, licence }: ResultMessage): string => dedent`
    # Your ${getTestType(results)} theory test result

    ---

    Test result: FAIL

    ---

    Date of test: ${getTestDate(results)}
    Type of test: ${getTestType(results)}
    Licence number: ${getLicenseNumber(licence)}

    ---

    # Take our quick survey

    Your feedback helps us improve this service.

    Tell us what you think at:
    https://www.smartsurvey.co.uk/s/dva-theory-test-results/

  `,
};
