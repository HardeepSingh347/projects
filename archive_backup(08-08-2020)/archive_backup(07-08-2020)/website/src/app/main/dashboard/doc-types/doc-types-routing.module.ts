import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DocTypesListComponent } from "./doc-types-list/doc-types-list.component";
import { DocTypeResolver } from "src/app/resolvers/doc-type.resolver";
import { DocTypesCreateComponent } from './doc-types-create/doc-types-create.component';

const routes: Routes = [
  {
    path: "",
    component: DocTypesListComponent,
    resolve: {
      docType: DocTypeResolver,
    },
  },
  {
    path: "create",
    component: DocTypesCreateComponent,
  },
  {
    path: "view/:id",
    component: DocTypesCreateComponent,
  },
  {
    path: "edit/:id",
    component: DocTypesCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocTypesRoutingModule {}
