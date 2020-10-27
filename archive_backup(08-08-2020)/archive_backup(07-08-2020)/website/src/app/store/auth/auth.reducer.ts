import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from 'src/app/models/user.model';
import { ErrorForm } from 'src/app/models/errorform.model';
import { adapter } from '../document/document.reducer';

export const authFeatureKey = 'auth';

export interface State {
  user: User;
  loading: boolean;
  emailChecked: boolean;
  error: ErrorForm;
  mailVerified: boolean;
  otpId: string;
  userId: string;
}

export const initialState: State = {
  user: undefined,
  loading: false,
  emailChecked: false,
  error: undefined,
  mailVerified: false,
  otpId: undefined,
  userId: undefined,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state, action) => {
    return {
      ...state,
      loading: true,
      error: undefined,
      mailVerified: false,
    };
  }),
  on(AuthActions.loginSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      user: action.user,
      error: undefined,
    };
  }),
  on(AuthActions.loginFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(AuthActions.logout, (state, action) => {
    return {
      ...state,
      ...initialState
    };
  }),
  on(AuthActions.forgotPassword, (state, action) => {
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(AuthActions.forgotPasswordSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      error: undefined,
      otpId: action.otpId,
    };
  }),
  on(AuthActions.forgotPasswordFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      otpId: undefined,
      error: action.error,
    };
  }),
  on(AuthActions.otpValidation, (state, action) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: undefined,
    };
  }),
  on(AuthActions.otpValidationSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      error: undefined,
      userId: action.userId,
    };
  }),
  on(AuthActions.otpValidationFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      userId: undefined,
      error: action.error,
    };
  }),
  on(AuthActions.resetPassword, (state, action) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: undefined,
    };
  }),
  on(AuthActions.resetPasswordSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      error: undefined,
      userId: undefined,
    };
  }),
  on(AuthActions.resetPasswordFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      error: action.error,
    };
  }),
  on(AuthActions.changePassword, (state, action) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: undefined,
    };
  }),
  on(AuthActions.changePasswordSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      error: undefined,
    };
  }),
  on(AuthActions.changePasswordFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      error: action.error,
    };
  }),
  on(AuthActions.updateProfile, (state, action) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: undefined
    };
  }),
  on(AuthActions.updateProfileSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      user: action.data,
      error: undefined
    };
  }),
  on(AuthActions.updateProfileFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      error: action.error,
    };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
