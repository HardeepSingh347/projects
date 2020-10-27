import { createReducer, on, Action } from "@ngrx/store";
import * as UserActions from "./user.actions";
import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { User } from "src/app/models/user.model";
import { ErrorForm } from "src/app/models/errorform.model";

export const userFeatureKey = "user";

export interface State extends EntityState<User> {
  loading: boolean;
  loaded: boolean;
  error: ErrorForm;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user) => user._id,
});

export const initialState = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: undefined,
});

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadingUsers, (state, action) => {
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(UserActions.loadUsers, (state, action) =>
    adapter.setAll(action.users, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),
  on(UserActions.addUser, (state, action) => {
    return {
      ...state,
      loading: true,
      error: undefined,
    };
  }),
  on(UserActions.addUserSuccess, (state, action) =>
    adapter.setOne(action.user, {
      ...state,
      loading: false,
      loaded: false,
      error: undefined,
    })
  ),
  on(UserActions.addUserFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(UserActions.updateUser, (state, action) => {
    return {
      ...state,
      loading: true,
      error: undefined,
    };
  }),
  on(UserActions.updateUserSuccess, (state, action) => {
    console.log("effff", action.user);
    return adapter.updateOne(
      { id: action.user._id, changes: action.user },
      {
        ...state,
        loading: false,
        error: undefined,
      }
    );
  }),
  on(UserActions.updateUserFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  // on(UserActions.banUser, (state, action) =>
  //   adapter.updateOne(
  //     { id: action.id, changes: { banned: true } },
  //     {
  //       ...state,
  //       loading: false,
  //       error: undefined,
  //     }
  //   )
  // ),
  on(UserActions.suspendUser, (state, action) =>
    adapter.updateOne(
      { id: action.id, changes: { deleted: true } },
      {
        ...state,
        loading: false,
        error: undefined,
      }
    )
  ),
  on(UserActions.clearUsers, (state, action) =>
    adapter.removeAll({
      ...state,
      ...initialState,
    })
  )
);

export const select = adapter.getSelectors();

export const reducer = (state: State | undefined, action: Action) => {
  return userReducer(state, action);
};
