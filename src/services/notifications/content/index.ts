import { SARASTextLanguage } from '@dvsa/ftts-saras-model';
import gbCandidatePassedEmail from './email/candidate-passed/gb';
import gbCandidateFailedEmail from './email/candidate-failed/gb';
import niCandidatePassedEmail from './email/candidate-passed/ni';
import niCandidateFailedEmail from './email/candidate-failed/ni';
import cyCandidatePassedEmail from './email/candidate-passed/cy';
import cyCandidateFailedEmail from './email/candidate-failed/cy';
import { EmailType, Target } from '../../../interfaces/enums';

export default {
  email: {
    [EmailType.CANDIDATE_FAILED]: {
      [Target.GB]: {
        [SARASTextLanguage.ENGLISH]: gbCandidateFailedEmail,
        [SARASTextLanguage.WELSH]: cyCandidateFailedEmail,
      },
      [Target.NI]: {
        [SARASTextLanguage.ENGLISH]: niCandidateFailedEmail,
        [SARASTextLanguage.WELSH]: niCandidateFailedEmail,
      },
    },
    [EmailType.CANDIDATE_PASSED]: {
      [Target.GB]: {
        [SARASTextLanguage.ENGLISH]: gbCandidatePassedEmail,
        [SARASTextLanguage.WELSH]: cyCandidatePassedEmail,
      },
      [Target.NI]: {
        [SARASTextLanguage.ENGLISH]: niCandidatePassedEmail,
        [SARASTextLanguage.WELSH]: niCandidatePassedEmail,
      },
    },
  },
};
