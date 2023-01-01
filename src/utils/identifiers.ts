import { ResultMessage } from '../interfaces/result-message';

export interface BusinessIdentifiers {
  appointmentId?: string;
  candidateId?: string;
  reference?: string;
  context_id?: string;
  trace_id?: string;
}

export const getIdentifiers = (resultMessage: ResultMessage): BusinessIdentifiers => ({
  appointmentId: resultMessage.tracing.AppointmentId,
  candidateId: resultMessage.results.Candidate?.CandidateID,
  reference: resultMessage.tracing.reference,
  context_id: resultMessage.tracing.context_id,
  trace_id: resultMessage.tracing.trace_id,
});
