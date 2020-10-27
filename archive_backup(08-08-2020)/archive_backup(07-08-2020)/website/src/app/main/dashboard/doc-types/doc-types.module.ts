import { NgModule } from "@angular/core";

import { DocTypesRoutingModule } from "./doc-types-routing.module";
import { DocTypesListComponent } from "./doc-types-list/doc-types-list.component";
import { DocTypesCreateComponent } from "./doc-types-create/doc-types-create.component";
import { SharedModule } from "src/app/helper/shared/shared.module";

@NgModule({
  declarations: [DocTypesListComponent, DocTypesCreateComponent],
  imports: [SharedModule, DocTypesRoutingModule],
})
export class DocTypesModule {}
