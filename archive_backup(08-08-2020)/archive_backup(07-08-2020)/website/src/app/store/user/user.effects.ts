import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/helper/alert/alert.service';
import { Router } from '@angular/router';
import { concatMap, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable()
export class UserEffects {
  loadingUsers$ = createEffect(() => {
    return this.action$.pipe(
      ofType(UserActions.loadingUsers),
      concatMap((action) =>
        this.userService.fetchAllUsers().pipe(
          map((response) => {
            if (response.status) {
              return UserActions.loadUsers({ users: response.result });
            } else {
              return UserActions.loadUsers({ users: [] });
            }
          })
        )
      )
    );
  });

  addUser$ = createEffect(() => {
    return this.action$.pipe(
      ofType(UserActions.addUser),
      concatMap((action) =>
        this.userService.createUser(action.data).pipe(
          map((response) => {
            if (response.status) {
              this.alertService.showSnackbar('User added successfully');
              this.router.navigate(['dashboard', 'user']);
              return UserActions.addUserSuccess({ user: response.result });
            } else {
              return UserActions.addUserFailure({
                error: {
                  type: 'invalid',
                  message: response.error_msg,
                  errorFields: response.error_fields,
                },
              });
            }
          })
        )
      )
    );
  });

  updateUser$ = createEffect(() => {
    return this.action$.pipe(
      ofType(UserActions.updateUser),
      concatMap((action) =>
        this.userService.updateUser(action.data, action.id).pipe(
          map((response) => {
            if (response.status) {
              this.alertService.showSnackbar('User updated successfully');
              this.router.navigate(['dashboard', 'user']);
              return UserActions.updateUserSuccess({ user: response.result });
            } else {
              return UserActions.updateUserFailure({
                error: {
                  type: 'invalid',
                  message: response.error_msg,
                  errorFields: response.error_fields,
                },
              });
            }
          })
        )
      )
    );
  });

  suspendUser$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(UserActions.suspendUser),
        concatMap((action) =>
          this.userService.suspendUser(action.id).pipe(
            map((response) => {
              if (response.status) {
                this.alertService.showSnackbar('user account suspended');
                return EMPTY;
              } else {
                return EMPTY;
              }
            })
          )
        )
      );
    },
    { dispatch: false }
  );

  banUser$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(UserActions.banUser),
        concatMap((action) =>
          this.userService.banUser(action.id).pipe(
            map((response) => {
              if (response.status) {
                this.alertService.showSnackbar('user account banned');
                return EMPTY;
              } else {
                return EMPTY;
              }
            })
          )
        )
      );
    },
    { dispatch: false }
  );

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private action$: Actions,
    private router: Router
  ) {}
}
