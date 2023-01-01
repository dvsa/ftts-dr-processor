import { SARASStatus } from '@dvsa/ftts-saras-model';

export enum EmailCategory {
  DIGITAL_RESULTS_PASS = 'digital-results-pass',
  DIGITAL_RESULTS_FAIL = 'digital-results-fail',
}

export enum Agency {
  DVSA = 'DVSA',
  DVA = 'DVA',
}

export enum Target {
  GB = 'gb',
  NI = 'ni',
}

export enum EmailType {
  CANDIDATE_FAILED = SARASStatus.FAIL,
  CANDIDATE_PASSED = SARASStatus.PASS,
}

export enum NotificationLanguage {
  ENGLISH = 'English',
  WELSH = 'Welsh',
}
