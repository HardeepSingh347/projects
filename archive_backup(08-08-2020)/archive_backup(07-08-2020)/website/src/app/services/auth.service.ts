import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL = 'auth/';

  constructor(private apiService: ApiService) {}

  login = (data) => {
    const url = this.baseURL + 'login';
    return this.apiService.postDataApi(data, url);
  }

  forgotPassword = (data) => {
    const url = this.baseURL + 'forgot-password';
    return this.apiService.postDataApi(data, url);
  }

  otpValidation = (data) => {
    const url = this.baseURL + 'validate-otp';
    return this.apiService.postDataApi(data, url);
  }

  resetPassword = (data) => {
    const url = this.baseURL + 'reset-password';
    return this.apiService.postDataApi(data, url);
  }

  changePassword = data => {
    const url = this.baseURL + 'change-password';
    return this.apiService.postDataApi(data, url);
  }

  updateProfile = data => {
    const url = this.baseURL + 'update-profile';
    return this.apiService.patchDataApi(data, url);
  }
}
