import { NgModule } from '@angular/core';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompanyCreateComponent } from './company-create/company-create.component';
import { SharedModule } from 'src/app/helper/shared/shared.module';


@NgModule({
  declarations: [CompaniesListComponent, CompanyCreateComponent],
  imports: [
    SharedModule,
    CompaniesRoutingModule
  ]
})
export class CompaniesModule { }
