export interface Document {
  _id?: string;
  name?: string;
  url?: string;
  documentExtension?: string;
  documentType?: string;
  document?: any;
  size?: number;
  type?: string;
  sector?: string;
  period?: any;
  companyId?: any;
  uploadedBy?: any;
  permissions?: any[];
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
