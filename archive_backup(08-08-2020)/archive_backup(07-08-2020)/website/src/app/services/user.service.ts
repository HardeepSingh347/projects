import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'users/';

  constructor(private apiService: ApiService) {}

  fetchAllUsers = () => this.apiService.getDataApi(this.baseUrl);

  createUser = (data: User) => this.apiService.postDataApi(data, this.baseUrl);

  suspendUser = (id: string) =>
    this.apiService.deleteDataApi(this.baseUrl + id + '/suspend-user')

  banUser = (id: string) =>
    this.apiService.deleteDataApi(this.baseUrl + id + '/ban-user')

  updateUser = (data: any, id: string) =>
    this.apiService.patchDataApi(data, this.baseUrl + id)
}
