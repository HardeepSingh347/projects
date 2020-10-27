import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { MainProfileComponent } from './main-profile/main-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from 'src/app/helper/shared/shared.module';

@NgModule({
  declarations: [
    MainProfileComponent,
    ChangePasswordComponent
  ],
  imports: [SharedModule, ProfileRoutingModule],
})
export class ProfileModule {}
