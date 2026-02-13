import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

const initialState: LocationState = {
  lat: null, // null significa que aún no sabemos o no dio permiso
  lng: null,
  error: null,
  loading: true, // Empezamos asumiendo que estamos intentando localizar
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      state.loading = false;
      state.error = null;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { setLocation, setLocationError, setLoading } = locationSlice.actions;
export default locationSlice.reducer;