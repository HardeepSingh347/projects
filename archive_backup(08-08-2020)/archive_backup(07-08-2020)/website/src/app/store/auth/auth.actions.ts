import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { ErrorForm } from 'src/app/models/errorform.model';

export const login = createAction(
  '[Auth] Login',
  props<{ data: any, returnToUrl: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: ErrorForm }>()
);

export const forgotPassword = createAction(
  '[Auth] Forgot Password',
  props<{ email: string }>()
);

export const forgotPasswordSuccess = createAction(
  '[Auth] Forgot Password Success',
  props<{ otpId: string }>()
);

export const forgotPasswordFailure = createAction(
  '[Auth] Forgot Password Failure',
  props<{ error: ErrorForm }>()
);

export const otpValidation = createAction(
  '[Auth] OTP Validation',
  props<{ otpId: string, otp: number }>()
);

export const otpValidationSuccess = createAction(
  '[Auth] OTP Validation Success',
  props<{ userId: string }>()
);

export const otpValidationFailure = createAction(
  '[Auth] OTP Validation Failure',
  props<{ error: ErrorForm }>()
);

export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<{ userId: string, password: string }>()
);

export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success'
);

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: ErrorForm }>()
);

export const changePassword = createAction(
  '[Auth] Change Password',
  props<{ currentPassword: string, newPassword: string }>()
);

export const changePasswordSuccess = createAction(
  '[Auth] Change Password Success'
);

export const changePasswordFailure = createAction(
  '[Auth] Change Password Failure',
  props<{ error: ErrorForm }>()
);

export const logout = createAction(
  '[Auth] Logout'
);


export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ data: any }>()
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ data: User }>()
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: ErrorForm }>()
);
