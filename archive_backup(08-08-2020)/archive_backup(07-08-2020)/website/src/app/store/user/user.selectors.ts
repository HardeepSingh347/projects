import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';

export const getUserState = createFeatureSelector<fromUser.State>(
  fromUser.userFeatureKey
);

export const isUserLoading = createSelector(
  getUserState,
  (state) => state.loading
);

export const isUserLoaded = createSelector(
  getUserState,
  (state) => state.loaded
);

export const getUserError = createSelector(
  getUserState,
  (state) => state.error
);

export const selectAllUsers = createSelector(
  getUserState,
  fromUser.select.selectAll
);

export const selectActiveUsers = createSelector(
  selectAllUsers,
  (users) => users.filter((user) => user.deleted === false)
);

export const selectSuspendedUsers = createSelector(
  selectAllUsers,
  (users) => users.filter((user) => user.deleted === true)
);

export const selectEntities = createSelector(
  getUserState,
  fromUser.select.selectEntities
);

export const selectUserDetails = (id: string) =>
  createSelector(selectEntities, (users) => users[id]);
