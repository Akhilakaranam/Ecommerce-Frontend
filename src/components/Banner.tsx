import React from 'react';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

export function Banner() {
  const features = [
    { icon: Truck, text: 'Free Delivery', subtext: 'On orders above ₹500' },
    { icon: Shield, text: 'Secure Payment', subtext: '100% secure checkout' },
    { icon: RotateCcw, text: 'Easy Returns', subtext: '30-day return policy' },
    { icon: Headphones, text: '24/7 Support', subtext: 'Dedicated support team' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome to FlipMart
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop from millions of products across categories.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <feature.icon size={24} />
              </div>
              <h3 className="font-semibold mb-1">{feature.text}</h3>
              <p className="text-sm text-blue-200">{feature.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}