import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { Category, CompanyActivity, Offer } from '../../types';

export interface OfferFilters {
  category_id?: string;
  search?: string;
  is_featured?: number;
}

// --- API REAL (Tu código original) ---
const API_URL = 'http://10.20.20.5/ofertitas_api2/public'; 
const API_KEY = 'ofertita-x-2-5-2-6-3';

const realBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    headers.set('X-API-KEY', API_KEY);
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  
  // 3. Usa el interruptor aquí
  baseQuery: realBaseQuery,

  tagTypes: ['Offer'],
  
  // (Los endpoints no cambian en absoluto)
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => 'categories',
    }),
    getFeaturedOffers: builder.query<Offer[], void>({
      query: () => 'offers?featured=true',
    }),
    getAllOffers: builder.query<Offer[], void>({
      query: () => 'offers',
    }),
    getOffers: builder.query<Offer[], OfferFilters | void>({
      query: (params) => {
        // Construimos la query string dinámicamente
        const queryParams = new URLSearchParams();
        
        if (params?.category_id && params.category_id !== '0') {
            queryParams.append('category_id', params.category_id);
        }
        if (params?.search) {
            queryParams.append('search', params.search);
        }
        if (params?.is_featured) {
            queryParams.append('is_featured', String(params.is_featured));
        }

        return `/offers?${queryParams.toString()}`;
      },
      providesTags: ['Offer'],
      keepUnusedDataFor: 60, // Cache de 1 minuto
    }),
    getOfferById: builder.query<Offer, string>({
      query: (id) => `offers/${id}`,
    }),
    getRecentActivity: builder.query<CompanyActivity[], void>({
      query: () => '/companies/recent/activity',
      // Esto hace que se refresque si montas/desmontas el componente o cada 60s
      keepUnusedDataFor: 60, 
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetFeaturedOffersQuery,
  useGetAllOffersQuery,
  useGetOfferByIdQuery,
  useGetRecentActivityQuery,
  useGetOffersQuery
} = apiSlice;