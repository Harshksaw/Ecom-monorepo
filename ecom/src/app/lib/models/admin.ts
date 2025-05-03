import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Admin interface
export interface IAdmin extends Document {
  name: string;
  image?: string;
  address?: string;
  country?: string;
  city?: string;
  email: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  password: string;
  role: 'Admin' | 'Super Admin' | 'Manager' | 'CEO';
  joiningDate?: Date;
  confirmationToken?: string;
  confirmationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  generateConfirmationToken: () => string;
}

// Create schema for Admin
const AdminSchema = new Schema<IAdmin>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String
  },
  address: {
    type: String
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String
  },
  status: {
    type: String,
    required: false,
    default: 'Active',
    enum: ['Active', 'Inactive']
  },
  password: {
    type: String,
    required: false,
    default: () => bcrypt.hashSync('12345678', 10)
  },
  role: {
    type: String,
    required: false,
    default: 'Admin',
    enum: ['Admin', 'Super Admin', 'Manager', 'CEO']
  },
  joiningDate: {
    type: Date
  },
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

// Before saving an admin, hash the password if it's modified
AdminSchema.pre<IAdmin>('save', async function(next) {
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
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate confirmation token
AdminSchema.methods.generateConfirmationToken = function(): string {
  const token = crypto.randomBytes(32).toString('hex');
  
  this.confirmationToken = token;
  
  // Token expires in 10 minutes
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);
  this.confirmationTokenExpires = date;
  
  return token;
};

// Create or get the model
const Admin = (mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)) as Model<IAdmin>;

export default Admin;