import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "../../environments/environment";
import * as fromDocument from "./document/document.reducer";
import * as fromUser from "./user/user.reducer";
import * as fromCompany from "./company/company.reducer";
import * as fromDocType from "./doc-type/doc-type.reducer";

// tslint:disable-next-line: no-empty-interface
export interface AppState {}

export const reducers: ActionReducerMap<AppState> = {
  document: fromDocument.reducer,
  user: fromUser.reducer,
  company: fromCompany.reducer,
  docType: fromDocType.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
