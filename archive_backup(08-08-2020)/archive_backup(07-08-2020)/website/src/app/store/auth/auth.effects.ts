import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, concatMap, tap, switchMap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import * as AuthActions from "./auth.actions";
import { clearDocuments } from "./../document/document.actions";
import { clearUsers } from "./../user/user.actions";
import { clearCompanies } from "./../company/company.actions";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { AlertService } from "src/app/helper/alert/alert.service";

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      concatMap((action) =>
        this.authService.login(action.data).pipe(
          map((response) => {
            if (response.status) {
              if (action.returnToUrl) {
                this.router.navigateByUrl(action.returnToUrl);
              } else {
                this.router.navigate(["dashboard"]);
              }
              return AuthActions.loginSuccess({ user: response.user });
            } else {
              return AuthActions.loginFailure({
                error: {
                  type: "Invalid",
                  message: response.error_msg,
                },
              });
            }
          }),
          catchError((error) => EMPTY)
        )
      )
    );
  });

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) =>
          localStorage.setItem("user", JSON.stringify(action.user))
        )
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => {
        this.router.navigate(["auth", "login"]);
        localStorage.removeItem("user");
        return [clearDocuments(), clearUsers(), clearCompanies()];
      })
    )
  );

  forgotPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      concatMap((action) =>
        this.authService.forgotPassword({ email: action.email }).pipe(
          map((response) => {
            if (response.status) {
              this.alertService.showSnackbar(
                "Verification OTP sent on your email"
              );
              this.router.navigate(["auth", "validate-otp"]);
              return AuthActions.forgotPasswordSuccess({
                otpId: response.result,
              });
            } else {
              return AuthActions.forgotPasswordFailure({
                error: {
                  type: "Invalid",
                  message: response.error_msg,
                },
              });
            }
          }),
          catchError((error) => EMPTY)
        )
      )
    );
  });

  forgotPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.forgotPasswordSuccess),
        tap((action) =>
          localStorage.setItem("otpId", JSON.stringify(action.otpId))
        )
      ),
    { dispatch: false }
  );

  validateOTP$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.otpValidation),
      concatMap((action) =>
        this.authService
          .otpValidation({ otpId: action.otpId, otp: action.otp })
          .pipe(
            map((response) => {
              if (response.status) {
                this.router.navigate(["auth", "reset-password"]);
                return AuthActions.otpValidationSuccess({
                  userId: response.result,
                });
              } else {
                return AuthActions.otpValidationFailure({
                  error: {
                    type: "Invalid",
                    message: response.error_msg,
                  },
                });
              }
            }),
            catchError((error) => EMPTY)
          )
      )
    );
  });

  validateOTPSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.otpValidationSuccess),
        tap((action) =>
          localStorage.setItem("userId", JSON.stringify(action.userId))
        )
      ),
    { dispatch: false }
  );

  resetForgotPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      concatMap((action) =>
        this.authService
          .resetPassword({ userId: action.userId, password: action.password })
          .pipe(
            map((response) => {
              if (response.status) {
                this.alertService.showSnackbar("Password changed.");
                this.router.navigate(["auth", "login"]);
                return AuthActions.resetPasswordSuccess();
              } else {
                return AuthActions.resetPasswordFailure({
                  error: {
                    type: "Invalid",
                    message: response.error_msg,
                  },
                });
              }
            }),
            catchError((error) => EMPTY)
          )
      )
    );
  });

  changeForgotPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.changePassword),
      concatMap((action) =>
        this.authService
          .changePassword({
            currentPassword: action.currentPassword,
            newPassword: action.newPassword,
          })
          .pipe(
            map((response) => {
              if (response.status) {
                this.alertService.showSnackbar("Password changed.");
                this.router.navigate(["dashboard", "profile"]);
                return AuthActions.changePasswordSuccess();
              } else {
                return AuthActions.changePasswordFailure({
                  error: {
                    type: "Invalid",
                    message: response.error_msg,
                  },
                });
              }
            }),
            catchError((error) => EMPTY)
          )
      )
    );
  });

  updateProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      concatMap((acttion) =>
        this.authService.updateProfile(acttion.data).pipe(
          map((response) => {
            if (response.status) {
              this.alertService.showSnackbar("Profile updated successfully");
              return AuthActions.logout();
            } else {
              return AuthActions.updateProfileFailure({
                error: {
                  type: "Invalid",
                  message: response.error_msg,
                },
              });
            }
          })
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}
}
