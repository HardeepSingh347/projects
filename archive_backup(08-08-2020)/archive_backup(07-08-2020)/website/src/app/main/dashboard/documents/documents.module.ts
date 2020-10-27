import { NgModule } from "@angular/core";

import { DocumentsRoutingModule } from "./documents-routing.module";
import { DocumentsListComponent } from "./documents-list/documents-list.component";
import { DocumentCreateComponent } from "./document-create/document-create.component";
import { SharedModule } from "src/app/helper/shared/shared.module";
import { DocumentMainComponent } from "./document-main/document-main.component";

@NgModule({
  declarations: [
    DocumentsListComponent,
    DocumentCreateComponent,
    DocumentMainComponent,
  ],
  imports: [SharedModule, DocumentsRoutingModule],
})
export class DocumentsModule {}
