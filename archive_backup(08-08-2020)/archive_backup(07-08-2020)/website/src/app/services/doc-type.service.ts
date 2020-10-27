import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DocType } from "../models/doc-type.model";

@Injectable({
  providedIn: "root",
})
export class DocTypeService {
  baseUrl = "doc-types/";

  constructor(private apiService: ApiService) {}

  createDocType = (data: DocType) =>
    this.apiService.postDataApi(data, this.baseUrl);

  fetchDocTypes = () => this.apiService.getDataApi(this.baseUrl);

  fetchDocType = (id: string) => this.apiService.getDataApi(this.baseUrl + id);

  updateDocType = (data: DocType, id: string) =>
    this.apiService.patchDataApi(data, this.baseUrl + id);

  deleteDocType = (id: string) =>
    this.apiService.deleteDataApi(this.baseUrl + id);
}
