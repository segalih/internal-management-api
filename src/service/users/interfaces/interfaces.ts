export interface IUserLoginAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  role_id: number;
  image_id: number;
  branch_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}
