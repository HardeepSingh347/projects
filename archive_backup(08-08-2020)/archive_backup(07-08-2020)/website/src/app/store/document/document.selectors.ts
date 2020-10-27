import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromDocument from './document.reducer';

export const getDocumentState = createFeatureSelector<fromDocument.State>(
  fromDocument.documentFeatureKey
);

export const getDocumentErrors = createSelector(
  getDocumentState,
  (state) => state.error
);

export const isDocumentLoading = createSelector(
  getDocumentState,
  (state) => state.loading
);

export const isDocumentLoaded = createSelector(
  getDocumentState,
  (state) => state.loaded
);

export const selectAll = createSelector(
  getDocumentState,
  fromDocument.select.selectAll
);

export const selectAllDocuments = (docType: string) =>
  createSelector(selectAll, (docs) =>
    docs.filter((doc) => doc.type === docType)
  );

export const selectProgress = createSelector(
  getDocumentState,
  (state) => state.progress
);

export const selectEntites = createSelector(
  getDocumentState,
  fromDocument.select.selectEntities
);

export const selectDocumentEntity = (id) =>
  createSelector(selectEntites, (entities) => entities[id]);
