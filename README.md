# Ecom-turborepo




GET /api/products - List all products with filtering
GET /api/products/search - Search products
GET /api/products/featured - Get featured products
GET /api/products/materials - Get materials for filtering
GET /api/products/:id - Get a specific product
GET /api/products/sku/:sku - Get product by SKU
GET /api/products/:id/related - Get related products


POST /api/products - Create a new product
PUT /api/products/:id - Update a product
DELETE /api/products/:id - Delete a product
PATCH /api/products/:id/stock - Update stock only
POST /api/products/bulk-status - Bulk update product status
POST /api/products/bulk-delete - Bulk delete products





contact form 
   <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                
                <p className="text-gray-600 mb-6">
                  {CONTACT_INFO.description}
                </p>
                
                {submitSuccess !== null && (
                  <div className={`p-4 mb-6 rounded-md ${submitSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {submitMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name.value}
                        onChange={(e) => setName({ value: e.target.value, error: '' })}
                        className={`mt-1 block w-full px-3 py-2 border ${name.error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder={CONTACT_INFO.formPlaceholders.name}
                      />
                      {name.error && (
                        <p className="mt-1 text-sm text-red-600">{name.error}</p>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email.value}
                        onChange={(e) => setEmail({ value: e.target.value, error: '' })}
                        className={`mt-1 block w-full px-3 py-2 border ${email.error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder={CONTACT_INFO.formPlaceholders.email}
                      />
                      {email.error && (
                        <p className="mt-1 text-sm text-red-600">{email.error}</p>
                      )}
                    </div>
                    
                    {/* Phone (Optional) */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone.value}
                        onChange={(e) => setPhone({ value: e.target.value, error: '' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={CONTACT_INFO.formPlaceholders.phone}
                      />
                    </div>
                    
                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={subject.value}
                        onChange={(e) => setSubject({ value: e.target.value, error: '' })}
                        className={`mt-1 block w-full px-3 py-2 border ${subject.error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder={CONTACT_INFO.formPlaceholders.subject}
                      />
                      {subject.error && (
                        <p className="mt-1 text-sm text-red-600">{subject.error}</p>
                      )}
                    </div>
                    
                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={message.value}
                        onChange={(e) => setMessage({ value: e.target.value, error: '' })}
                        className={`mt-1 block w-full px-3 py-2 border ${message.error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder={CONTACT_INFO.formPlaceholders.message}
                      />
                      {message.error && (
                        <p className="mt-1 text-sm text-red-600">{message.error}</p>
                      )}
                    </div>
                    
                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          CONTACT_INFO.formPlaceholders.submitButton
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            