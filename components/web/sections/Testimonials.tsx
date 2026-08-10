"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { Marketplace } from '@/lib/db';

interface Review {
  id: string;
  marketplace: string;
  productName: string;
  username: string;
  rating: number;
  comment: string | null;
  featured: boolean;
  reviewDate: string;
  images: string[] | null;
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  const getMarketplaceBadgeColor = (marketplace: string) => {
    switch (marketplace) {
      case 'SHOPEE': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'TOKOPEDIA': return 'bg-green-100 text-green-800 border border-green-200';
      case 'LAZADA': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const url = filter === 'ALL' 
          ? '/api/reviews?featured=true' 
          : `/api/reviews?featured=true&marketplace=${filter}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Failed to load reviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [filter]);

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Testimoni jujur dari pelanggan kami di berbagai marketplace. 
            Kami selalu berusaha memberikan pelayanan dan produk terbaik.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === 'ALL' 
                ? 'bg-black text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Semua
          </button>
          {Object.keys(Marketplace).map((mp) => (
            <button
              key={mp}
              onClick={() => setFilter(mp)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === mp 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {mp === 'SHOPEE' ? 'Shopee' : mp === 'TOKOPEDIA' ? 'Tokopedia' : mp === 'LAZADA' ? 'Lazada' : mp}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.username}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{review.productName}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMarketplaceBadgeColor(review.marketplace)}`}>
                      {review.marketplace === 'SHOPEE' ? 'Shopee' : review.marketplace === 'TOKOPEDIA' ? 'Tokopedia' : review.marketplace === 'LAZADA' ? 'Lazada' : review.marketplace}
                    </span>
                  </div>
                  
                  <div className="flex text-yellow-400 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                  
                  <div className="flex-1">
                    {review.comment ? (
                      <p className="text-gray-700 text-sm leading-relaxed italic line-clamp-4">
                        "{review.comment}"
                      </p>
                    ) : (
                      <div className="flex items-center text-gray-400 italic text-sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Tanpa teks review
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400 text-right">
                    {new Date(review.reviewDate).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {!loading && reviews.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada review featured untuk filter ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}
