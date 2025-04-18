// src/components/products/ui/VariantForm.tsx
// ... other imports
import VariantImageUploader from './VariantImageUploader';

const VariantForm: React.FC<any> = ({
  variant,
  index,
  // ... other props
  handleVariantImageUpload,
  removeVariantImage
}) => {
  return (
    <div className="p-4 border rounded-lg mb-6 bg-gray-50">
      {/* ... other variant fields ... */}
      
      {/* Variant Images - with clear metal color association */}
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Variant Images
        </label>
        <VariantImageUploader 
          variantIndex={index}
          metalColor={variant.metalColor}
          images={variant.images}
          imagePreviews={variant.imagePreviews}
          onAddImages={handleVariantImageUpload}
          onRemoveImage={removeVariantImage}
          maxImages={3}
        />
        <p className="text-xs text-gray-500 mt-2">
          Upload images showing this product in {variant.metalColor} color
        </p>
      </div>
    </div>
  );
};