import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as CompanyActions from './company.actions';
import { AlertService } from 'src/app/helper/alert/alert.service';
import { CompanyService } from 'src/app/services/company.service';
import { Router } from '@angular/router';
import { concatMap, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable()
export class CompanyEffects {
  loadingCompanies$ = createEffect(() => {
    return this.action$.pipe(
      ofType(CompanyActions.loadingCompanies),
      concatMap((action) =>
        this.companyService.fetchCompanies().pipe(
          map((response) => {
            if (response.status) {
              return CompanyActions.loadCompanies({
                companies: response.result,
              });
            } else {
              return CompanyActions.loadCompanies({ companies: [] });
            }
          })
        )
      )
    );
  });
  addCompany$ = createEffect(() => {
    return this.action$.pipe(
      ofType(CompanyActions.addCompany),
      concatMap((action) =>
        this.companyService.createCompany(action.company).pipe(
          map((response) => {
            if (response.status) {
              this.helperService.showSnackbar(
                'success',
                'company added successfully'
              );
              this.router.navigate(['dashboard', 'company']);
              return CompanyActions.addCompanySuccess({
                company: response.result,
              });
            } else {
              return CompanyActions.addCompanyFailure({
                error: {
                  type: 'invalid',
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
  updateCompany$ = createEffect(() => {
    return this.action$.pipe(
      ofType(CompanyActions.updateCompany),
      concatMap((action) =>
        this.companyService
          .updateCompany(action.company, action.company._id)
          .pipe(
            map((response) => {
              if (response.status) {
                this.helperService.showSnackbar(
                  'success',
                  'company updated successfully'
                );
                this.router.navigate(['dashboard', 'company']);
                return CompanyActions.updateCompanySuccess({
                  company: response.result,
                });
              } else {
                return CompanyActions.updateCompanyFailure({
                  error: {
                    type: 'invalid',
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
  deleteCompany$ = createEffect(() =>
    this.action$.pipe(
      ofType(CompanyActions.deleteCompany),
      concatMap((action) =>
        this.companyService.deleteCompany(action.id).pipe(
          map((response) => {
            if (response.status) {
              this.helperService.showSnackbar('success', 'company deleted successfully');
              return EMPTY;
            } else {
              return EMPTY;
            }
          })
        )
      )
    ), {dispatch: false}
  );

  constructor(
    private action$: Actions,
    private helperService: AlertService,
    private companyService: CompanyService,
    private router: Router
  ) {}
}
