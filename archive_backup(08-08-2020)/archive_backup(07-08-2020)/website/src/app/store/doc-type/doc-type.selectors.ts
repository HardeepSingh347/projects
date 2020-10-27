import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromDocType from "./doc-type.reducer";

export const getDocTypeState = createFeatureSelector<fromDocType.State>(
  fromDocType.docTypeFeatureKey
);

export const isDocTypeLoading = createSelector(
  getDocTypeState,
  (state) => state.loading
);

export const isDocTypeLoaded = createSelector(
  getDocTypeState,
  (state) => state.loaded
);

export const getDocTypeError = createSelector(
  getDocTypeState,
  (state) => state.error
);

export const selectAllDocTypes = createSelector(
  getDocTypeState,
  fromDocType.select.selectAll
);

export const selectEntities = createSelector(
  getDocTypeState,
  fromDocType.select.selectEntities
);

export const selectDocTypeEntity = (id: string) =>
  createSelector(selectEntities, (docTypes) => docTypes[id]);
