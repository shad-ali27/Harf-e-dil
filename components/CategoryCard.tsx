
import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  count: number;
  onClick: (cat: Category) => void;
  isActive: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, count, onClick, isActive }) => {
  return (
    <button 
      onClick={() => onClick(category)}
      className={`group px-6 py-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center space-y-1 hover:shadow-lg active:scale-95 ${
        isActive 
          ? 'bg-burgundy border-burgundy text-cream shadow-md scale-105' 
          : 'bg-white/50 border-burgundy/10 text-burgundy hover:border-gold'
      }`}
    >
      <h3 className="font-serif text-lg font-bold tracking-wide">{category}</h3>
      <p className={`text-[9px] uppercase tracking-[0.2em] font-medium opacity-60`}>{count} Pieces</p>
    </button>
  );
};

export default CategoryCard;
