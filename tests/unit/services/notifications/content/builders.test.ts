import dedent from 'ts-dedent';
import { SARASStatus, SARASTextLanguage } from '@dvsa/ftts-saras-model';
import '../../../../../src/dayjs-config';
import { buildEmailContent } from '../../../../../src/services/notifications/content/builders';
import { mockedResultMessage } from '../../../../mocks/result-message.mock';
import { Target } from '../../../../../src/interfaces/enums';

describe('buildEmailContent', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when target is gb', () => {
    const resultMessage = mockedResultMessage();

    beforeAll(() => {
      resultMessage.target = Target.GB;
      resultMessage.results.TestInformation.TextLanguage = SARASTextLanguage.ENGLISH;
    });

    test('and candidate has passed, should return PASS email contents', () => {
      const { subject, body } = buildEmailContent(resultMessage);
      const expectedBody = dedent`# Your car theory test result

---

Test result: PASS

This does not replace your paper certificate.

---

Date of test: 12 September 2022
Type of test: car
Licence number: ************97YT
Expiry date: 12 September 2023

---

# Take our quick survey

Your feedback helps us improve this service.

Tell us what you think at:
https://www.smartsurvey.co.uk/s/dvsa-theory-test-results/

`;
      expect(subject).toBe('Your car theory test result');
      expect(body).toEqual(expectedBody);
    });

    test('and candidate has failed, should return FAIL email contents', () => {
      resultMessage.results.TestInformation.OverallStatus = SARASStatus.FAIL;
      const { subject, body } = buildEmailContent(resultMessage);
      const expectedBody = dedent`# Your car theory test result

---

Test result: FAIL

---

Date of test: 12 September 2022
Type of test: car
Licence number: ************97YT

---

# Take our quick survey

Your feedback helps us improve this service.

Tell us what you think at:
https://www.smartsurvey.co.uk/s/dvsa-theory-test-results/

`;
      expect(subject).toBe('Your car theory test result');
      expect(body).toEqual(expectedBody);
    });
  });

  describe('when target is ni', () => {
    const resultMessage = mockedResultMessage();

    beforeAll(() => {
      resultMessage.target = Target.NI;
      resultMessage.results.TestInformation.TextLanguage = SARASTextLanguage.ENGLISH;
    });

    test('and candidate has passed, should return PASS email contents', () => {
      const { subject, body } = buildEmailContent(resultMessage);
      const expectedBody = dedent`# Your car theory test result

---

Test result: PASS

This does not replace your paper certificate.

---

Date of test: 12 September 2022
Type of test: car
Licence number: ************97YT
Expiry date: 12 September 2023

---

# Take our quick survey

Your feedback helps us improve this service.

Tell us what you think at:
https://www.smartsurvey.co.uk/s/dva-theory-test-results/

`;
      expect(subject).toBe('Your car theory test result');
      expect(body).toEqual(expectedBody);
    });

    test('and candidate has failed, should return FAIL email contents', () => {
      resultMessage.results.TestInformation.OverallStatus = SARASStatus.FAIL;
      const { subject, body } = buildEmailContent(resultMessage);
      const expectedBody = dedent`# Your car theory test result

---

Test result: FAIL

---

Date of test: 12 September 2022
Type of test: car
Licence number: ************97YT

---

# Take our quick survey

Your feedback helps us improve this service.

Tell us what you think at:
https://www.smartsurvey.co.uk/s/dva-theory-test-results/

`;
      expect(subject).toBe('Your car theory test result');
      expect(body).toEqual(expectedBody);
    });
  });

  describe('when test language is cy', () => {
    const resultMessage = mockedResultMessage();

    beforeAll(() => {
      resultMessage.target = Target.GB;
      resultMessage.results.TestInformation.TextLanguage = SARASTextLanguage.WELSH;
    });

    test('and candidate has passed, should return PASS email contents', () => {
      const { subject, body } = buildEmailContent(resultMessage);
      const expectedBody = dedent`# Canlyniad eich prawf theori car

---

Canlyniad y prawf: PASIO

Nid yw hon yn disodli eich tystysgrif bapur.

---

Dyddiad y prawf: 12 Medi 2022
Math o brawf: car
Rhif trwydded: ************97YT
Dyddiad Dod i ben: 12 Medi 2023

---

# Cymerwch ein harolwg cyflym

Mae eich adborth yn ein helpu i wella'r gwasanaeth hwn.

Dywedwch wrthym eich barn ar wefan:
https://www.smartsurvey.co.uk/s/dvsa-theory-test-results-cy/

`;
      expect(subject).toBe('Canlyniad eich prawf theori car');
      expect(body).toEqual(expectedBody);
    });

    test('and candidate has failed, should return FAIL email contents', () => {
      resultMessage.results.TestInformation.OverallStatus = SARASStatus.FAIL;
      const { subject, body } = buildEmailContent(resultMessage);
      const expectedBody = dedent`# Canlyniad eich prawf theori car

  ---

  Canlyniad y prawf: METHU

  ---

  Dyddiad y prawf: 12 Medi 2022
  Math o brawf: car
  Rhif trwydded: ************97YT

  ---

  # Cymerwch ein harolwg cyflym

  Mae eich adborth yn ein helpu i wella'r gwasanaeth hwn.

  Dywedwch wrthym eich barn ar wefan:
  https://www.smartsurvey.co.uk/s/dvsa-theory-test-results-cy/

  `;
      expect(subject).toBe('Canlyniad eich prawf theori car');
      expect(body).toEqual(expectedBody);
    });
  });
});
