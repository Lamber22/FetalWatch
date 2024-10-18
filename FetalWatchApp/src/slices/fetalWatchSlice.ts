// slices/fetalWatchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FetalMeasurements {
    crownRumpLength: number;
    biparietalDiameter: number;
    femurLength: number;
    headCircumference: number;
    abdominalCircumference: number;
}

interface FetalData {
    fetalHeartbeat: number;
    measurements: FetalMeasurements;
    growthAndDevelopment: string;
    position: string;
}

interface FetalWatchState {
    isConnected: boolean;
    isLoading: boolean;
    isScanning: boolean;
    fetalData: FetalData | null;
    showVideo: boolean;
    showImage: boolean;
    scanCompleted: boolean;
}

const initialState: FetalWatchState = {
    isConnected: false,
    isLoading: false,
    isScanning: false,
    fetalData: null,
    showVideo: false,
    showImage: false,
    scanCompleted: false,
};

const fetalWatchSlice = createSlice({
    name: 'fetalWatch',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        connectDevice: (state) => {
            state.isConnected = true;
            state.isLoading = false;
        },
        disconnectDevice: (state) => {
            state.isConnected = false;
        },
        startScan: (state) => {
            state.isScanning = true;
            state.isLoading = true;
            state.showVideo = true;
        },
        completeScan: (state, action: PayloadAction<FetalData>) => {
            state.fetalData = action.payload;
            state.isScanning = false;
            state.isLoading = false;
            state.showVideo = false;
            state.showImage = true;
            state.scanCompleted = true;
        },
        resetScan: (state) => {
            state.isScanning = false;
            state.fetalData = null;
            state.showVideo = false;
            state.showImage = false;
            state.scanCompleted = false;
        },
    },
});

export const {
    setLoading,
    connectDevice,
    disconnectDevice,
    startScan,
    completeScan,
    resetScan
} = fetalWatchSlice.actions;

export default fetalWatchSlice.reducer;
