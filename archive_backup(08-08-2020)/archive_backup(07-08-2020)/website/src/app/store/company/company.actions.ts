import { createAction, props } from '@ngrx/store';
import { ErrorForm } from 'src/app/models/errorform.model';
import { Company } from 'src/app/models/company.model';


export const loadingCompanies = createAction(
  '[Company/Resolver] Loading Companies'
);

export const loadCompanies = createAction(
  '[Company/Effects] Loaded Companies',
  props<{ companies: Company[] }>()
);

export const setLoadingFalse = createAction(
  '[Company/Loading False] Set Loading Companies'
);

export const setLoadedFalse = createAction(
  '[Company/Loaded False] Set Loaded Companies'
);
export const addCompany = createAction(
  '[Company/Component] Add New Company',
  props<{ company: Company }>()
);
export const addCompanySuccess = createAction(
  '[Company/Effects] Add New Company Success',
  props<{ company: Company }>()
);
export const addCompanyFailure = createAction(
  '[Company/Effects] Add New Company Failure',
  props<{ error: ErrorForm }>()
);

export const updateCompany = createAction(
  '[Company/Component] Update Company',
  props<{ company: Company }>()
);
export const updateCompanySuccess = createAction(
  '[Company/Effects] Update Company Success',
  props<{ company: Company }>()
);
export const updateCompanyFailure = createAction(
  '[Company/Effects] Update Company Failure',
  props<{ error: ErrorForm }>()
);

export const deleteCompany = createAction(
  '[Company/List Component] Delete Company',
  props<{ id: string }>()
);
export const clearCompanies = createAction(
  '[Company/Logout] Remove All Companies'
);
