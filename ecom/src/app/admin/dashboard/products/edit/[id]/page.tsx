"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaPlus,
  FaTrash,
  FaGem,
  FaSpinner
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/app/lib/api";

// Interfaces for type safety
interface Category {
  _id: string;
  name: string;
}

interface Review {
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
}

interface Gem {
  type: string;
  carat: string;
  color: string;
  clarity: string;
}

interface Dimensions {
  length: string;
  width: string;
  height: string;
}

interface Weight {
  value: string;
  unit: string;
}

interface Size {
  type: string;
  size: string;
  _id?: string;
}

interface Variant {
  _id?: string;
  metalColor: string;
  price: Record<string, number>;
  stock: number;
  images?: File[];
  imagePreviews?: string[];
  existingImages?: string[];
  sizes?: Size[];
}

interface DeliveryOption {
  type: string;
  duration: string;
  price: string;
  _id?: string;
}

interface ProductProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: any) {
  const productId = params.id;
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  
  // Basic product info
  const [name, setName] = useState("");
  console.log("🚀 ~ EditProductPage ~ name:", name)
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Material properties
  const [materialType, setMaterialType] = useState("");
  const [purity, setPurity] = useState("");
  const [shape, setShape] = useState("");
  const [color, setColor] = useState("");
  const [materials, setMaterials] = useState<string[]>([""]);

  // Physical properties
  const [weight, setWeight] = useState<Weight>({
    value: "",
    unit: "grams"
  });
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: "",
    width: "",
    height: "",
  });

  // Gems
  const [gems, setGems] = useState<Gem[]>([]);

  // Variants
  const [variants, setVariants] = useState<Variant[]>([{
    metalColor: "gold",
    price: { "default": 0 },
    stock: 0,
    images: [],
    imagePreviews: [],
    existingImages: [],
    sizes: []
  }]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([
    { userName: "", rating: 5, title: "", comment: "", verified: false }
  ]);

  // Delivery options
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([{
    type: "Standard",
    duration: "5-7 business days",
    price: "200"
  }]);

  // Tags
  const [tags, setTags] = useState<string[]>([""]);

  // Main product images
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const router = useRouter();

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoadingProduct(true);
        const response = await axios.get(`${API_URL}/products/${productId}`);
        const product = response.data.product;
        
        // Populate basic info
        setName(product.name || "");
        setSku(product.sku || "");
        setDescription(product.description || "");
        setCategory(product.categoryId?._id || "");
        setIsActive(product.isActive !== false);
        setIsFeatured(product.isFeatured === true);
        
        // Populate material properties
        setMaterialType(product.materialType || "");
        setPurity(product.purity || "");
        setShape(product.shape || "");
        setColor(product.color || "");
        
        // Populate materials
        if (product.materials && product.materials.length > 0) {
          setMaterials(product.materials);
        }
        
        // Populate weight
        if (product.weight) {
          setWeight({
            value: product.weight.value.toString(),
            unit: product.weight.unit || "grams"
          });
        }
        
        // Populate dimensions
        if (product.dimensions) {
          setDimensions({
            length: product.dimensions.length?.toString() || "",
            width: product.dimensions.width?.toString() || "",
            height: product.dimensions.height?.toString() || ""
          });
        }
        
        // Populate gems
        if (product.gems && product.gems.length > 0) {
          setGems(product.gems.map((gem: any) => ({
            type: gem.type || "",
            carat: gem.carat?.toString() || "",
            color: gem.color || "",
            clarity: gem.clarity || ""
          })));
        }
        
        // Populate variants
        if (product.variants && product.variants.length > 0) {
          setVariants(product.variants.map((variant: any) => ({
            _id: variant._id,
            metalColor: variant.metalColor || "gold",
            price: variant.price || { default: 0 },
            stock: variant.stock || 0,
            existingImages: variant.images || [],
            imagePreviews: [],
            images: [],
            sizes: variant.size || []
          })));
        }
        
        // Populate delivery options
        if (product.deliveryOptions && product.deliveryOptions.length > 0) {
          setDeliveryOptions(product.deliveryOptions.map((option: any) => ({
            _id: option._id,
            type: option.type || "",
            duration: option.duration || "",
            price: option.price?.toString() || "0"
          })));
        }
        
        // Populate tags
        if (product.tags && product.tags.length > 0) {
          setTags(product.tags);
        }
        
        // Populate existing images
        if (product.images && product.images.length > 0) {
          setExistingImages(product.images.filter((img: string | null) => img !== null));
        }
        
        // Populate reviews if available
        if (product.reviews && product.reviews.length > 0) {
          setReviews(product.reviews.map((review: any) => ({
            userName: review.userName || "",
            rating: review.rating || 5,
            title: review.title || "",
            comment: review.comment || "",
            verified: review.verified || false
          })));
        }
        
      } catch (error: any) {
        toast.error("Failed to fetch product data: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoadingProduct(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data.categories);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchProductData();
    fetchCategories();
  }, [productId]);

  // Size handling functions
  const addSizeToVariant = (variantIndex: number) => {
    const newVariants = [...variants];
    const currentSizes = newVariants[variantIndex].sizes || [];
    
    newVariants[variantIndex].sizes = [
      ...currentSizes, 
      { type: "standard", size: "" }
    ];
    
    setVariants(newVariants);
  };
  
  const removeSizeFromVariant = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...variants];
    const currentSizes = [...(newVariants[variantIndex].sizes || [])];
    
    currentSizes.splice(sizeIndex, 1);
    newVariants[variantIndex].sizes = currentSizes;
    
    setVariants(newVariants);
  };

  const updateVariantSize = (
    variantIndex: number,
    sizeIndex: number,
    field: keyof Size,
    value: string
  ) => {
    const newVariants = [...variants];
    const currentSizes = [...(newVariants[variantIndex].sizes || [])];
    
    currentSizes[sizeIndex] = {
      ...currentSizes[sizeIndex],
      [field]: value
    };
    
    newVariants[variantIndex].sizes = currentSizes;
    setVariants(newVariants);
  };

  // Delivery option handlers
  const handleChange = (
    idx: number,
    field: keyof DeliveryOption,
    value: string | number
  ) => {
    const opts = [...deliveryOptions];
    // @ts-ignore
    opts[idx][field] = value;
    setDeliveryOptions(opts);
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = validateFiles(Array.from(files));
    if (images.length + validFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages([...images, ...validFiles]);
    setImagePreviews([...imagePreviews, ...validFiles.map(file => URL.createObjectURL(file))]);
  };

  // Variant image upload handler
  const handleVariantImageUpload = (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = validateFiles(Array.from(files));
    const updatedVariants = [...variants];
    const currentVariant = updatedVariants[variantIndex];

    const currentImages = currentVariant.images || [];
    const currentPreviews = currentVariant.imagePreviews || [];
    const existingImagesCount = currentVariant.existingImages?.length || 0;

    if (existingImagesCount + currentImages.length + validFiles.length > 3) {
      toast.error("Maximum 3 images per variant allowed");
      return;
    }

    const newImages = [...currentImages, ...validFiles];
    const newPreviews = [...currentPreviews, ...validFiles.map(file => URL.createObjectURL(file))];

    updatedVariants[variantIndex] = {
      ...currentVariant,
      images: newImages,
      imagePreviews: newPreviews,
    };

    setVariants(updatedVariants);
  };

  // Validate image files
  const validateFiles = (files: File[]) => {
    return files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error(
          `Invalid file type for ${file.name}. Please upload JPEG, PNG, or GIF.`
        );
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }

      return true;
    });
  };

  // Remove main image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Remove existing image
  const removeExistingImage = (index: number) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
  };

  // Remove variant image
  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    const currentVariant = variants[variantIndex];
    const currentImages = currentVariant.images || [];
    const currentPreviews = currentVariant.imagePreviews || [];

    const newImages = currentImages.filter((_, i) => i !== imageIndex);
    const newPreviews = currentPreviews.filter((_, i) => i !== imageIndex);

    updateVariant(variantIndex, 'images', newImages);
    updateVariant(variantIndex, 'imagePreviews', newPreviews);
  };

  // Remove variant existing image
  const removeVariantExistingImage = (variantIndex: number, imageIndex: number) => {
    const currentVariant = variants[variantIndex];
    const currentExistingImages = currentVariant.existingImages || [];

    const newExistingImages = currentExistingImages.filter((_, i) => i !== imageIndex);
    updateVariant(variantIndex, 'existingImages', newExistingImages);
  };

  // Add/remove material input fields
  const addMaterial = () => {
    setMaterials([...materials, ""]);
  };

  const removeMaterial = (index: number) => {
    const newMaterials = materials.filter((_, i) => i !== index);
    setMaterials(newMaterials);
  };

  const updateMaterial = (index: number, value: string) => {
    const newMaterials = [...materials];
    newMaterials[index] = value;
    setMaterials(newMaterials);
  };

  // Add/remove gem input fields
  const addGem = () => {
    setGems([...gems, { type: "", carat: "", color: "", clarity: "" }]);
  };

  const removeGem = (index: number) => {
    const newGems = gems.filter((_, i) => i !== index);
    setGems(newGems);
  };

  const updateGem = (index: number, field: keyof Gem, value: string) => {
    const newGems = [...gems];
    newGems[index] = { ...newGems[index], [field]: value };
    setGems(newGems);
  };

  // Add/remove variant
  const addVariant = () => {
    setVariants([...variants, {
      metalColor: "gold",
      price: { "default": 0 },
      stock: 0,
      images: [],
      imagePreviews: [],
      existingImages: [],
      sizes: []
    }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      toast.error("At least one variant is required");
      return;
    }
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  // Update variant price
  const updateVariantPrice = (variantIndex: number, priceKey: string, value: number) => {
    const newVariants = [...variants];
    const currentPrices = newVariants[variantIndex].price || {};
    newVariants[variantIndex].price = { ...currentPrices, [priceKey]: value };
    setVariants(newVariants);
  };

  // Add variant price option
  const addVariantPriceOption = (variantIndex: number) => {
    const newPriceKey = `option_${Object.keys(variants[variantIndex].price).length}`;
    updateVariantPrice(variantIndex, newPriceKey, 0);
  };

  // Remove variant price option
  const removeVariantPriceOption = (variantIndex: number, priceKey: string) => {
    if (Object.keys(variants[variantIndex].price).length === 1) {
      toast.error("At least one price option is required");
      return;
    }

    const newVariants = [...variants];
    const newPrices = { ...newVariants[variantIndex].price };
    delete newPrices[priceKey];
    newVariants[variantIndex].price = newPrices;
    setVariants(newVariants);
  };

  // Add/remove delivery option
  const addDeliveryOption = () => {
    setDeliveryOptions([...deliveryOptions, {
      type: "",
      duration: "",
      price: "0"
    }]);
  };

  const removeDeliveryOption = (index: number) => {
    const newDeliveryOptions = deliveryOptions.filter((_, i) => i !== index);
    setDeliveryOptions(newDeliveryOptions);
  };

  const updateDeliveryOption = (index: number, field: keyof DeliveryOption, value: string) => {
    const newDeliveryOptions = [...deliveryOptions];
    newDeliveryOptions[index] = { ...newDeliveryOptions[index], [field]: value };
    setDeliveryOptions(newDeliveryOptions);
  };

  // Add/remove tag input fields
  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  // Reviews handlers
  const addReview = () => {
    setReviews([...reviews, { userName: "", rating: 5, title: "", comment: "", verified: false }]);
  };

  const removeReview = (idx: number) => {
    setReviews(reviews.filter((_, i) => i !== idx));
  };

  const updateReview = (idx: number, field: keyof Review, value: any) => {
    const newReviews = [...reviews];
    newReviews[idx] = { ...newReviews[idx], [field]: value };
    setReviews(newReviews);
  };



// Fixed handleSubmit function for the EditProductPage

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Basic validation
    if (!name.trim() || !category || !materialType || !purity) {
      toast.error("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    // Create form data
    const formData = new FormData();
    
    // Add basic fields
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append("categoryId", category);
    formData.append("isActive", isActive.toString());
    formData.append("isFeatured", isFeatured.toString());
    formData.append("materialType", materialType);
    formData.append("purity", purity);
    
    // Optional fields
    if (shape) formData.append("shape", shape);
    if (color) formData.append("color", color);

    // Weight as JSON
    if (weight.value) {
      formData.append("weight", JSON.stringify(weight));
    }

    // Dimensions as JSON
    if (dimensions.length || dimensions.width || dimensions.height) {
      formData.append("dimensions", JSON.stringify(dimensions));
    }

    // Materials as JSON
    if (materials.length > 0) {
      formData.append("materials", JSON.stringify(materials.filter(m => m.trim())));
    }

    // Gems as JSON
    if (gems.length > 0) {
      formData.append("gems", JSON.stringify(gems.filter(g => g.type.trim())));
    }

    // Existing images as JSON
    formData.append("existingImages", JSON.stringify(existingImages));

    // Prepare variants data
    const variantsToSend = variants.map(variant => {
      // Create a new object with only the data we want to send
      return {
        _id: variant._id,
        metalColor: variant.metalColor,
        price: variant.price,
        stock: variant.stock,
        existingImages: variant.existingImages || [],
        images: variant.existingImages || [] ,
        size: variant.sizes // The backend expects 'size' not 'sizes'
      };
    });
    
    // Add variants as JSON
    formData.append("variants", JSON.stringify(variantsToSend));

    // Add new product images
    images.forEach(image => {
      formData.append("images", image);
    });

    // Add variant images
    variants.forEach((variant, variantIndex) => {
      if (variant.images && variant.images.length > 0) {
        variant.images.forEach(image => {
          formData.append(`variant_${variantIndex}_images`, image);
        });
      }
    });

    // Add reviews as JSON
    formData.append("reviews", JSON.stringify(reviews));

    // Add delivery options as JSON
    formData.append("deliveryOptions", JSON.stringify(deliveryOptions));

    // Add tags as JSON
    formData.append("tags", JSON.stringify(tags.filter(t => t.trim())));

    // Debug output - what's in the FormData
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key} → ${value instanceof File ? `File: ${value.name}` : value}`);
    }

    // IMPORTANT: Send the correct HTTP method and use the actual FormData object
    const response = await axios({
      method: 'post', // Your backend uses POST for the edit endpoint
      url: `${API_URL}/products/${productId}`,
      data: formData, // Send the actual FormData object, not formDataEntries
      headers: {
        // Let axios set this automatically for multipart/form-data
        // Don't manually set Content-Type for FormData
      }
    });

    console.log("API Response:", response.data);

    if (response.status === 200) {
      toast.success("Product updated successfully");
      router.push("/admin/dashboard/products");
    } else {
      toast.error("Failed to update product");
    }
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    toast.error(error.message || "Failed to update product");
  } finally {
    setIsLoading(false);
  }
};
  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading product data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form
        onSubmit={(e)=> handleSubmit(e)}
        className="mx-auto bg-white shadow-md rounded-lg p-8"
      >
        {/* Basic Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                Product Name*
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-gray-700 font-bold mb-2">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                value={sku}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                placeholder="SKU"
                readOnly
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Description*
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>

          {/* Category */}
          <div className="mt-6">
            <label
              htmlFor="category"
              className="block text-gray-700 font-bold mb-2"
            >
              Category*
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status and Featured Toggles */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-gray-700">
                Active Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="text-gray-700">
                Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Product Images</h2>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Current Images
              </label>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <Image
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New Image Upload */}
          {/* <div>
            <label className="block text-gray-700 font-bold mb-2">
              Add New Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <Image
                      src={preview}
                      alt={`New image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}

                {(existingImages.length + images.length < 5) && (
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/jpeg,image/png,image/gif"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer flex flex-col items-center justify-center h-full w-full"
                    >
                      <FaCloudUploadAlt className="text-2xl text-gray-400 mb-1" />
                      <span className="text-sm text-gray-500">Upload Image</span>
                    </label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Upload up to 5 images. JPEG, PNG or GIF only. Max 5MB each.
              </p>
            </div>
          </div> */}
        </div>

        {/* Material Properties Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Material Properties</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Material Type */}
            <div>
              <label
                htmlFor="materialType"
                className="block text-gray-700 font-bold mb-2"
              >
                Material Type*
              </label>
              <select
                id="materialType"
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Material Type</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="platinum">Platinum</option>
                <option value="titanium">Titanium</option>
              </select>
            </div>

            {/* Purity */}
            <div>
              <label
                htmlFor="purity"
                className="block text-gray-700 font-bold mb-2"
              >
                Purity*
              </label>
              <input
                type="text"
                id="purity"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                placeholder="e.g., 22K, 18K"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Shape */}
            <div>
              <label
                htmlFor="shape"
                className="block text-gray-700 font-bold mb-2"
              >
                Shape
              </label>
              <input
                type="text"
                id="shape"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                placeholder="e.g., Round, Oval"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Materials */}
          <div className="mt-6">
            <label className="block text-gray-700 font-bold mb-2">
              Materials
            </label>
            {materials.map((material, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={material}
                  onChange={(e) => updateMaterial(index, e.target.value)}
                  className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter material (e.g., Gold, Silver, Diamond)"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMaterial}
              className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
            >
              <FaPlus className="mr-2" /> Add Material
            </button>
          </div>
        </div>

        {/* Physical Properties Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Physical Properties</h2>

          {/* Weight */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-2">
              <label
                htmlFor="weight"
                className="block text-gray-700 font-bold mb-2"
              >
                Weight
              </label>
              <input
                type="number"
                id="weight"
                value={weight.value}
                onChange={(e) => setWeight({ ...weight, value: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Weight value"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label
                htmlFor="weightUnit"
                className="block text-gray-700 font-bold mb-2"
              >
                Unit
              </label>
              <select
                id="weightUnit"
                value={weight.unit}
                onChange={(e) => setWeight({ ...weight, unit: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="grams">Grams</option>
                <option value="carat">Carat</option>
                <option value="tola">Tola</option>
                <option value="oz">Oz</option>
              </select>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Dimensions (mm)
            </label>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <input
                  type="number"
                  value={dimensions.length}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, length: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Length"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, width: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Width"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, height: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Height"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gems Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Gems</h2>
          {gems.map((gem, index) => (
            <div key={index} className="p-4 border rounded-lg mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-medium flex items-center">
                  <FaGem className="mr-2 text-purple-500" /> Gem {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeGem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Type
                  </label>
                  <input
                    type="text"
                    value={gem.type}
                    onChange={(e) => updateGem(index, "type", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Diamond, Ruby, etc."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Carat
                  </label>
                  <input
                    type="number"
                    value={gem.carat}
                    onChange={(e) => updateGem(index, "carat", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Carat weight"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={gem.color}
                    onChange={(e) => updateGem(index, "color", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Gem color"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Clarity
                  </label>
                  <input
                    type="text"
                    value={gem.clarity}
                    onChange={(e) =>
                      updateGem(index, "clarity", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VS1, SI2, etc."
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addGem}
            className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="mr-2" /> Add Gem
          </button>
        </div>

        {/* Variants Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Product Variants</h2>

          {variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="p-4 border rounded-lg mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-medium">Variant {variantIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeVariant(variantIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Metal Color */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Metal Color*
                  </label>
                  <select
                    value={variant.metalColor}
                    onChange={(e) => updateVariant(variantIndex, "metalColor", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="yellowgold">Yellow Gold</option>
                    <option value="rosegold">Rose Gold</option>
                    <option value="whitegold">White Gold</option>
                    <option value="sterlingsilver">Sterling Silver</option>
                    <option value="platinum">Platinum</option>
                    <option value="bronze">Bronze</option>
                    <option value="copper">Copper</option>
                    <option value="blackgold">Black Gold</option>
                    <option value="titanium">Titanium</option>
                  </select>
                </div>

         
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pricing*
                </label>
                {Object.entries(variant.price).map(([priceKey, priceValue]) => (
                  <div key={priceKey} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={priceKey === "default" ? "Default Price" : priceKey}
                      className="w-1/3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                      readOnly={priceKey === "default"}
                      onChange={(e) => {
                        if (priceKey !== "default") {
                          const newVariants = [...variants];
                          const oldPrice = { ...newVariants[variantIndex].price };
                          delete oldPrice[priceKey];
                          oldPrice[e.target.value] = priceValue;
                          newVariants[variantIndex].price = oldPrice;
                          setVariants(newVariants);
                        }
                      }}
                    />
                    <input
                      type="number"
                      value={priceValue}
                      onChange={(e) => updateVariantPrice(variantIndex, priceKey, Number(e.target.value))}
                      className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      required={priceKey === "default"}
                    />
                    {priceKey !== "default" && (
                      <button
                        type="button"
                        onClick={() => removeVariantPriceOption(variantIndex, priceKey)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addVariantPriceOption(variantIndex)}
                  className="mt-2 flex items-center text-blue-500 hover:text-blue-700 text-sm"
                >
                  <FaPlus className="mr-1" /> Add Price Option
                </button>
              </div>

              {/* Size Options */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Size Options
                </label>
                
                {variant.sizes && variant.sizes.map((sizeOption, sizeIndex) => (
                  <div key={sizeIndex} className="flex items-center space-x-2 mb-2 p-2 bg-gray-100 rounded">
                    <select
                      value={sizeOption.type}
                      onChange={(e) => updateVariantSize(variantIndex, sizeIndex, "type", e.target.value)}
                      className="w-1/3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="standard">Standard</option>
                      <option value="custom">Custom</option>
                    </select>
                    
                    <input
                      type="text"
                      value={sizeOption.size}
                      onChange={(e) => updateVariantSize(variantIndex, sizeIndex, "size", e.target.value)}
                      className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Size value (e.g., S, M, L, XL, 12cm, etc.)"
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeSizeFromVariant(variantIndex, sizeIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addSizeToVariant(variantIndex)}
                  className="mt-2 flex items-center text-blue-500 hover:text-blue-700 text-sm"
                >
                  <FaPlus className="mr-1" /> Add Size Option
                </button>
              </div>

              {/* Variant Images */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {variant.metalColor.charAt(0).toUpperCase() + variant.metalColor.slice(1)} Images
                </label>

                {/* Existing Variant Images */}
                {variant.existingImages && variant.existingImages.length > 0 && (
                  <div className="mb-2">
                    <div className="text-sm text-gray-600 mb-1">Current Images:</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {variant.existingImages.map((imageUrl, imgIndex) => (
                        <div key={`existing-${imgIndex}`} className="relative">
                          <Image
                            src={imageUrl}
                            alt={`${variant.metalColor} variant image ${imgIndex + 1}`}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover h-20 w-20"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantExistingImage(variantIndex, imgIndex)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 text-xs"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Variant Images */}
                {/* <div className={`border-2 border-dashed rounded-lg p-4 ${
                  variant.metalColor === 'gold' ? 'bg-yellow-50 border-yellow-300' :
                  variant.metalColor === 'silver' ? 'bg-gray-50 border-gray-300' :
                  variant.metalColor === 'rosegold' ? 'bg-gray-50 border-pink-300' :
                  'bg-gray-100 border-gray-300'
                }`}>
                  <div className="grid grid-cols-3 gap-3">
                    {variant.imagePreviews?.map((preview, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <Image
                          src={preview}
                          alt={`${variant.metalColor} new variant image ${imgIndex + 1}`}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover h-24 w-24"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariantImage(variantIndex, imgIndex)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 text-xs"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}

                    {((variant.existingImages?.length || 0) + (variant.images?.length || 0) < 3) && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-24 w-24">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          multiple
                          onChange={(e) => handleVariantImageUpload(e, variantIndex)}
                          className="hidden"
                          id={`variantImageUpload-${variantIndex}`}
                        />
                        <label
                          htmlFor={`variantImageUpload-${variantIndex}`}
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FaCloudUploadAlt className="text-2xl text-gray-400 mb-1" />
                          <span className="text-gray-600 text-xs capitalize">{variant.metalColor}</span>
                        </label>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Upload images showing this product in <span className="font-medium capitalize">{variant.metalColor}</span> color
                  </p>
                </div> */}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="mr-2" /> Add Variant
          </button>
        </div>

        {/* Delivery Options Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Delivery Options</h2>
          
          {deliveryOptions.map((opt, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row md:items-center gap-4 border p-4 rounded-lg mb-4"
            >
              {/* Type */}
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standard, Express"
                  value={opt.type}
                  onChange={(e) => handleChange(idx, 'type', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Duration */}
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5-7 business days"
                  value={opt.duration}
                  onChange={(e) => handleChange(idx, 'duration', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price */}
              <div className="w-28">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="Price"
                  value={opt.price}
                  onChange={(e) => handleChange(idx, 'price', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              {/* Remove Button */}
              <div className="flex items-end justify-center pb-2">
                <button
                  type="button"
                  onClick={() => removeDeliveryOption(idx)}
                  className="text-red-500 hover:text-red-700"
                  disabled={deliveryOptions.length <= 1}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addDeliveryOption}
            className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="mr-2" /> Add Delivery Option
          </button>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Tags</h2>
          
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addTag}
            className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="mr-2" /> Add Tag
          </button>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Reviews</h2>
          
          {reviews.map((rev, i) => (
            <div key={i} className="p-4 border rounded-lg mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Review {i + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeReview(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">Name</label>
                  <input
                    type="text"
                    value={rev.userName}
                    onChange={(e) => updateReview(i, "userName", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="User name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">Rating</label>
                  <select
                    value={rev.rating}
                    onChange={(e) => updateReview(i, "rating", Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">Title</label>
                  <input
                    type="text"
                    value={rev.title}
                    onChange={(e) => updateReview(i, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Review title"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">Comment</label>
                  <textarea
                    value={rev.comment}
                    onChange={(e) => updateReview(i, "comment", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Review text"
                  />
                </div>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rev.verified}
                    onChange={(e) => updateReview(i, "verified", e.target.checked)}
                    id={`verified-${i}`}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`verified-${i}`} className="text-gray-700">
                    Verified purchase
                  </label>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addReview}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="mr-2" /> Add Review
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="md:w-1/3 py-3 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 rounded-lg text-white font-bold ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Updating Product...
              </span>
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}