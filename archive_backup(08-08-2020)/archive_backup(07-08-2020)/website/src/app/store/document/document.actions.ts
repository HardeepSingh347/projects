import { createAction, props } from "@ngrx/store";
import { Document } from "src/app/models/document.model";
import { ErrorForm } from "src/app/models/errorform.model";

export const loadingDocuments = createAction(
  "[Document/Resolver] Loading Documents",
  props<{
    documentType: string;
    forDate: string;
    sector: string;
    period: string;
    search: string;
  }>()
);

export const loadDocuments = createAction(
  "[Document/Effects] Loaded Documents",
  props<{ documents: Document[] }>()
);

export const setLoadingDocumentsFalse = createAction(
  "[Document/Loading False] Set Loading Documents"
);

export const setLoadedDocumentsFalse = createAction(
  "[Document/Loaded False] Set Loaded Documents"
);

export const addDocument = createAction(
  "[Document/Component] Add New Document",
  props<{ data: FormData }>()
);
export const addDocumentSuccess = createAction(
  "[Document/Effects] Add New Document Success",
  props<{ document: Document }>()
);
export const addDocumentFailure = createAction(
  "[Document/Effects] Add New Document Failure",
  props<{ error: ErrorForm }>()
);

export const updateDocument = createAction(
  "[Document/Component] Update Document",
  props<{ data: Document }>()
);
export const updateDocumentSuccess = createAction(
  "[Document/Effects] Update Document Success",
  props<{ document: Document }>()
);
export const updateDocumentFailure = createAction(
  "[Document/Effects] Update Document Failure",
  props<{ error: ErrorForm }>()
);

export const downloadDocument = createAction(
  "[Document/List Component] Download Component",
  props<{ docId: string; docName: string }>()
);

export const uploadProgress = createAction(
  "[Document/Effects] Upload Progress",
  props<{ progress: number }>()
);

export const resetProgress = createAction(
  "[Document/Component] Reset Progress"
);

export const clearDocuments = createAction("[Document/Logout] Clear Documents");
