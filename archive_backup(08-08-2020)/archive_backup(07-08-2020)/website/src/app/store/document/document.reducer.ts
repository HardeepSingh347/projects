import { createReducer, on, Action } from '@ngrx/store';
import * as DocumentActions from './document.actions';
import { ErrorForm } from 'src/app/models/errorform.model';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Document } from 'src/app/models/document.model';

export const documentFeatureKey = 'document';

export interface State extends EntityState<Document> {
  loading: boolean;
  loaded: boolean;
  error: ErrorForm;
  progress: number;
}

export const adapter: EntityAdapter<Document> = createEntityAdapter<Document>({
  selectId: (document) => document._id,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: undefined,
  progress: 0,
});

export const documentReducer = createReducer(
  initialState,
  on(DocumentActions.loadingDocuments, (state, action) => {
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(DocumentActions.loadDocuments, (state, action) =>
    adapter.setAll(action.documents, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),
  on(DocumentActions.setLoadedDocumentsFalse, (state, action) => {
    return {
      ...state,
      loaded: false,
    };
  }),
  on(DocumentActions.setLoadingDocumentsFalse, (state, action) => {
    return {
      ...state,
      loading: false,
    };
  }),
  on(DocumentActions.addDocument, (state, action) => {
    return {
      ...state,
      loading: true,
      error: undefined,
    };
  }),
  on(DocumentActions.addDocumentSuccess, (state, action) =>
    adapter.setOne(action.document, {
      ...state,
      loading: false,
      error: undefined,
      progress: 0
    })
  ),
  on(DocumentActions.addDocumentFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
      progress: 0
    };
  }),
  on(DocumentActions.updateDocument, (state, action) => {
    return {
      ...state,
      loading: true,
      error: undefined,
    };
  }),
  on(DocumentActions.updateDocumentSuccess, (state, action) =>
    adapter.updateOne(
      { id: action.document._id, changes: action.document },
      {
        ...state,
        loading: false,
        error: undefined,
        progress: 0
      }
    )
  ),
  on(DocumentActions.updateDocumentFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
      progress: 0
    };
  }),
  on(DocumentActions.clearDocuments, (state, action) => {
    return adapter.removeAll({
      ...state,
      ...initialState,
    });
  }),
  on(DocumentActions.uploadProgress, (state, action) => {
    return {
      ...state,
      error: undefined,
      progress: action.progress,
    };
  }),
  on(DocumentActions.resetProgress, (state, action) => {
    return {
      ...state,
      error: undefined,
      progress: 0,
    };
  })
);

export const select = adapter.getSelectors();

export const reducer = (state: State | undefined, action: Action) => {
  return documentReducer(state, action);
};
