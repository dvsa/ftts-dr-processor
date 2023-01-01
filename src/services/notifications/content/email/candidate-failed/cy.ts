import dedent from 'ts-dedent';
import { ResultMessage } from '../../../../../interfaces/result-message';

import {
  getLicenseNumber, getTestDate, getTestType,
} from '../../helpers';

export default {
  subject: ({ results }: ResultMessage) => `Canlyniad eich prawf theori ${getTestType(results)}`,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  buildBody: ({ results, licence }: ResultMessage): string => dedent`
    # Canlyniad eich prawf theori ${getTestType(results)}

    ---

    Canlyniad y prawf: METHU

    ---

    Dyddiad y prawf: ${getTestDate(results)}
    Math o brawf: ${getTestType(results)}
    Rhif trwydded: ${getLicenseNumber(licence)}

    ---

    # Cymerwch ein harolwg cyflym

    Mae eich adborth yn ein helpu i wella'r gwasanaeth hwn.

    Dywedwch wrthym eich barn ar wefan:
    https://www.smartsurvey.co.uk/s/dvsa-theory-test-results-cy/

  `,
};
