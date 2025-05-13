import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../services/AuthService';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, { rejectWithValue }) => {
    const token = sessionStorage.getItem('authToken');

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/getAppointmentsListPage`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response?.status === 200) {
        return response?.data?.data || [];
      } else {
        return rejectWithValue(response?.data?.error || "Failed to fetch data")
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Something went wrong. Please try again later")
    }
  }
)

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default appointmentSlice.reducers;