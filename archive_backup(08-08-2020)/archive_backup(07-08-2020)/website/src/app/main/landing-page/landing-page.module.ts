import { NgModule } from '@angular/core';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { SharedModule } from 'src/app/helper/shared/shared.module';


@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    SharedModule,
    LandingPageRoutingModule
  ]
})
export class LandingPageModule { }
