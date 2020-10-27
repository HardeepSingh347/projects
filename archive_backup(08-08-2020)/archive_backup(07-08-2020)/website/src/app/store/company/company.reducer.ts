import { createReducer, on, Action } from '@ngrx/store';
import * as CompanyActions from './company.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Company } from 'src/app/models/company.model';
import { ErrorForm } from 'src/app/models/errorform.model';

export const companyFeatureKey = 'company';

export interface State extends EntityState<Company> {
  loading: boolean;
  loaded: boolean;
  error: ErrorForm;
}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>({
  selectId: (company) => company._id,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: undefined,
});

export const companyReducer = createReducer(
  initialState,
  on(CompanyActions.loadingCompanies, (state, action) => {
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(CompanyActions.loadCompanies, (state, action) =>
    adapter.setAll(action.companies, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),
  on(CompanyActions.setLoadedFalse, (state, action) => {
    return {
      ...state,
      loaded: false,
    };
  }),
  on(CompanyActions.setLoadingFalse, (state, action) => {
    return {
      ...state,
      loading: false,
    };
  }),
  on(CompanyActions.addCompany, (state, action) => {
    return {
      ...state,
      loading: true,
      error: undefined,
    };
  }),
  on(CompanyActions.addCompanySuccess, (state, action) =>
    adapter.setOne(action.company, {
      ...state,
      loading: false,
    })
  ),
  on(CompanyActions.addCompanyFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(CompanyActions.updateCompany, (state, action) => {
    return {
      ...state,
      loading: true,
      error: undefined,
    };
  }),
  on(CompanyActions.updateCompanySuccess, (state, action) =>
    adapter.updateOne(
      { id: action.company._id, changes: action.company },
      {
        ...state,
        loading: false,
      }
    )
  ),
  on(CompanyActions.updateCompanyFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(CompanyActions.deleteCompany, (state, action) =>
    adapter.removeOne(action.id, {
      ...state,
      loading: false,
    })
  ),
  on(CompanyActions.clearCompanies, (state, action) =>
    adapter.removeAll({
      ...state,
      ...initialState,
    })
  )
);

export const select = adapter.getSelectors();

export const reducer = (state: State | undefined, action: Action) => {
  return companyReducer(state, action);
};
