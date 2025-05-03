// app/api/categories/[id]/route.js
import { NextResponse } from 'next/server';
import Category from '@/models/Category';
import Product from '@/models/Products';
import connectDB from '@/lib/connectDB';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '@/utils/cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Get category by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// Update category
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    // Check authorization (optional - if using authentication)
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, description, slug, imageUrl, isActive } = await request.json();
    
    // Check if updated slug or name conflicts with another category
    if (slug || name) {
      const query = { _id: { $ne: params.id } };
      if (slug) query.slug = slug;
      if (name) query.name = name;
      
      const existingCategory = await Category.findOne(query);
      if (existingCategory) {
        return NextResponse.json(
          { message: 'Category with same name or slug already exists' },
          { status: 400 }
        );
      }
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(slug && { slug }),
        ...(imageUrl && { imageUrl }),
        ...(typeof isActive === 'boolean' && { isActive }),
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// Delete category
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // Check authorization (optional - if using authentication)
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if category is being used by products
    const productsUsingCategory = await Product.countDocuments({ categoryId: params.id });
    if (productsUsingCategory > 0) {
      return NextResponse.json({
        message: 'Cannot delete category as it is being used by products',
        count: productsUsingCategory
      }, { status: 400 });
    }
    
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    
    // Delete category image from Cloudinary if exists
    if (category.imageUrl) {
      try {
        const publicId = getPublicIdFromUrl(category.imageUrl);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (err) {
        console.error(`Error deleting category image:`, err);
        // Continue with deletion even if image deletion fails
      }
    }
    
    const deletedCategory = await Category.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}