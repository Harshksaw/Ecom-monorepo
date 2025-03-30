// src/app/cart/types.ts

export interface CartItem {
    id: string;
    _id?: string;
    name?: string;
    quantity: number;
    oneQuantityPrice: number;
    price: number;
    attributes?: {
      name?: string;
      price?: number;
      salePrice?: number;
      stockQuantity?: number;
      images?: string[];
      materials?: string[];
    };
  }
  
  export interface Address {
    _id?: string;
    type: 'billing' | 'shipping';
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }
  
  export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    addresses?: Address[];
  }