import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DocumentsListComponent } from "./documents-list/documents-list.component";
import { DocumentCreateComponent } from "./document-create/document-create.component";
import { DocumentResolver } from "src/app/resolvers/document.resolver";
import { CompanyResolver } from "src/app/resolvers/company.resolver";
import { DocumentMainComponent } from "./document-main/document-main.component";
import { DocTypeResolver } from "src/app/resolvers/doc-type.resolver";

const routes: Routes = [
  {
    path: "",
    component: DocumentMainComponent,
    resolve: {
      docTypes: DocTypeResolver,
    },
  },
  {
    path: "create",
    component: DocumentCreateComponent,
    resolve: {
      company: CompanyResolver,
      docTypes: DocTypeResolver,
    },
  },
  { path: "view/:id", component: DocumentCreateComponent },
  { path: "edit/:id", component: DocumentCreateComponent },
  {
    path: ":type",
    component: DocumentsListComponent,
    runGuardsAndResolvers: "paramsOrQueryParamsChange",
    resolve: {
      document: DocumentResolver,
      company: CompanyResolver,
      docTypes: DocTypeResolver,
    },
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRoutingModule {}
