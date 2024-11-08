import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatients } from '../slices/patientSlice';

const PatientListScreen = () => {
    const dispatch = useDispatch();
    const { patients, loading, error } = useSelector(state => state.patients);

    useEffect(() => {
        dispatch(getPatients());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Patients</h1>
            <ul>
                {patients.map(patient => (
                    <li key={patient._id}>{patient.firstName} {patient.lastName}</li>
                ))}
            </ul>
        </div>
    );
};

export default PatientListScreen;