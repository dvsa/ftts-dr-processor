import dayjs from 'dayjs';
import cy from 'dayjs/locale/cy';
import gb from 'dayjs/locale/en-gb';
import {
  SARASResultBody, SARASStatus, SARASTestType, SARASTextLanguage,
} from '@dvsa/ftts-saras-model';
import config from '../../../config';

export const getOverallStatus = (results: SARASResultBody): SARASStatus => results.TestInformation.OverallStatus;

export const getTestType = (results: SARASResultBody): string => getTestTypeString(results.TestInformation.TestType, results.TestInformation.TextLanguage);

export const getLicenseNumber = (licenseNumber: string): string => '*'.repeat(licenseNumber.length - 4) + licenseNumber.substring(licenseNumber.length - 4);

export const getTestDate = (results: SARASResultBody): string | undefined => {
  setLocale(results.TestInformation.TextLanguage);

  if (results.Appointment.DateTime) {
    return asFullDateWithoutWeekday(results.Appointment.DateTime);
  }
  return undefined;
};

export const getResultExpiryDate = (results: SARASResultBody): string | undefined => {
  setLocale(results.TestInformation.TextLanguage);

  if (results.TestInformation.CertificateExpiryDate) {
    return asFullDateWithoutWeekday(results.TestInformation.CertificateExpiryDate);
  }
  return undefined;
};

export const getCandidateID = (results: SARASResultBody): string => results.Candidate.CandidateID;

export const getTestTypeString = (testType: SARASTestType, language: SARASTextLanguage): string => {
  type TestType = {
    [key in SARASTestType]: {
      [language in SARASTextLanguage]: string;
    }
  };

  const testTypeEnum: TestType = {
    [SARASTestType.CAR]: {
      [SARASTextLanguage.ENGLISH]: 'car',
      [SARASTextLanguage.WELSH]: 'car',
    },
    [SARASTestType.MOTORCYCLE]: {
      [SARASTextLanguage.ENGLISH]: 'motorcycle',
      [SARASTextLanguage.WELSH]: 'Beic modur',
    },
    [SARASTestType.LGVMC]: {
      [SARASTextLanguage.ENGLISH]: 'LGV - multiple choice',
      [SARASTextLanguage.WELSH]: 'LGV - aml-ddewis',
    },
    [SARASTestType.LGVHPT]: {
      [SARASTextLanguage.ENGLISH]: 'LGV - hazard perception',
      [SARASTextLanguage.WELSH]: 'LGV - canfod peryglon',
    },
    [SARASTestType.LGVCPC]: {
      [SARASTextLanguage.ENGLISH]: 'LGV - Driver Certificate of Professional Competence (CPC)',
      [SARASTextLanguage.WELSH]: 'LGV - Tystysgrif Cymhwysedd Proffesiynol ar gyfer Gyrwyr (CPC)',
    },
    [SARASTestType.LGVCPCC]: {
      [SARASTextLanguage.ENGLISH]: 'LGV to PCV conversion',
      [SARASTextLanguage.WELSH]: 'Trosi LGV i PCV',
    },
    [SARASTestType.PCVMC]: {
      [SARASTextLanguage.ENGLISH]: 'PCV - multiple choice',
      [SARASTextLanguage.WELSH]: 'PCV - aml-ddewis',
    },
    [SARASTestType.PCVHPT]: {
      [SARASTextLanguage.ENGLISH]: 'PCV - hazard perception',
      [SARASTextLanguage.WELSH]: 'PCV - canfod peryglon',
    },
    [SARASTestType.PCVCPC]: {
      [SARASTextLanguage.ENGLISH]: 'PCV - Driver Certificate of Professional Competence (CPC)',
      [SARASTextLanguage.WELSH]: 'PCV - Tystysgrif Cymhwysedd Proffesiynol ar gyfer Gyrwyr (CPC)',
    },
    [SARASTestType.PCVCPCC]: {
      [SARASTextLanguage.ENGLISH]: 'PCV to LGV conversion',
      [SARASTextLanguage.WELSH]: 'Trosi PCV i LGV',
    },
    [SARASTestType.TAXI]: {
      [SARASTextLanguage.ENGLISH]: 'taxi',
      [SARASTextLanguage.WELSH]: 'Tacsi',
    },
    [SARASTestType.ADI1]: {
      [SARASTextLanguage.ENGLISH]: 'ADI Part 1',
      [SARASTextLanguage.WELSH]: 'Rhan 1 Hyfforddwr Gyrru Cymeradwy (ADI)',
    },
    [SARASTestType.ADIHPT]: {
      [SARASTextLanguage.ENGLISH]: 'ADI hazard perception',
      [SARASTextLanguage.WELSH]: 'Canfod peryglon (ADI)',
    },
    [SARASTestType.ERS]: {
      [SARASTextLanguage.ENGLISH]: 'Enhanced Rider Scheme',
      [SARASTextLanguage.WELSH]: 'Cynllun Gwella Beicwyr',
    },
    [SARASTestType.AMI1]: {
      [SARASTextLanguage.ENGLISH]: 'AMI Part 1',
      [SARASTextLanguage.WELSH]: 'Rhan 1 Hyfforddwr Beic Modur Cymeradwy (AMI)',
    },
    [SARASTestType.EXAMINER_CAR]: {
      [SARASTextLanguage.ENGLISH]: 'Examiner car',
      [SARASTextLanguage.WELSH]: 'Examiner car',
    },
  };

  // eslint-disable-next-line security/detect-object-injection
  return testTypeEnum[testType][language];
};

export const asFullDateWithoutWeekday = localDateFormat('DD MMMM YYYY');

function localDateFormat(mask: string): (isoDate: string) => string {
  return (isoDate: string): string => dayjs(isoDate).tz(config.defaultTimeZone).format(mask);
}

function setLocale(language: SARASTextLanguage): void {
  if (language === SARASTextLanguage.ENGLISH) {
    dayjs.locale(gb);
  } else {
    dayjs.locale(cy);
  }
}
