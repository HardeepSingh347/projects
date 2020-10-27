import { Injectable } from "@angular/core";
import { DocumentService } from "src/app/services/document.service";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { AlertService } from "src/app/helper/alert/alert.service";
import { Router } from "@angular/router";
import * as DocumentActions from "./document.actions";
import { concatMap, map, catchError } from "rxjs/operators";

@Injectable()
export class DocumentEffects {
  addDocument$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentActions.addDocument),
      concatMap((action) =>
        this.docService.createDocument(action.data).pipe(
          map((response) => {
            if (response.status === "progress") {
              return DocumentActions.uploadProgress({
                progress: response.message,
              });
            } else if (response.status) {
              this.alertService.showSnackbar("Document Added.");
              this.router.navigate(["dashboard", "document"]);
              return DocumentActions.addDocumentSuccess({
                document: response.result,
              });
            } else {
              return DocumentActions.addDocumentFailure({
                error: {
                  type: "Invalid",
                  message: response.error_msg,
                },
              });
            }
          })
        )
      )
    );
  });

  loadingDocument$ = createEffect(() =>
    this.action$.pipe(
      ofType(DocumentActions.loadingDocuments),
      concatMap((action) =>
        this.docService
          .fetchAllDocuments(
            action.documentType,
            action.forDate,
            action.sector,
            action.period,
            action.search
          )
          .pipe(
            map((response) => {
              if (response.status) {
                return DocumentActions.loadDocuments({
                  documents: response.result,
                });
              } else {
                return DocumentActions.loadDocuments({ documents: [] });
              }
            })
          )
      )
    )
  );

  updateDocument$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentActions.updateDocument),
      concatMap((action) =>
        this.docService.updateDocument(action.data, action.data._id).pipe(
          map((response) => {
            if (response.status) {
              this.alertService.showSnackbar("document updated successfully");
              this.router.navigate(["dashboard", "document"]);
              return DocumentActions.updateDocumentSuccess({
                document: response.result,
              });
            } else {
              return DocumentActions.updateDocumentFailure({
                error: {
                  type: "Invalid",
                  message: response.error_msg,
                },
              });
            }
          })
        )
      )
    );
  });

  downloadDocument$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentActions.downloadDocument),
      concatMap((action) =>
        this.docService.downloadDocument(action.docId).pipe(
          map((response) => {
            const newBlob = new Blob([response], { type: "text/csv" });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(newBlob);
              return;
            }
            const data = window.URL.createObjectURL(newBlob);

            const link = document.createElement("a");
            link.href = data;
            link.download = action.docName;
            link.dispatchEvent(
              new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
              })
            );

            setTimeout(() => {
              window.URL.revokeObjectURL(data);
              link.remove();
            }, 100);
            return DocumentActions.setLoadingDocumentsFalse();
          }),
          catchError((err) => {
            throw new Error("error in source. Details: " + err);
          })
        )
      )
    );
  });

  constructor(
    private docService: DocumentService,
    private action$: Actions,
    private alertService: AlertService,
    private router: Router
  ) {}
}
