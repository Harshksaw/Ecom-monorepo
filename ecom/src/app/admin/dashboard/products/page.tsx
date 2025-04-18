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
  FaTruck,
  FaTag
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/app/lib/api";

// Interfaces for type safety
interface Category {
  _id: string;
  name: string;
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


interface Variant {
  metalColor: string;
  price: Record<string, number>;
  stock: number;
  images?: File[];
  imagePreviews?: string[];
}

interface DeliveryOption {
  type: string;
  duration: string;
  price: string;
}

export default function CreateProductPage() {
  // Basic product info
  const [name, setName] = useState("");
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
  const [variants, setVariants] = useState<any[]>([{
    metalColor: "gold",
    price: { "default": 0 },
    stock: 0,
    images: [],
    imagePreviews: []
  }]);
  
  // Delivery options
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([{
    type: "standard",
    duration: "5-7 business days",
    price: "0"
  }]);
  
  // Tags
  const [tags, setTags] = useState<string[]>([""]);
  
  // Main product images
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const router = useRouter();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        const data = await response.data;
        setCategories(data.categories);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  // Generate SKU on name change
  useEffect(() => {
    if (name) {
      // Create SKU from name: first 3 letters + timestamp
      const prefix = name
        .replace(/[^a-zA-Z]/g, "")
        .substring(0, 3)
        .toUpperCase();
      const timestamp = new Date().getTime().toString().slice(-6);
      setSku(`${prefix}${timestamp}`);
    }
  }, [name]);

  // Main image upload handler
  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files) {
  //     const newFiles = Array.from(files);
  //     const validFiles = validateFiles(newFiles);

  //     if (images.length + validFiles.length > 5) {
  //       toast.error("Maximum 5 images allowed");
  //       return;
  //     }

  //     const newImageFiles = [...images, ...validFiles];
  //     const newImagePreviews = [...imagePreviews];
      
  //     validFiles.forEach(file => {
  //       newImagePreviews.push(URL.createObjectURL(file));
  //     });

  //     setImages(newImageFiles);
  //     setImagePreviews(newImagePreviews);
  //   }
  // };

  // Variant image upload handler
  const handleVariantImageUpload = (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = validateFiles(newFiles);
      
      const currentVariant = variants[variantIndex];
      const currentImages = currentVariant.images || [];
      const currentPreviews = currentVariant.imagePreviews || [];
      
      if (currentImages.length + validFiles.length > 3) {
        toast.error("Maximum 3 images per variant allowed");
        return;
      }
      
      const newVariantImages = [...currentImages, ...validFiles];
      const newVariantPreviews = [...currentPreviews];
      
      validFiles.forEach(file => {
        newVariantPreviews.push(URL.createObjectURL(file));
      });
      
      updateVariant(variantIndex, 'images', newVariantImages);
      updateVariant(variantIndex, 'imagePreviews', newVariantPreviews);
    }
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
      price: {"default": ""},
      stock:0,
      images: [],
      imagePreviews: []
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
    updateVariantPrice(variantIndex, newPriceKey, "");
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required inputs
    if (!name.trim()) {
      toast.error("Product name is required");
      setIsLoading(false);
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      setIsLoading(false);
      return;
    }
    
    if (!materialType) {
      toast.error("Material type is required");
      setIsLoading(false);
      return;
    }
    
    if (!purity) {
      toast.error("Purity is required");
      setIsLoading(false);
      return;
    }
    const defaultPrice = variants[0]?.price?.default || "";

    // Create form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append("categoryId", category);
    formData.append("isActive", isActive.toString());
    formData.append("isFeatured", isFeatured.toString());
    formData.append("price", defaultPrice);
    // Add material properties
    formData.append("materialType", materialType);
    formData.append("purity", purity);
    if (shape) formData.append("shape", shape);
    if (color) formData.append("color", color);
    
    // Add weight
    if (weight.value) {
      formData.append("weight[value]", weight.value);
      formData.append("weight[unit]", weight.unit);
    }

    // Add dimensions
    if (dimensions.length || dimensions.width || dimensions.height) {
      if (dimensions.length) formData.append("dimensions[length]", dimensions.length);
      if (dimensions.width) formData.append("dimensions[width]", dimensions.width);
      if (dimensions.height) formData.append("dimensions[height]", dimensions.height);
    }

    // Add materials
    materials.forEach((material, index) => {
      if (material.trim()) {
        formData.append(`materials[${index}]`, material);
      }
    });

    // Add gems
    gems.forEach((gem, index) => {
      if (gem.type.trim()) {
        formData.append(`gems[${index}][type]`, gem.type);
        formData.append(`gems[${index}][carat]`, gem.carat);
        formData.append(`gems[${index}][color]`, gem.color);
        formData.append(`gems[${index}][clarity]`, gem.clarity);
      }
    });
    
    // Add variants
    const variantsToSend = variants.map(variant => {
      const variantData = {
        metalColor: variant.metalColor,
        price: variant.price,
        stock: variant.stock
      };
      return variantData;
    });
    formData.append("variants", JSON.stringify(variantsToSend));
    
    // Add variant images separately
    variants.forEach((variant, variantIndex) => {
      variant.images?.forEach((image, imageIndex) => {
        formData.append(`variant_${variantIndex}_images`, image);
      });
    });
    
    // Add delivery options
    formData.append("deliveryOptions", JSON.stringify(deliveryOptions));

    // Add tags
    tags.forEach((tag, index) => {
      if (tag.trim()) {
        formData.append(`tags[${index}]`, tag);
      }
    });

    // Add main product images
    images.forEach((image) => {
      formData.append("images", image);
    });

    console.log("32233", formData)
    try {
      console.log("32233", formData)
      const response = await axios.post(`${API_URL}/products`, formData);

      if (response.status !== 201) {
        toast.error("Failed to create product");
        return;
      }

      toast.success("Product created successfully");
      // Reset form
      setName("");
      setSku("");
      setDescription("");
      setCategory("");
      setMaterialType("");
      setPurity("");
      setShape("");
      setColor("");
      setImages([]);
      setImagePreviews([]);
      setMaterials([""]);
      setGems([]);
      setWeight({ value: "", unit: "grams" });
      setDimensions({ length: "", width: "", height: "" });
      setVariants([{
        metalColor: "gold",
        price: {"default": ""},
        stock: "0",
        images: [],
        imagePreviews: []
      }]);
      setDeliveryOptions([{
        type: "standard",
        duration: "5-7 business days",
        price: "0"
      }]);
      setIsFeatured(false);
      setIsActive(true);
      setTags([""]);

      router.push("/admin/dashboard/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

      <form
        onSubmit={handleSubmit}
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
                SKU*
              </label>
              <input
                type="text"
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                placeholder="Auto-generated SKU"
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
              <select
                id="purity"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Purity</option>
                <option value="8K">8K</option>
                <option value="10K">10K</option>
                <option value="12K">12K</option>
                <option value="14K">14K</option>
                <option value="18K">18K</option>
                <option value="22K">22K</option>
                <option value="24K">24K</option>
              </select>
            </div>
            
            {/* Shape */}
            <div>
              <label
                htmlFor="shape"
                className="block text-gray-700 font-bold mb-2"
              >
                Shape
              </label>
              <select
                id="shape"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Shape</option>
                <option value="round">Round</option>
                <option value="oval">Oval</option>
                <option value="princess">Princess</option>
                <option value="emerald">Emerald</option>
                <option value="pear">Pear</option>
                <option value="marquise">Marquise</option>
                <option value="heart">Heart</option>
                <option value="cushion">Cushion</option>
              </select>
            </div>
            
            {/* Color */}
          
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
                onChange={(e) => setWeight({...weight, value: e.target.value})}
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
                onChange={(e) => setWeight({...weight, unit: e.target.value})}
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
              Dimensions (cm)
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
            <option value="rosegold">Rose Gold</option>
            <option value="pinkgold">Pink Gold</option>
          </select>
        </div>
        
        {/* Stock */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Stock Quantity*
          </label>
          <input
            type="number"
            value={variant.stock}
            onChange={(e) => updateVariant(variantIndex, "stock",Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Available stock"

            required
          />
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
                  const oldPrice = {...newVariants[variantIndex].price};
                  delete oldPrice[priceKey];
                  oldPrice[e.target.value] = priceValue as string;
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

      {/* Variant Images - THIS IS THE KEY PART FOR METAL COLOR ASSOCIATION */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {variant.metalColor.charAt(0).toUpperCase() + variant.metalColor.slice(1)} Images
        </label>
        <div className={`border-2 border-dashed rounded-lg p-4 ${
          variant.metalColor === 'gold' ? 'bg-yellow-50 border-yellow-300' :
          variant.metalColor === 'silver' ? 'bg-gray-50 border-gray-300' :
          variant.metalColor === 'rosegold' ? 'bg-pink-50 border-pink-300' :
          'bg-pink-100 border-pink-400'
        }`}>
          <div className="grid grid-cols-3 gap-3">
            {variant.imagePreviews?.map((preview, imgIndex) => (
              <div key={imgIndex} className="relative">
                <Image
                  src={preview}
                  alt={`${variant.metalColor} variant image ${imgIndex + 1}`}
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
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-b-lg text-center capitalize">
                  {variant.metalColor}
                </div>
              </div>
            ))}

            {(!variant.images || variant.images.length < 3) && (
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
        </div>
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

        {/* Tags */}
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">Tags</label>
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

        {/* Image Upload */}
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">
            Product Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {/* Image Previews */}
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview}
                    alt={`Product preview ${index + 1}`}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {/* {images.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-36">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                    <span className="text-gray-600">Upload</span>
                  </label>
                </div>
              )} */}

              
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Upload up to 5 images (JPEG, PNG, GIF)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-bold 
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {isLoading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
