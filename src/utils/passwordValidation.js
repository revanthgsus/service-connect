import * as Yup from 'yup';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

const PasswordValidation = Yup.object({
  currentPassword: Yup.string()
    .matches(/^\S*$/, "Please remove any spaces")
    .required("Current password is required"),
  newPassword: Yup.string()
    .matches(/^\S*$/, "Please remove any spaces")
    .matches(passwordRegex, "Password: 8-12 chars, uppercase, numbers, special chars")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

export { PasswordValidation };
