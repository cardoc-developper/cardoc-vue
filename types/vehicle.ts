export type Vehicle = {
  id: string;
  license_plate: string;
  vehicle_name: string;
  type: string;
  brand: string;
  model: string;
  mileage: number;
  color: string;
  energy: string;
  date_of_first_registration: string;
  date_of_purchase: string;
  number_of_owners: string;
  images: string[];
};

export type VehicleToAdd = {
  userId: string;
  licensePlate: string;
  vehicleName: string;
  type: string;
  brand: string;
  model: string;
  mileage: number;
  color: string;
  energy: string;
  dateOfFirstRegistration: string;
  dateOfPurchase: string;
  numberOfOwners: string;
  images: string[];
};
