import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { logout } from "../store/auth/auth.actions";
import { AppState } from "../store";
import { User } from "../models/user.model";
import { AlertService } from "../helper/alert/alert.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private errorDialogService: AlertService,
    private store: Store<AppState>
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // To check internet connection
    if (!window.navigator.onLine) {
      this.errorDialogService.errorAlert(
        "Oops...",
        "No internet connection found.",
        "error"
      );
      return throwError({ error: "No internet connection found." });
    }

    const user: User = JSON.parse(localStorage.getItem("user"));

    // Add Api token to request
    if (user) {
      if (user.hasOwnProperty("token")) {
        request = request.clone({
          headers: request.headers.set("Authorization", user.token),
        });
      }
    }

    // Add required headers to Apis Requests
    // if (!request.headers.has('Content-Type')) {
    //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    // }
    if (!request.headers.has("X-custom-header")) {
      request = request.clone({
        headers: request.headers.set("X-custom-header", "t2BJ8iKs74vBNx"),
      });
    }

    request = request.clone({
      headers: request.headers.set("Accept", "application/json"),
    });
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // this.errorDialogService.openDialog(event);
        }
        return event;
      }),
      // To handle Errors from server-end
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason:
            error && error.error && error.error.reason
              ? error.error.reason
              : "",
          status: error.status,
        };

        // Redirect to login, And Call logout method
        if (error.status === 403) {
          this.store.dispatch(logout());
        }
        // this.errorDialogService.openDialog(data);
        return throwError(error);
      })
    );
  }
}
