export interface ISettings {
  _id: string;
  restaurantName: string;
  restaurantLogo: string | null;
  address: string;
  contactNumber: string;
  email: string;
  currency: string;
  taxPercentage: number;
  serviceChargePercentage: number;
  isTaxEnabled: boolean;
  isServiceChargeEnabled: boolean;
  orderNumberPrefix: string;
  isRestaurantOpen: boolean;
  paymentTimeoutMinutes: number,
  createdAt: string;
  updatedAt: string;
}
