import { createReducer, Action, on } from "@ngrx/store";
import * as DocTypeActions from "./doc-type.actions";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { DocType } from "src/app/models/doc-type.model";
import { ErrorForm } from "src/app/models/errorform.model";

export const docTypeFeatureKey = "docType";

export interface State extends EntityState<DocType> {
  loading: boolean;
  loaded: boolean;
  error: ErrorForm;
}

const adapter: EntityAdapter<DocType> = createEntityAdapter<DocType>({
  selectId: (docType) => docType._id,
});

const initialState: State = adapter.getInitialState({
  loaded: false,
  loading: false,
  error: undefined,
});

const docTypeReducer = createReducer(
  initialState,
  on(DocTypeActions.loadingDocTypes, (state, action) => {
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(DocTypeActions.loadDocTypes, (state, action) =>
    adapter.setAll(action.docTypes, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),
  on(DocTypeActions.setLoadedFalse, (state, action) => {
    return {
      ...state,
      loaded: false,
    };
  }),
  on(DocTypeActions.setLoadingFalse, (state, action) => {
    return {
      ...state,
      loading: false,
    };
  }),
  on(DocTypeActions.addDocType, (state, action) => {
    return {
      ...state,
      loading: true,
      error: undefined,
    };
  }),
  on(DocTypeActions.addDocTypeSuccess, (state, action) =>
    adapter.setOne(action.docType, {
      ...state,
      loading: false,
    })
  ),
  on(DocTypeActions.addDocTypeFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(DocTypeActions.updateDocType, (state, action) => {
    return {
      ...state,
      loading: true,
      error: undefined,
    };
  }),
  on(DocTypeActions.updateDocTypeSuccess, (state, action) =>
    adapter.updateOne(
      { id: action.docType._id, changes: action.docType },
      {
        ...state,
        loading: false,
      }
    )
  ),
  on(DocTypeActions.updateDocTypeFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(DocTypeActions.deleteDocType, (state, action) =>
    adapter.removeOne(action.id, {
      ...state,
      loading: false,
    })
  ),
  on(DocTypeActions.clearDocType, (state, action) =>
    adapter.removeAll({
      ...state,
      ...initialState,
    })
  )
);

export const select = adapter.getSelectors();

export const reducer = (state: State | undefined, action: Action) => {
  return docTypeReducer(state, action);
};
