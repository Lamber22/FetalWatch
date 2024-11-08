import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientById } from '../slices/patientSlice';
import { useParams } from 'react-router-dom';
import { fetchPregnancyById } from '../slices/PregnancySlice'; // Import fetchPregnancyById

const PatientDetailScreen = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { patient, loading, error } = useSelector(state => state.patients);
    const { pregnancies } = useSelector(state => state.pregnancies); // Add pregnancies selector

    useEffect(() => {
        dispatch(getPatientById(id));
        dispatch(fetchPregnancyById(id)); // Fetch pregnancy details
    }, [dispatch, id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Patient Details</h1>
            {patient && (
                <div>
                    <p>Name: {patient.firstName} {patient.lastName}</p>
                    <p>Date of Birth: {patient.dateOfBirth}</p>
                    <p>Age: {patient.age}</p>
                    <p>Gender: {patient.gender}</p>
                    <p>Address: {patient.address}</p>
                    <p>Contact Information: {patient.contactInformation}</p>
                    <p>Emergency Contact: {patient.emergencyContact}</p>
                    <p>Medical History: {patient.medicalHistory}</p>
                    {/* Display pregnancy details */}
                    {pregnancies.map(pregnancy => (
                        <div key={pregnancy._id}>
                            <p>Pregnancy ID: {pregnancy._id}</p>
                            <p>Gestational Age: {pregnancy.gestationalAge}</p>
                            <p>Expected Delivery Date: {pregnancy.expectedDeliveryDate}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDetailScreen;