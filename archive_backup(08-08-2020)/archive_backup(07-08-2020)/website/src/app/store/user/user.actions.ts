import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { ErrorForm } from 'src/app/models/errorform.model';

export const loadingUsers = createAction('[Users/Resolver] Loading Users');

export const loadUsers = createAction(
  '[Users/Effects] Load Users',
  props<{ users: User[] }>()
);

export const setLoadingUsersFalse = createAction(
  '[Users/Loading False] Set Loading Users False'
);

export const setLoadedUsersFalse = createAction(
  '[Users/Loaded False] Set Loaded Users False'
);

export const addUser = createAction(
  '[Users/Component] Add New User',
  props<{ data: any }>()
);
export const addUserSuccess = createAction(
  '[Users/Component] Add New User Success',
  props<{ user: User }>()
);
export const addUserFailure = createAction(
  '[Users/Component] Add New User Failure',
  props<{ error: ErrorForm }>()
);

export const updateUser = createAction(
  '[Users/Component] Update User',
  props<{ data: any, id: string }>()
);
export const updateUserSuccess = createAction(
  '[Users/Component] Update User Success',
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  '[Users/Component] Update User Failure',
  props<{ error: ErrorForm }>()
);

export const suspendUser = createAction(
  '[Users/Users List] Suspend User Account',
  props<{ id: string }>()
);

export const banUser = createAction(
  '[Users/Users List] Ban User Account',
  props<{ id: string }>()
);

export const clearUsers = createAction('[Users/Logout] Clear All Users');
