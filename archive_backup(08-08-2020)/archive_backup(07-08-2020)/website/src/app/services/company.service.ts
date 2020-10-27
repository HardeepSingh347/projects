import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  baseUrl = 'companies/';

  constructor(private apiService: ApiService) {}

  createCompany = (data: Company) =>
    this.apiService.postDataApi(data, this.baseUrl)

  fetchCompanies = () => this.apiService.getDataApi(this.baseUrl);

  fetchCompany = (id: string) => this.apiService.getDataApi(this.baseUrl + id);

  updateCompany = (data: Company, id: string) =>
    this.apiService.patchDataApi(data, this.baseUrl + id)

  deleteCompany = (id: string) =>
    this.apiService.deleteDataApi(this.baseUrl + id)
}
