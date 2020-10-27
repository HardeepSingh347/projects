import { NgModule } from "@angular/core";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from "src/app/helper/shared/shared.module";
import { DocumentResolver } from "src/app/resolvers/document.resolver";
import { UserResolver } from "src/app/resolvers/user.resolver";
import { EffectsModule } from "@ngrx/effects";
import { UserEffects } from "src/app/store/user/user.effects";
import { DocumentEffects } from "src/app/store/document/document.effects";
import { CompanyEffects } from "src/app/store/company/company.effects";
import { CompanyResolver } from "src/app/resolvers/company.resolver";
import { DocTypeResolver } from "src/app/resolvers/doc-type.resolver";
import { DocTypeEffects } from "src/app/store/doc-type/doc-type.effects";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    EffectsModule.forFeature([
      UserEffects,
      DocumentEffects,
      CompanyEffects,
      DocTypeEffects,
    ]),
  ],
  providers: [DocumentResolver, UserResolver, CompanyResolver, DocTypeResolver],
})
export class DashboardModule {}
