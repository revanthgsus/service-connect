import * as Yup from 'yup';

const AppointmentValidationSchema = Yup.object().shape({
  companyName: Yup.string()
    .required('Company name is required'),
  companyAddress: Yup.string()
    .required('Preferred location is required'),
  appointmentData: Yup.date()
    .nullable()
    .required('Appointment date is required'),
  startTime: Yup.string()
    .nullable()
    .required('Start time is required'),
  productName: Yup.string()
    .required('Product name is required'),
  productSerialNo: Yup.string()
    .required('Product serial number is required'),
  serviceType: Yup.string()
    .required('Service type is required'),
  priorityLevel: Yup.string()
    .required('Priority level is required'),
});

export { AppointmentValidationSchema };
