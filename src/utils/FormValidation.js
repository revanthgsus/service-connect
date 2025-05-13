import * as Yup from 'yup';

const emailPattern = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9])*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,12}$/;

// Manager validation
const ManagerValidationSchema = Yup.object({
  userName: Yup.string()
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Remove any spaces at before and after")
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
  companyName: Yup.string()
    .matches(/^[A-Za-z0-9 ]+$/, "Remove any spaces at before and after")
    .required("Company name is required"),
  companyLocation: Yup.string()
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .matches(/^[A-Za-z0-9,./'()&-]+( [A-Za-z0-9,./'()&-]+)*$/, "Invalid characters in company location")
    .required("Company location is required"),
  department: Yup.string()
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .matches(/^[A-Za-z0-9,./-]+(?: [A-Za-z0-9,./-]+)*$/, "Invalid characters in department")
    .required("Department is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
});

// Advisor validation
const AdvisorValidationSchema = Yup.object({
  userName: Yup.string()
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Remove any spaces at before and after")
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
  designation: Yup.string()
    .required("Designation is required"),
  companyName: Yup.string()
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Remove any spaces at before and after")
    .required("Company name is required"),
  companyAddress: Yup.string()
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .matches(/^[A-Za-z0-9,./'()&-]+( [A-Za-z0-9,./'()&-]+)*$/, "Invalid characters in company address")
    .required("Company address is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
    .required("Pincode is required"),
  department: Yup.string()
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .matches(/^[A-Za-z0-9,./-]+(?: [A-Za-z0-9,./-]+)*$/, "Invalid characters in department")
    .required("Department is required"),
  serviceType: Yup.string().required("Servive type is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
})

// Customer validation
const CustomerValidationSchema = Yup.object({
  userName: Yup.string()
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Remove any spaces at before and after")
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
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .matches(/^[A-Za-z0-9,./'()&-]+( [A-Za-z0-9,./'()&-]+)*$/, "Invalid characters in address")
    .required("Address line1 is required"),
  addressLine2: Yup.string()
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .matches(/^[A-Za-z0-9,./'()&-]+( [A-Za-z0-9,./'()&-]+)*$/, "Invalid characters in address")
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
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Remove any spaces at before and after")
    .required("User name is required"),
  emailAddress: Yup.string()
    .matches(emailPattern, "Invalid email address")
    .required("Email address is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  role: Yup.string().required("Role is required"),
  companyName: Yup.string()
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Remove any spaces at before and after")
    .required("Company name is required"),
  location: Yup.string()
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .matches(/^[A-Za-z0-9,./'()&-]+( [A-Za-z0-9,./'()&-]+)*$/, "Invalid characters in location")
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

// item validation
const itemValidationSchema = Yup.object({
  itemName: Yup.string()
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Remove any spaces before and after")
    .required("Item name is required"),
  itemCode: Yup.string()
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Only letters and numbers allowed, no spaces")
    .required("Item code is required"),
  itemType: Yup.string()
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Remove any spaces at before and after")
    .required("Item type is required"),
  itemFee: Yup.string()
    .matches(/^\d+$/, "Only numbers allowed")
    .required("Item fee is required"),
  labourFee: Yup.string()
    .matches(/^\d+$/, "Only numbers allowed")
    .required("Labour fee is required"),
  labourTax: Yup.string()
    .typeError("Only numbers allowed")
    .min(0, "Labour tax cannot be negative")
    .max(100, "Labour tax cannot exceed 100%"),
  itemTax: Yup.string()
    .matches(/^\d+$/, "Only numbers allowed")
    .required("Item tax is required"),
  quantityInStock: Yup.string()
    .matches(/^\d+$/, "Only numbers allowed")
    .required("Quantity in stock is required"),
  minimumStockAlert: Yup.string()
    .matches(/^\d+$/, "Only numbers allowed")
    .required("Minimum stock alert is required"),
  unitOfMeasurement: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Remove any spaces at before and after")
    .required("Unit of measurement is required"),
  warrantyPeriod: Yup.string()
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "Only numbers allowed")
    .required("Warranty period is required"),
})

export { ManagerValidationSchema, AdvisorValidationSchema, CustomerValidationSchema, AdminValidationSchema, itemValidationSchema };