export interface Patient {
    _id: string;
    name: string;
    age: number;
    gestationalAge: string;
    expectedDeliveryDate: string;
}

export type RootStackParamList = {
    HomeScreen: undefined;
    AddPatient: { onSubmit: (newPatient: Patient) => void }; // Add onSubmit type here;
    Patient: { id: string };
  // Add other screens here
};
