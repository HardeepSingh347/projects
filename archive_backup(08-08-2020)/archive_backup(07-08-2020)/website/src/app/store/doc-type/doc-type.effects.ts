import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import * as DocTypeActions from "./doc-type.actions";
import { Router } from "@angular/router";
import { DocTypeService } from "src/app/services/doc-type.service";
import { AlertService } from "src/app/helper/alert/alert.service";
import { concatMap, map } from "rxjs/operators";
import { EMPTY } from "rxjs";

@Injectable()
export class DocTypeEffects {
  loadingDocTypes$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocTypeActions.loadingDocTypes),
      concatMap((action) =>
        this.docTypeService.fetchDocTypes().pipe(
          map((response) => {
            if (response.status) {
              return DocTypeActions.loadDocTypes({
                docTypes: response.result,
              });
            } else {
              return DocTypeActions.loadDocTypes({ docTypes: [] });
            }
          })
        )
      )
    );
  });
  addDocType$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocTypeActions.addDocType),
      concatMap((action) =>
        this.docTypeService.createDocType(action.docType).pipe(
          map((response) => {
            if (response.status) {
              this.helperService.showSnackbar(
                "success",
                "Category added successfully"
              );
              this.router.navigate(["dashboard", "category"]);
              return DocTypeActions.addDocTypeSuccess({
                docType: response.result,
              });
            } else {
              return DocTypeActions.addDocTypeFailure({
                error: {
                  type: "invalid",
                  message: response.message,
                  errorFields: response.error_fields,
                },
              });
            }
          })
        )
      )
    );
  });
  updateDocType$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocTypeActions.updateDocType),
      concatMap((action) =>
        this.docTypeService
          .updateDocType(action.docType, action.docType._id)
          .pipe(
            map((response) => {
              if (response.status) {
                this.helperService.showSnackbar(
                  "success",
                  "doc type updated successfully"
                );
                this.router.navigate(["dashboard", "category"]);
                return DocTypeActions.updateDocTypeSuccess({
                  docType: response.result,
                });
              } else {
                return DocTypeActions.updateDocTypeFailure({
                  error: {
                    type: "invalid",
                    message: response.message,
                    errorFields: response.error_fields,
                  },
                });
              }
            })
          )
      )
    );
  });
  deleteDocType$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(DocTypeActions.deleteDocType),
        concatMap((action) =>
          this.docTypeService.deleteDocType(action.id).pipe(
            map((response) => {
              if (response.status) {
                this.helperService.showSnackbar(
                  "success",
                  "doc type deleted successfully"
                );
                return EMPTY;
              } else {
                return EMPTY;
              }
            })
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private action$: Actions,
    private router: Router,
    private docTypeService: DocTypeService,
    private helperService: AlertService
  ) {}
}
