import { SARASResultBody } from '@dvsa/ftts-saras-model';
import { Target } from './enums';

interface Tracing {
  trace_id?: string;
  context_id?: string;
  reference?: string;
  AppointmentId?: string;
  bookingProductId: string;
}

export interface ResultMessage {
  bookingId: string;
  email: string;
  licence: string;
  target: Target;
  results: SARASResultBody;
  tracing: Tracing;
}
