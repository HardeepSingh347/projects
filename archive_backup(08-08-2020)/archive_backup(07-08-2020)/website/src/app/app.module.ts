import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpConfigInterceptor } from './intercepters/httpconfig.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { LoginAuthGuard } from './guards/loginAuth.guard';
import { reducers, metaReducers } from './store';
import { AuthEffects } from './store/auth/auth.effects';
import * as fromAuth from './store/auth/auth.reducer';
import { SharedModule } from './helper/shared/shared.module';
import { OwnerAuthGuard } from './guards/owner.guard';
import { AdminAuthGuard } from './guards/admin.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: false,
        strictStateSerializability: true
      }
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducer),
    EffectsModule.forRoot([AuthEffects]),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    AuthGuard,
    LoginAuthGuard,
    OwnerAuthGuard,
    AdminAuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
