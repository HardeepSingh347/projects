import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/helper/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ValidateOtpComponent } from './validate-otp/validate-otp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [AuthComponent, LoginComponent, ForgotPasswordComponent, ValidateOtpComponent, ResetPasswordComponent],
  imports: [
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
