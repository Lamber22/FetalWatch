// src/types/location-services.d.ts
declare module 'react-native-android-location-services-dialog-box' {
    const LocationServicesDialogBox: {
        checkLocationServicesIsEnabled(options: {
        message: string;
        ok: string;
        cancel: string;
        }): Promise<{ enabled: boolean }>;
        forceCloseDialog(): void;
    };
    export default LocationServicesDialogBox;
}
