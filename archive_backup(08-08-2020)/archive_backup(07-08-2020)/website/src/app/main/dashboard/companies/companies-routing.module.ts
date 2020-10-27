import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompanyCreateComponent } from './company-create/company-create.component';
import { CompanyResolver } from 'src/app/resolvers/company.resolver';

const routes: Routes = [
  {
    path: '',
    component: CompaniesListComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      company: CompanyResolver,
    },
  },
  { path: 'create', component: CompanyCreateComponent },
  { path: 'view/:id', component: CompanyCreateComponent },
  { path: 'edit/:id', component: CompanyCreateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
