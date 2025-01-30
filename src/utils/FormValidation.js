import * as Yup from 'yup';

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu)$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

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
  joiningDate: Yup.date().typeError("Invalid date format").required("Joining date is required"),
  designation: Yup.string().required("Designation is required"),
  branchName: Yup.string().required("Branch name is required"),
  branchLocation: Yup.string().required("Branch location is required"),
  department: Yup.string().required("Department is required"),
  status: Yup.string().oneOf(["Active", "In Active"])
    .required("Status is required"),
});

export default ManagerValidationSchema;
