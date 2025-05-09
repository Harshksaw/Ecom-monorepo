"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSelectedCurrency,
  selectExchangeRates,
  CURRENCY_SYMBOLS,
  CurrencyCode,
  fetchExchangeRates,
  setExchangeRates,
} from "@/app/store/slices/currencySlice";
import { addToCart } from "../store/slices/cartSlice";
import { useCurrency } from "@/hooks/useCurrency";
import { AppDispatch } from "../store/store";
import axios from "axios";
import { API_URL } from "../lib/api";

interface Gem {
  type: string;
  carat: number;
  color: string;
  clarity: string;
  _id: string;
}

interface ProductVariant {
  metalColor?: string;
  images: string[];
  price: {
    default: number;
    [key: string]: number;
  };
  stock: number;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  salePrice?: number;
  category?: string;
  images: string[];
  rating?: number;
  materials?: string[];
  gems?: Gem[];
  materialType?: string;
  purity?: string;
  variants: ProductVariant[];
  stockQuantity?: number;
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
  showFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showFavorite = false,
}) => {
  // useCurrency();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Dispatch the fetchExchangeRates action
        // const action = await dispatch(fetchExchangeRates());
        // if (fetchExchangeRates.fulfilled.match(action)) {
        //   // Save last updated timestamp
        //   localStorage.setItem(
        //     "currencyRatesLastUpdated",
        //     Date.now().toString()
        //   );
        //   console.log("action in fetchExchange", action);
        // }

        // Fetch currency rates from the API
        const response = await axios.get(`${API_URL}/currency/rates`);
        const data = response.data;
        // console.log("rates is", response);
        // console.log("rates is", response.data.rates);
        console.log(data);
        // console.log(response.data.rates.USD);
        // Extract just the rates we need
        const rates = {
          INR: 1,
          USD: response.data.data.rates.USD,
          EUR: response.data.data.rates.EUR,
          GBP: response.data.data.rates.GBP,
          AED: response.data.data.rates.AED,
        };
        // console.log("ratezs is", rates);
        // Dispatch the setExchangeRates action
        dispatch(setExchangeRates(rates));
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchRates(); // Call the async function
  }, [dispatch]);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const selectedCurrency = useSelector(selectSelectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);

  // Get first variant or create empty object if not available
  const firstVariant = product?.variants[0] || {};

  // Determine material type for styling
  const materialType =
    product.materialType ||
    (product.materials && product.materials.length > 0
      ? product.materials[0].toLowerCase()
      : "other");

  const cardBgColor = materialType.includes("gold")
    ? "bg-yellow-50"
    : materialType.includes("silver")
    ? "bg-gray-50"
    : "bg-white";

  // Safely get the first image or use a placeholder
  const primaryImage =
    (product.images && product.images[0]) ||
    (firstVariant.images && firstVariant.images[0]) ||
    "/placeholder-image.jpg";

  // Get prices (prefer variant price, fallback to product price)
  const regularPrice = firstVariant.price?.default || product.price || 0;
  const salePrice =
    product.salePrice ||
    (firstVariant.price &&
    firstVariant.price[""] !== undefined &&
    firstVariant.price[""] > 0
      ? firstVariant.price[""]
      : null);

  // Format price with selected currency
  const formatPrice = (priceInINR: number | undefined | null): string => {
    if (priceInINR === undefined || priceInINR === null) return "N/A";

    const rate = exchangeRates[selectedCurrency] || 1;
    const convertedPrice = priceInINR * rate;
    const symbol = CURRENCY_SYMBOLS[selectedCurrency as CurrencyCode] || "₹";

    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 
    group ${cardBgColor}`}
    >
      {/* Product Image */}
      <Link href={`/product/${product._id}`} className="block relative">
        {/* {discountPercentage && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded-full text-xs z-10">
            {discountPercentage}% OFF
          </div>
        )} */}

        {/* Favorite button - only show if enabled */}
        {showFavorite && (
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full z-10 hover:bg-opacity-100 transition-all"
          >
            {isFavorite ? (
              <FaHeart className="text-gray-600" />
            ) : (
              <FaRegHeart className="text-gray-600" />
            )}
          </button>
        )}

        <div className="relative w-full pt-[100%]">
          <Image
            loading="lazy"
            src={primaryImage}
            alt={product.name}
            fill
            className="absolute top-0 left-0 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Optional Material Tags */}
        {(product.materials || product.gems || product.purity) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.purity && (
              <span className="inline-block bg-yellow-100 rounded-full px-2 py-1 text-xs text-yellow-800">
                {product.purity}
              </span>
            )}
            {product.materials &&
              product.materials.slice(0, 1).map((material, idx) => (
                <span
                  key={idx}
                  className={`inline-block rounded-full px-2 py-1 text-xs ${
                    material.toLowerCase().includes("gold")
                      ? "bg-yellow-100 text-yellow-800"
                      : material.toLowerCase().includes("silver")
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {material}
                </span>
              ))}
            {product.gems &&
              product.gems.slice(0, 1).map((gem, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-purple-50 rounded-full px-2 py-1 text-xs text-purple-700"
                >
                  {gem.type} {gem.carat}ct
                </span>
              ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {salePrice ? (
              <>
                <span className="text-red-600 font-bold mr-2">
                  {formatPrice(salePrice)}
                </span>
                <span className="text-gray-400 line-through">
                  {formatPrice(regularPrice)}
                </span>
              </>
            ) : (
              <span className="text-black font-bold">
                {formatPrice(regularPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center text-yellow-500">
              ★ {product.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {/* <div className="flex justify-between items-center">
          <button 
            className="w-full bg-blue-500 flex flex-row justify-center items-center text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            title="Add to Cart"
            onClick={()=> dispatch(addToCart(product))}
          >
            <FaShoppingCart className="mr-2" /> Add
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProductCard;
