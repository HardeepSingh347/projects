export interface User {
  _id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  role?: any;
  profileImage?: string;
  password?: string;
  phone?: string;
  suspended?: boolean;
  deleted?: boolean;
  suspendedBy?: string;
  banned?: boolean;
  bannedBy?: string;
  createdBy?: string;
  companyId?: any;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}
