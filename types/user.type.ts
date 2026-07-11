export interface IUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export enum EROLES {
  CUSTOMER = "customer",

  CASHIER = "cashier",

  MANAGER = "manager",

  KITCHEN = "kitchen",
}