import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserResolver } from 'src/app/resolvers/user.resolver';
import { SuspendedUsersComponent } from './suspended-users/suspended-users.component';
import { CompanyResolver } from 'src/app/resolvers/company.resolver';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      user: UserResolver,
      company: CompanyResolver,
    },
  },
  {
    path: 'suspended-user',
    component: SuspendedUsersComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      user: UserResolver,
    },
  },
  {
    path: 'create',
    component: UserCreateComponent,
    resolve: {
      company: CompanyResolver,
    },
  },
  { path: 'view/:id', component: UserCreateComponent },
  { path: 'edit/:id', component: UserCreateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
