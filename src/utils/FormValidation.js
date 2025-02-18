import * as Yup from 'yup';

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

// Manager validation
const ManagerValidationSchema = Yup.object({
  userName: Yup.string().required("User name is required"),
  emailAddress: Yup.string()
    .matches(emailPattern, "Invalid email address")
    .required("Email address is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  password: Yup.string()
    .matches(passwordRegex, "Password: 8-12 chars, uppercase, numbers, special chars")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
  joiningDate: Yup.date()
    .nullable()
    .typeError("Invalid date format")
    .required("Joining date is required"),
  designation: Yup.string().required("Designation is required"),
  branchName: Yup.string().required("Branch name is required"),
  branchLocation: Yup.string().required("Branch location is required"),
  department: Yup.string().required("Department is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
});

// Advisor validation
const AdvisorValidationSchema = Yup.object({
  userName: Yup.string().required("User name is required"),
  emailAddress: Yup.string()
    .matches(emailPattern, "Invalid email address")
    .required("Email address is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  password: Yup.string()
    .matches(passwordRegex, "Password: 8-12 chars, uppercase, numbers, special chars")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
  joiningDate: Yup.date()
    .nullable()
    .typeError("Invalid date format")
    .required("Joining date is required"),
  designation: Yup.string().required("Designation is required"),
  branchName: Yup.string().required("Branch name is required"),
  branchAddress: Yup.string().required("Branch Address is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
    .required("Pincode is required"),
  department: Yup.string().required("Department is required"),
  serviceType: Yup.string().required("Servive type is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
})

// Customer validation
const CustomerValidationSchema = Yup.object({
  userName: Yup.string().required("User name is required"),
  emailAddress: Yup.string()
    .matches(emailPattern, "Invalid email address")
    .required("Email address is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  password: Yup.string()
    .matches(passwordRegex, "Password: 8-12 chars, uppercase, numbers, special chars")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
  joiningDate: Yup.date()
    .nullable()
    .typeError("Invalid date format")
    .required("Joining date is required"),
  addressLine1: Yup.string().required("Address line1 is required"),
  addressLine2: Yup.string().required("Address line2 is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
    .required("Pincode is required"),
  state: Yup.string().required("State is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
})

// Admin validation
const AdminValidationSchema = Yup.object({
  userName: Yup.string().required("User name is required"),
  emailAddress: Yup.string()
    .matches(emailPattern, "Invalid email address")
    .required("Email address is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  role: Yup.string().required("Role is required"),
  location: Yup.string().required("Location is required"),
  joiningDate: Yup.date()
    .nullable()
    .typeError("Invalid date format")
    .required("Joining date is required"),
  password: Yup.string()
    .matches(passwordRegex, "Password: 8-12 chars, uppercase, numbers, special chars")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
})

export { ManagerValidationSchema, AdvisorValidationSchema, CustomerValidationSchema, AdminValidationSchema };