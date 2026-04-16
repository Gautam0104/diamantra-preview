// Product Feature
// Barrel exports for product listing, detail, and compare pages

// Pages
export { default as ProductPage } from './pages/ProductPage';
export { default as ProductDetailPage } from './pages/ProductDetailPage';
export { default as CompareProducts } from './pages/CompareProducts';

// Components
export { default as MobileFilterDrawer } from './components/MobileFilterDrawer';
export { default as RecentlyViewed } from './components/RecentlyViewed';
export { default as RelatedSuggestion } from './components/RelatedSuggestion';
export { default as ReviewCard } from './components/ReviewCard';
export { default as ProductFilters } from './components/ProductFilters';
export { default as ProductVariantFilters } from './components/ProductVariantFilters';

// Context
export { CompareProvider, useCompare } from './context/CompareContext';
