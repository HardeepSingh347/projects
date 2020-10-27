import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCompany from './company.reducer';

export const getCompanyState = createFeatureSelector<fromCompany.State>(
  fromCompany.companyFeatureKey
);

export const isCompanyLoading = createSelector(
  getCompanyState,
  (state) => state.loading
);

export const isCompanyLoaded = createSelector(
  getCompanyState,
  (state) => state.loaded
);

export const getCompanyError = createSelector(
  getCompanyState,
  (state) => state.error
);

export const selectAllCompanies = createSelector(
  getCompanyState,
  fromCompany.select.selectAll
);

export const selectEntities = createSelector(
  getCompanyState,
  fromCompany.select.selectEntities
);

export const selectCompanyEntity = (id: string) =>
  createSelector(selectEntities, (companies) => companies[id]);
