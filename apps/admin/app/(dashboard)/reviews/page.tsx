"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Marketplace } from '@toko-manur/db';
import { Star, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';

interface Review {
  id: string;
  marketplace: string;
  reviewId: string;
  productName: string;
  username: string;
  rating: number;
  comment: string | null;
  featured: boolean;
  reviewDate: string;
}

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  
  // Modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['reviews', marketplaceFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (marketplaceFilter !== 'ALL') params.append('marketplace', marketplaceFilter);
      if (search) params.append('search', search);
      
      const res = await fetch(`/api/reviews?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    }
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string, featured: boolean }) => {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured }),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review updated successfully');
    },
    onError: () => {
      toast.error('Failed to update review');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review deleted successfully');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Failed to delete review');
      setDeleteId(null);
    }
  });

  const getMarketplaceBadgeColor = (marketplace: string) => {
    switch (marketplace) {
      case 'SHOPEE': return 'bg-orange-100 text-orange-800';
      case 'TOKOPEDIA': return 'bg-green-100 text-green-800';
      case 'LAZADA': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Management</h1>
          <p className="text-muted-foreground">Manage and aggregate product reviews from marketplaces.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* TABS FOR MARKETPLACE FILTER */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMarketplaceFilter('ALL')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                marketplaceFilter === 'ALL' 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Semua
            </button>
            {Object.keys(Marketplace).map((mp) => (
              <button
                key={mp}
                onClick={() => setMarketplaceFilter(mp)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  marketplaceFilter === mp 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {mp === 'SHOPEE' ? 'Shopee' : mp === 'TOKOPEDIA' ? 'Tokopedia' : mp === 'LAZADA' ? 'Lazada' : mp}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full lg:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Marketplace</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">User & Rating</th>
                <th className="px-6 py-3">Comment</th>
                <th className="px-6 py-3 text-center">Featured</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getMarketplaceBadgeColor(review.marketplace)}`}>
                        {review.marketplace}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={review.productName}>
                      {review.productName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{review.username}</div>
                      <div className="flex items-center mt-1 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[300px]">
                      <p className="line-clamp-2" title={review.comment || ''}>
                        {review.comment || <span className="text-gray-400 italic">No comment</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleFeaturedMutation.mutate({ id: review.id, featured: !review.featured })}
                        className="focus:outline-none"
                      >
                        {review.featured ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setDeleteId(review.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        message="Apakah kamu yakin ingin menghapus ulasan ini dari database?"
      />
    </div>
  );
}
