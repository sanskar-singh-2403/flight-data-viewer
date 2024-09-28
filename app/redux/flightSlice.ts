import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlightData } from '../types/FlightData';

interface SearchCriteria {
  field: keyof FlightData;
  value: string;
}

interface FlightState {
  flights: FlightData[];
  filteredFlights: FlightData[];
  isAdvancedSearch: boolean;
}

const initialState: FlightState = {
  flights: [],
  filteredFlights: [],
  isAdvancedSearch: false,
};

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setFlights: (state, action: PayloadAction<FlightData[]>) => {
      state.flights = action.payload;
      state.filteredFlights = action.payload;
    },
    setIsAdvancedSearch: (state, action: PayloadAction<boolean>) => {
      state.isAdvancedSearch = action.payload;
    },
    performSearch: (state, action: PayloadAction<{
      criteria: SearchCriteria[],
      isAdvanced: boolean,
      simpleTerm: string
    }>) => {
      const { criteria, isAdvanced, simpleTerm } = action.payload;
      
      // sarching based on full text or individual fields
      if (isAdvanced) {
        state.filteredFlights = state.flights.filter(flight =>
          criteria.every(({ field, value }) =>
            String(flight[field]).toLowerCase().includes(value.toLowerCase())
          )
        );
      } else {
        state.filteredFlights = state.flights.filter(flight =>
          Object.values(flight).some(value =>
            String(value).toLowerCase().includes(simpleTerm.toLowerCase())
          )
        );
      }
    },
  },
});

export const { setFlights, setIsAdvancedSearch, performSearch } = flightSlice.actions;
export default flightSlice.reducer;