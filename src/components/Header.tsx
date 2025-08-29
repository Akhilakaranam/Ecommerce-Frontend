import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  onCategorySelect: (category: string) => void;
}

export function Header({ onSearchChange, onCartClick, onCategorySelect }: HeaderProps) {
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const categories = [
    'All Products',
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty'
  ];

  return (
    <header className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              FlipMart
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:flex items-center space-x-1 text-white hover:text-gray-200 transition-colors">
              <User size={20} />
              <span className="text-sm">Login</span>
            </button>
            
            <button className="hidden sm:flex items-center space-x-1 text-white hover:text-gray-200 transition-colors">
              <Heart size={20} />
              <span className="text-sm">Wishlist</span>
            </button>

            <button
              onClick={onCartClick}
              className="relative flex items-center space-x-1 text-white hover:text-gray-200 transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline text-sm">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories - Desktop */}
        <div className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-blue-500">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category === 'All Products' ? '' : category.toLowerCase())}
              className="text-white hover:text-orange-300 transition-colors text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-blue-700 border-t border-blue-500">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Categories */}
            <div className="space-y-2">
              <h3 className="text-white font-medium text-sm">Categories</h3>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategorySelect(category === 'All Products' ? '' : category.toLowerCase());
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-white hover:text-orange-300 transition-colors text-sm py-1"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="border-t border-blue-600 pt-3 space-y-2">
              <button className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors">
                <User size={18} />
                <span className="text-sm">Login</span>
              </button>
              <button className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors">
                <Heart size={18} />
                <span className="text-sm">Wishlist</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}