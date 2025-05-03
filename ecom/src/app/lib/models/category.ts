import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Address interface
export interface IAddress {
  type: 'billing' | 'shipping';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// User interface
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  phoneNumber?: string;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  confirmationToken?: string;
  confirmationTokenExpires?: Date;
  comparePassword: (password: string) => Promise<boolean>;
  generateConfirmationToken: () => string;
}

// Create a schema for Address
const AddressSchema = new Schema<IAddress>({
  type: { type: String, enum: ['billing', 'shipping'], required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

// Create a schema for User
const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer' 
  },
  phoneNumber: { 
    type: String 
  },
  addresses: [AddressSchema],
  confirmationToken: String,
  confirmationTokenExpires: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Before saving a user, hash the password if it's modified
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate confirmation token
UserSchema.methods.generateConfirmationToken = function(): string {
  const token = crypto.randomBytes(32).toString('hex');
  
  this.confirmationToken = token;
  
  // Token expires in 24 hours
  const date = new Date();
  date.setDate(date.getDate() + 1);
  this.confirmationTokenExpires = date;
  
  return token;
};

// Create or get the model
const User = (mongoose.models.User || mongoose.model<IUser>('User', UserSchema)) as Model<IUser>;

export default User;