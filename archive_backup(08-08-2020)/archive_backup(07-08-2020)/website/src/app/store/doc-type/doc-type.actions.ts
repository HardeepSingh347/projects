import { createAction, props } from "@ngrx/store";
import { DocType } from "src/app/models/doc-type.model";
import { ErrorForm } from "src/app/models/errorform.model";

export const loadingDocTypes = createAction(
  "[DocType/Resolver] Loading Doc Types"
);
export const loadDocTypes = createAction(
  "[DocType/Effects] Loaded Doc Types",
  props<{ docTypes: DocType[] }>()
);
export const setLoadingFalse = createAction(
  "[DocType/Loading False] Set Loading Doc Types False"
);
export const setLoadedFalse = createAction(
  "[DocType/Loaded False] Set Loaded Doc Types False"
);

export const addDocType = createAction(
  "[DocType/Component] Add New Doc Type",
  props<{ docType: DocType }>()
);
export const addDocTypeSuccess = createAction(
  "[DocType/Effects] Add New Doc Type Success",
  props<{ docType: DocType }>()
);
export const addDocTypeFailure = createAction(
  "[DocType/Effects] Add New Doc Type Failure",
  props<{ error: ErrorForm }>()
);

export const updateDocType = createAction(
  "[DocType/Component] Update Doc Type",
  props<{ docType: DocType }>()
);
export const updateDocTypeSuccess = createAction(
  "[DocType/Effects] Update Doc Type Success",
  props<{ docType: DocType }>()
);
export const updateDocTypeFailure = createAction(
  "[DocType/Effects] Update Doc Type Failure",
  props<{ error: ErrorForm }>()
);

export const deleteDocType = createAction(
  "[DocType/List Component] Delete Doc Type",
  props<{ id: string }>()
);
export const clearDocType = createAction(
  "[DocType/Logout] Remove All Doc Types"
);
