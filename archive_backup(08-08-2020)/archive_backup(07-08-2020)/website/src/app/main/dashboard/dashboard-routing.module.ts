import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { OwnerAuthGuard } from "src/app/guards/owner.guard";
import { AdminAuthGuard } from "src/app/guards/admin.guard";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "profile",
        loadChildren: () =>
          import("./profile/profile.module").then((m) => m.ProfileModule),
      },
      {
        path: "user",
        loadChildren: () =>
          import("./users/users.module").then((m) => m.UsersModule),
        canActivate: [AdminAuthGuard],
      },
      {
        path: "company",
        loadChildren: () =>
          import("./companies/companies.module").then((m) => m.CompaniesModule),
        canActivate: [OwnerAuthGuard],
      },
      {
        path: "document",
        loadChildren: () =>
          import("./documents/documents.module").then((m) => m.DocumentsModule),
      },
      {
        path: "category",
        loadChildren: () =>
          import("./doc-types/doc-types.module").then((m) => m.DocTypesModule),
      },
      {
        path: "**",
        redirectTo: "document",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
