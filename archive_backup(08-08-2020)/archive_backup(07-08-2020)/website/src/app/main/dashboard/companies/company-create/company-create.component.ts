import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import {
  getCompanyError,
  selectCompanyEntity,
} from 'src/app/store/company/company.selectors';
import { addCompany, updateCompany } from 'src/app/store/company/company.actions';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.css'],
})
export class CompanyCreateComponent
  implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('companyForm') companyForm: ElementRef<NgForm>;
  loadingSubscription: Subscription;
  errorsSubscription: Subscription;
  companySubscription: Subscription;

  loading = true;
  mode: string;

  companyDetails: Company;
  id: string;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.mode = url[0].path;
    });

    this.errorsSubscription = this.store.pipe(select(getCompanyError)).subscribe((error) => {
      this.loading = false;
      if (error) {
        if (error.hasOwnProperty('type')) {
          for (const errorValue of error?.errorFields) {
            switch (errorValue) {
              case 'companyId':
                // tslint:disable-next-line: no-string-literal
                this.companyForm['form']?.controls['companyId']?.setErrors({
                  unique: true,
                });
                break;
              default:
                console.log(errorValue);
                break;
            }
          }
        }
      }
    });

    if (this.mode === 'edit' || this.mode === 'view') {
      this.route.paramMap.subscribe((params: ParamMap) => {
        if (params.has('id')) {
          this.id = params.get('id');
          this.companySubscription = this.store
            .pipe(select(selectCompanyEntity(this.id)))
            .subscribe((companyDetails) => {
              if (companyDetails) {
                this.companyDetails = companyDetails;
              } else {
                this.router.navigate(['dashboard', 'company']);
              }
            });
        } else {
          this.router.navigate(['dashboard', 'company']);
        }
      });
    }
  }

  ngAfterViewInit() {
  }

  onCreateCompany = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    const formValues = form.value;
    if (this.mode === 'create') {
      this.store.dispatch(addCompany({ company: formValues }));
    } else {
      formValues._id = this.id;
      this.store.dispatch(updateCompany({ company: formValues }));
    }
  }

  ngOnDestroy = () => {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.errorsSubscription) {
      this.errorsSubscription.unsubscribe();
    }
    if (this.companySubscription) {
      this.companySubscription.unsubscribe();
    }
  }
}
