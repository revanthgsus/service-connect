import * as Yup from 'yup';

const emailPattern = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9])*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

// Manager validation
const ManagerValidationSchema = Yup.object({
  userName: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("User name is required"),
  emailAddress: Yup.string()
    .matches(emailPattern, "Invalid email address")
    .required("Email address is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  password: Yup.string()
    .matches(/^\S*$/, "Please remove any spaces")
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
  branchName: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Branch name is required"),
  branchLocation: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Branch location is required"),
  department: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Department is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
});

// Advisor validation
const AdvisorValidationSchema = Yup.object({
  userName: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("User name is required"),
  emailAddress: Yup.string()
    .matches(emailPattern, "Invalid email address")
    .required("Email address is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  password: Yup.string()
    .matches(/^\S*$/, "Please remove any spaces")
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
  branchName: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Branch name is required"),
  branchAddress: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Branch Address is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
    .required("Pincode is required"),
  department: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Department is required"),
  serviceType: Yup.string().required("Servive type is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
})

// Customer validation
const CustomerValidationSchema = Yup.object({
  userName: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("User name is required"),
  emailAddress: Yup.string()
    .matches(emailPattern, "Invalid email address")
    .required("Email address is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  password: Yup.string()
    .matches(/^\S*$/, "Please remove any spaces")
    .matches(passwordRegex, "Password: 8-12 chars, uppercase, numbers, special chars")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
  joiningDate: Yup.date()
    .nullable()
    .typeError("Invalid date format")
    .required("Joining date is required"),
  addressLine1: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Address line1 is required"),
  addressLine2: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Address line2 is required"),
  city: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("City is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
    .required("Pincode is required"),
  state: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("State is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
})

// Admin validation
const AdminValidationSchema = Yup.object({
  userName: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("User name is required"),
  emailAddress: Yup.string()
    .matches(emailPattern, "Invalid email address")
    .required("Email address is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  role: Yup.string().required("Role is required"),
  location: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Location is required"),
  joiningDate: Yup.date()
    .nullable()
    .typeError("Invalid date format")
    .required("Joining date is required"),
  password: Yup.string()
    .matches(/^\S*$/, "Please remove any spaces")
    .matches(passwordRegex, "Password: 8-12 chars, uppercase, numbers, special chars")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
})

export { ManagerValidationSchema, AdvisorValidationSchema, CustomerValidationSchema, AdminValidationSchema };