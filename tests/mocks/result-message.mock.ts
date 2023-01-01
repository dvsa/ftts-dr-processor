import { ResultMessage } from '../../src/interfaces/result-message';
import { Target } from '../../src/interfaces/enums';

export const mockedResultMessage = (): ResultMessage => ({
  bookingId: 'mockBookingId',
  email: 'email@company.com',
  licence: 'JONES061102W97YT',
  target: Target.GB,
  results: {
    Candidate: {
      CandidateID: '4ddab30e-f90e-eb11-a813-000d3a7f128d',
      Name: 'Wendy',
      Surname: 'Jones',
      DOB: '2002-11-10',
      Gender: 3,
      DrivingLicenseNumber: 'JONES061102W97YT',
    },
    Admission: {
      DateTime: '2022-09-12T13:30:00.000Z',
    },
    Appointment: {
      DateTime: '2022-09-12T13:00:00.000Z',
    },
    TestCentre: {
      TestCentreCode: '7678',
      Region: 0,
    },
    TestInformation: {
      StartTime: '2022-09-12T13:50:00.000Z',
      CertificateExpiryDate: '2023-09-12T13:30:00.000Z',
      DeliveryMode: 0,
      TestType: 0,
      TextLanguage: 0,
      OverallStatus: 1,
      CertificationID: '123456781',
      EndTime: '2022-09-12T15:50:00.000Z',
    },
  },
  tracing: {
    AppointmentId: 'fake-appointment-id',
    bookingProductId: 'fake-booking-product-id',
    context_id: 'fake-context-id',
    reference: 'fake-reference',
    trace_id: 'fake-trace-id',
  },
});
