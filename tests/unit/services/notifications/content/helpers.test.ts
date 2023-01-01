import { SARASTestType, SARASTextLanguage } from '@dvsa/ftts-saras-model';
import { ResultMessage } from '../../../../../src/interfaces/result-message';
import {
  getCandidateID,
  getLicenseNumber,
  getOverallStatus, getResultExpiryDate, getTestDate,
  getTestType,
  getTestTypeString,
} from '../../../../../src/services/notifications/content/helpers';
import { mockedResultMessage } from '../../../../mocks/result-message.mock';
import '../../../../../src/dayjs-config';

let resultMessage: ResultMessage;

describe('helpers', () => {
  beforeEach(() => {
    resultMessage = mockedResultMessage();
  });

  test('getOverallStatus should get OverallStatus prop of result object', () => {
    const overallStatus = getOverallStatus(resultMessage.results);
    expect(overallStatus).toBe(1);
  });

  test('getTestType should get TestType prop of result object', () => {
    const testType = getTestType(resultMessage.results);
    expect(testType).toBe('car');
  });

  test('getLicenseNumber should get LicenseNumber prop of result object', () => {
    const licenseNumber = getLicenseNumber(resultMessage.licence);
    expect(licenseNumber).toBe('************97YT');
  });

  describe('getTestDate', () => {
    describe('should get TestDate prop of result object', () => {
      test('English', () => {
        resultMessage.results.TestInformation.TextLanguage = SARASTextLanguage.ENGLISH;
        const testDate = getTestDate(resultMessage.results);
        expect(testDate).toBe('12 September 2022');
      });

      test('Welsh', () => {
        resultMessage.results.TestInformation.TextLanguage = SARASTextLanguage.WELSH;
        const testDate = getTestDate(resultMessage.results);
        expect(testDate).toBe('12 Medi 2022');
      });
    });

    test('should get undefined when TestDate prop is missing in result object', () => {
      delete resultMessage.results.Appointment.DateTime;
      const testDate = getTestDate(resultMessage.results);
      expect(testDate).toBeUndefined();
    });
  });

  describe('getResultExpiryDate', () => {
    describe('should get ResultExpiryDate prop of result object', () => {
      test('English', () => {
        resultMessage.results.TestInformation.TextLanguage = SARASTextLanguage.ENGLISH;
        const resultExpiryDate = getResultExpiryDate(resultMessage.results);
        expect(resultExpiryDate).toBe('12 September 2023');
      });

      test('Welsh', () => {
        resultMessage.results.TestInformation.TextLanguage = SARASTextLanguage.WELSH;
        const resultExpiryDate = getResultExpiryDate(resultMessage.results);
        expect(resultExpiryDate).toBe('12 Medi 2023');
      });
    });

    test('should get undefined when ResultExpiryDate prop is missing in result object', () => {
      delete resultMessage.results.TestInformation.CertificateExpiryDate;
      const resultExpiryDate = getResultExpiryDate(resultMessage.results);
      expect(resultExpiryDate).toBeUndefined();
    });
  });

  test('getCandidateID should get CandidateID prop of result object', () => {
    const candidateID = getCandidateID(resultMessage.results);
    expect(candidateID).toBe('4ddab30e-f90e-eb11-a813-000d3a7f128d');
  });

  describe('getTestTypeString should get the string value of a TestType', () => {
    test('GB', () => {
      expect(getTestTypeString(SARASTestType.ADI1, SARASTextLanguage.ENGLISH)).toBe('ADI Part 1');
      expect(getTestTypeString(SARASTestType.ADIHPT, SARASTextLanguage.ENGLISH)).toBe('ADI hazard perception');
      expect(getTestTypeString(SARASTestType.AMI1, SARASTextLanguage.ENGLISH)).toBe('AMI Part 1');
      expect(getTestTypeString(SARASTestType.CAR, SARASTextLanguage.ENGLISH)).toBe('car');
      expect(getTestTypeString(SARASTestType.ERS, SARASTextLanguage.ENGLISH)).toBe('Enhanced Rider Scheme');
      expect(getTestTypeString(SARASTestType.EXAMINER_CAR, SARASTextLanguage.ENGLISH)).toBe('Examiner car');
      expect(getTestTypeString(SARASTestType.LGVCPC, SARASTextLanguage.ENGLISH)).toBe('LGV - Driver Certificate of Professional Competence (CPC)');
      expect(getTestTypeString(SARASTestType.LGVCPCC, SARASTextLanguage.ENGLISH)).toBe('LGV to PCV conversion');
      expect(getTestTypeString(SARASTestType.LGVHPT, SARASTextLanguage.ENGLISH)).toBe('LGV - hazard perception');
      expect(getTestTypeString(SARASTestType.LGVMC, SARASTextLanguage.ENGLISH)).toBe('LGV - multiple choice');
      expect(getTestTypeString(SARASTestType.MOTORCYCLE, SARASTextLanguage.ENGLISH)).toBe('motorcycle');
      expect(getTestTypeString(SARASTestType.PCVCPC, SARASTextLanguage.ENGLISH)).toBe('PCV - Driver Certificate of Professional Competence (CPC)');
      expect(getTestTypeString(SARASTestType.PCVCPCC, SARASTextLanguage.ENGLISH)).toBe('PCV to LGV conversion');
      expect(getTestTypeString(SARASTestType.PCVHPT, SARASTextLanguage.ENGLISH)).toBe('PCV - hazard perception');
      expect(getTestTypeString(SARASTestType.PCVMC, SARASTextLanguage.ENGLISH)).toBe('PCV - multiple choice');
      expect(getTestTypeString(SARASTestType.TAXI, SARASTextLanguage.ENGLISH)).toBe('taxi');
    });

    test('NI', () => {
      expect(getTestTypeString(SARASTestType.ADI1, SARASTextLanguage.ENGLISH)).toBe('ADI Part 1');
      expect(getTestTypeString(SARASTestType.ADIHPT, SARASTextLanguage.ENGLISH)).toBe('ADI hazard perception');
      expect(getTestTypeString(SARASTestType.AMI1, SARASTextLanguage.ENGLISH)).toBe('AMI Part 1');
      expect(getTestTypeString(SARASTestType.CAR, SARASTextLanguage.ENGLISH)).toBe('car');
      expect(getTestTypeString(SARASTestType.ERS, SARASTextLanguage.ENGLISH)).toBe('Enhanced Rider Scheme');
      expect(getTestTypeString(SARASTestType.EXAMINER_CAR, SARASTextLanguage.ENGLISH)).toBe('Examiner car');
      expect(getTestTypeString(SARASTestType.LGVCPC, SARASTextLanguage.ENGLISH)).toBe('LGV - Driver Certificate of Professional Competence (CPC)');
      expect(getTestTypeString(SARASTestType.LGVCPCC, SARASTextLanguage.ENGLISH)).toBe('LGV to PCV conversion');
      expect(getTestTypeString(SARASTestType.LGVHPT, SARASTextLanguage.ENGLISH)).toBe('LGV - hazard perception');
      expect(getTestTypeString(SARASTestType.LGVMC, SARASTextLanguage.ENGLISH)).toBe('LGV - multiple choice');
      expect(getTestTypeString(SARASTestType.MOTORCYCLE, SARASTextLanguage.ENGLISH)).toBe('motorcycle');
      expect(getTestTypeString(SARASTestType.PCVCPC, SARASTextLanguage.ENGLISH)).toBe('PCV - Driver Certificate of Professional Competence (CPC)');
      expect(getTestTypeString(SARASTestType.PCVCPCC, SARASTextLanguage.ENGLISH)).toBe('PCV to LGV conversion');
      expect(getTestTypeString(SARASTestType.PCVHPT, SARASTextLanguage.ENGLISH)).toBe('PCV - hazard perception');
      expect(getTestTypeString(SARASTestType.PCVMC, SARASTextLanguage.ENGLISH)).toBe('PCV - multiple choice');
      expect(getTestTypeString(SARASTestType.TAXI, SARASTextLanguage.ENGLISH)).toBe('taxi');
    });

    test('CY', () => {
      expect(getTestTypeString(SARASTestType.ADI1, SARASTextLanguage.WELSH)).toBe('Rhan 1 Hyfforddwr Gyrru Cymeradwy (ADI)');
      expect(getTestTypeString(SARASTestType.ADIHPT, SARASTextLanguage.WELSH)).toBe('Canfod peryglon (ADI)');
      expect(getTestTypeString(SARASTestType.AMI1, SARASTextLanguage.WELSH)).toBe('Rhan 1 Hyfforddwr Beic Modur Cymeradwy (AMI)');
      expect(getTestTypeString(SARASTestType.CAR, SARASTextLanguage.WELSH)).toBe('car');
      expect(getTestTypeString(SARASTestType.ERS, SARASTextLanguage.WELSH)).toBe('Cynllun Gwella Beicwyr');
      expect(getTestTypeString(SARASTestType.EXAMINER_CAR, SARASTextLanguage.WELSH)).toBe('Examiner car');
      expect(getTestTypeString(SARASTestType.LGVCPC, SARASTextLanguage.WELSH)).toBe('LGV - Tystysgrif Cymhwysedd Proffesiynol ar gyfer Gyrwyr (CPC)');
      expect(getTestTypeString(SARASTestType.LGVCPCC, SARASTextLanguage.WELSH)).toBe('Trosi LGV i PCV');
      expect(getTestTypeString(SARASTestType.LGVHPT, SARASTextLanguage.WELSH)).toBe('LGV - canfod peryglon');
      expect(getTestTypeString(SARASTestType.LGVMC, SARASTextLanguage.WELSH)).toBe('LGV - aml-ddewis');
      expect(getTestTypeString(SARASTestType.MOTORCYCLE, SARASTextLanguage.WELSH)).toBe('Beic modur');
      expect(getTestTypeString(SARASTestType.PCVCPC, SARASTextLanguage.WELSH)).toBe('PCV - Tystysgrif Cymhwysedd Proffesiynol ar gyfer Gyrwyr (CPC)');
      expect(getTestTypeString(SARASTestType.PCVCPCC, SARASTextLanguage.WELSH)).toBe('Trosi PCV i LGV');
      expect(getTestTypeString(SARASTestType.PCVHPT, SARASTextLanguage.WELSH)).toBe('PCV - canfod peryglon');
      expect(getTestTypeString(SARASTestType.PCVMC, SARASTextLanguage.WELSH)).toBe('PCV - aml-ddewis');
      expect(getTestTypeString(SARASTestType.TAXI, SARASTextLanguage.WELSH)).toBe('Tacsi');
    });
  });
});
