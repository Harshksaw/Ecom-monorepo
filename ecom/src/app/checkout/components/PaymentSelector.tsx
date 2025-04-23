// src/app/checkout/components/PaymentMethodSelector.tsx
import React from 'react';


interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  icon:any
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod
}) => {
  const paymentMethods = [
    {
      id: 'payoneer',
      name: 'Payoneer',
      description: 'Secure payment processing with Payoneer',
    //   icon: <Globe className="w-6 h-6 text-blue-500" />
    }  ];

  return (
    <div className="space-y-3">
      {paymentMethods.map((method:any) => (
        <div 
          key={method.id}
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === method.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onSelectMethod(method.id)}
        >
          <div className="flex items-center">
            <div className="mr-3">
              {method?.icon}
            </div>
            <div className="flex-grow">
              <div className="font-medium">{method.name}</div>
              <div className="text-sm text-gray-500">{method.description}</div>
            </div>
            <div className="ml-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id ? 'border-blue-500' : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {selectedMethod === 'payoneer' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-2">About Payoneer Payment</h3>
          <p className="text-sm text-gray-600">
            You'll be redirected to Payoneer's secure payment page to complete your purchase. 
            Once the payment is confirmed, you'll be returned to our website.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;