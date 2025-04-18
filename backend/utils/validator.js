
// Validate category input
exports.validateCategoryInput = (data) => {
    const errors = {};
    
    if (!data.name) errors.name = 'Category name is required';
    else if (data.name.length < 2) errors.name = 'Category name must be at least 2 characters';
    
    if (!data.slug) errors.slug = 'Category slug is required';
    else if (!/^[a-z0-9-]+$/.test(data.slug)) errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };
  
  // Validate product input
  exports.validateProductInput = (data) => {
    const errors = {};
    
    if (!data.name) errors.name = 'Product name is required';
    if (!data.sku) errors.sku = 'Product SKU is required';
    if (!data.description) errors.description = 'Product description is required';


    
    if (!data.categoryId) errors.categoryId = 'Category is required';
    // if (!data.stockQuantity && data.stockQuantity !== 0) errors.stockQuantity = 'Stock quantity is required';
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };
  
  // Validate user registration input
  exports.validateRegistrationInput = (data) => {
    const errors = {};
    
    if (!data.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Email is invalid';
    
    if (!data.password) errors.password = 'Password is required';
    else if (data.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (!data.firstName) errors.firstName = 'First name is required';
    if (!data.lastName) errors.lastName = 'Last name is required';
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };
  
  // Validate login input
  exports.validateLoginInput = (data) => {
    const errors = {};
    
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };
  
  // Validate address input
  exports.validateAddressInput = (data) => {
    const errors = {};
    
    if (!data.type) errors.type = 'Address type is required';
    else if (!['billing', 'shipping'].includes(data.type)) errors.type = 'Address type must be either billing or shipping';
    
    if (!data.addressLine1) errors.addressLine1 = 'Address line 1 is required';
    if (!data.city) errors.city = 'City is required';
    if (!data.state) errors.state = 'State is required';
    if (!data.postalCode) errors.postalCode = 'Postal code is required';
    if (!data.country) errors.country = 'Country is required';
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };
  
  // Validate order input
  exports.validateOrderInput = (data) => {
    const errors = {};
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      errors.items = 'Order must contain at least one item';
    } else {
      data.items.forEach((item, index) => {
        if (!item.productId) errors[`items[${index}].productId`] = 'Product ID is required';
        if (!item.quantity) errors[`items[${index}].quantity`] = 'Quantity is required';
        else if (isNaN(item.quantity) || item.quantity <= 0) errors[`items[${index}].quantity`] = 'Quantity must be a positive number';
      });
    }
    
    if (!data.shippingAddress) errors.shippingAddress = 'Shipping address is required';

    if (!data.paymentMethod) errors.paymentMethod = 'Payment method is required';
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };