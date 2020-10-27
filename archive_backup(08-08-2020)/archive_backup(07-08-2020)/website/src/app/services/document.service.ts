import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  baseUrl = "documents/";
  constructor(private apiService: ApiService) {}

  fetchAllDocuments = (
    docType: string,
    forDate: string,
    sector: string,
    period: string,
    search: string
  ) =>
    this.apiService.getDataApi(
      `${this.baseUrl}?docType=${encodeURIComponent(
        docType
      )}&date=${forDate}&sector=${encodeURIComponent(
        sector
      )}&period=${encodeURIComponent(period)}&search=${encodeURIComponent(
        search
      )}`
    );

  createDocument = (data) => this.apiService.uploadDataApi(data, this.baseUrl);

  downloadDocument = (id) => this.apiService.downloadDataApi(this.baseUrl + id);

  updateDocument = (data, id) =>
    this.apiService.patchDataApi(data, this.baseUrl + id);

  // grantPermissions = (data, id) =>
  //   this.apiService.postDataApi(data, this.baseUrl + id + '/grant-permission')

  // removePermissions = (data, id) =>
  //   this.apiService.postDataApi(data, this.baseUrl + id + '/remove-permission')
}
