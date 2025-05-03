import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/app/lib/models/user';
import { RegisterInput, registerSchema, validate } from '@/lib/validators';
import { apiHandler, successResponse, errorResponse } from '@/lib/api-utils';
import { signInToken } from '