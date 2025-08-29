import React from 'react';
import { Filter, Star } from 'lucide-react';
import { categories } from '../data/products';

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
}

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onRatingChange
}: FilterSidebarProps) {
  const priceRanges = [
    { label: 'Under ₹1,000', min: 0, max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
    { label: 'Above ₹25,000', min: 25000, max: Infinity }
  ];

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-6 h-fit">
      <div className="flex items-center space-x-2 mb-6">
        <Filter size={20} className="text-blue-600" />
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => onCategoryChange('')}
              className="mr-2 text-blue-600"
            />
            <span className="text-sm">All Products</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => onCategoryChange(category.id)}
                className="mr-2 text-blue-600"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                checked={priceRange[0] === range.min && priceRange[1] === range.max}
                onChange={() => onPriceRangeChange([range.min, range.max])}
                className="mr-2 text-blue-600"
              />
              <span className="text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => onRatingChange(rating)}
                className="mr-2 text-blue-600"
              />
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{rating}★ & above</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          onCategoryChange('');
          onPriceRangeChange([0, Infinity]);
          onRatingChange(0);
        }}
        className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-2 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}