# FetalWatch API Documentation

This document provides comprehensive information about the FetalWatch API endpoints, required parameters, and response formats.

## Base URL

All API requests should be made to:
```
/api/v1/
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All endpoints follow a consistent error response format:
```json
{
  "status": "failed",
  "message": "Error message details",
  "error": "Error details or stack trace in development"
}
```

## Authentication Routes

### Sign Up
- **URL**: `/api/v1/auth/signUp`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string",
    "role": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "user created successfully",
    "data": {
      "user object with sensitive fields removed"
    }
  }
  ```

### Sign In
- **URL**: `/api/v1/auth/signIn`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Authenticate a user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "user authenticated successfully",
    "token": "jwt-token-string"
  }
  ```

## User Management

### Get All Users
- **URL**: `/api/v1/user`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a list of all users
- **Success Response**:
  ```json
  {
    "status": "success",
    "numUsers": 10,
    "data": [
      { "user objects" }
    ]
  }
  ```

### Get User by ID
- **URL**: `/api/v1/user/:userId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific user by ID
- **URL Parameters**: `userId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "User found",
    "data": { "user object" }
  }
  ```

### Get Users by Role
- **URL**: `/api/v1/user/role:role`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get users with a specific role
- **URL Parameters**: `role=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "numUsers": 5,
    "data": [
      { "user objects with specified role" }
    ]
  }
  ```

### Update User
- **URL**: `/api/v1/user/:userId`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update a user's information
- **URL Parameters**: `userId=[string]`
- **Request Body**: Any user fields to update
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "User updated successfully",
    "data": { "updated user object" }
  }
  ```

### Delete User
- **URL**: `/api/v1/user/:userId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete a user
- **URL Parameters**: `userId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "User removed successfully"
  }
  ```

## Patient Management

### Create Patient
- **URL**: `/api/v1/patients`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Register a new patient
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "dateOfBirth": "YYYY-MM-DD",
    "age": "number",
    "gender": "string",
    "address": "object",
    "contactInformation": "object"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Patient created successfully",
    "data": { "patient object" }
  }
  ```

### Get All Patients
- **URL**: `/api/v1/patients`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a list of all patients
- **Success Response**:
  ```json
  {
    "status": "success",
    "numPatients": 25,
    "data": [
      { "patient objects" }
    ]
  }
  ```

### Manage Patients (with filtering)
- **URL**: `/api/v1/patients/manage`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get filtered list of patients with pagination
- **Query Parameters**:
  - `page=[number]` - Page number (default: 1)
  - `limit=[number]` - Results per page (default: 10)
  - `search=[string]` - Search term for patient name or ID
- **Success Response**:
  ```json
  {
    "patients": [{ "patient objects" }],
    "totalPages": 5,
    "currentPage": 1
  }
  ```

### Get Patient by ID
- **URL**: `/api/v1/patients/:patientId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific patient by ID
- **URL Parameters**: `patientId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Patient found",
    "data": { "patient object" }
  }
  ```

### Update Patient
- **URL**: `/api/v1/patients/:patientId`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update a patient's information
- **URL Parameters**: `patientId=[string]`
- **Request Body**: Any patient fields to update
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Patient updated successfully",
    "data": { "updated patient object" }
  }
  ```

### Delete Patient
- **URL**: `/api/v1/patients/:patientId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete a patient
- **URL Parameters**: `patientId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Patient deleted successfully"
  }
  ```

## Pregnancy Management

### Create Pregnancy
- **URL**: `/api/v1/pregnancies`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new pregnancy record
- **Request Body**:
  ```json
  {
    "patientId": "string",
    "gestationalAge": "number",
    "expectedDeliveryDate": "YYYY-MM-DD",
    "prenatalCare": {
      "numberOfVisits": "number",
      "adherence": "boolean"
    },
    "vitalSigns": {
      "bloodPressure": "string",
      "temperature": "number",
      "pulse": "number",
      "respiratoryRate": "number"
    }
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Pregnancy created and patient updated successfully",
    "data": { "pregnancy object" }
  }
  ```

### Get All Pregnancies
- **URL**: `/api/v1/pregnancies`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a list of all pregnancies
- **Success Response**:
  ```json
  {
    "status": "success",
    "numPregnancies": 15,
    "data": [
      { "pregnancy objects with patient details" }
    ]
  }
  ```

### Get Pregnancies by Patient ID
- **URL**: `/api/v1/pregnancies/patient/:patientId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get all pregnancies for a specific patient
- **URL Parameters**: `patientId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "numPregnancies": 3,
    "data": [
      { "pregnancy objects for specific patient" }
    ]
  }
  ```

### Get Pregnancy by ID
- **URL**: `/api/v1/pregnancies/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific pregnancy by ID
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Pregnancy found",
    "data": { "pregnancy object with patient details" }
  }
  ```

### Update Pregnancy
- **URL**: `/api/v1/pregnancies/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update a pregnancy record
- **URL Parameters**: `id=[string]`
- **Request Body**: Any pregnancy fields to update
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Pregnancy updated successfully",
    "data": { "updated pregnancy object" }
  }
  ```

### Delete Pregnancy
- **URL**: `/api/v1/pregnancies/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete a pregnancy record
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Pregnancy deleted successfully"
  }
  ```

## Fetal Watch Management

### Create Fetal Watch
- **URL**: `/api/v1/fetalwatch`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new fetal watch record
- **Request Body**:
  ```json
  {
    "patientId": "string",
    "pregnancyId": "string",
    "fetalHeartRate": "number",
    "fetalMovement": "string",
    "fetalPosition": "string",
    "additionalNotes": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Fetal creation successful",
    "data": { "fetal watch object" }
  }
  ```

### Get All Fetal Watches
- **URL**: `/api/v1/fetalwatch`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a list of all fetal watch records
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "all fetal data retrieved successfully",
    "numFetalData": 30,
    "data": [
      { "fetal watch objects" }
    ]
  }
  ```

### Get Fetal Watch by ID
- **URL**: `/api/v1/fetalwatch/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific fetal watch record by ID
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "fetal data retrieved successfully",
    "numFetalData": 1,
    "data": { "fetal watch object" }
  }
  ```

### Update Fetal Watch
- **URL**: `/api/v1/fetalwatch/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update a fetal watch record
- **URL Parameters**: `id=[string]`
- **Request Body**: Any fetal watch fields to update
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "fetal data updated successfully",
    "numFetalData": 1,
    "data": { "updated fetal watch object" }
  }
  ```

### Delete Fetal Watch
- **URL**: `/api/v1/fetalwatch/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete a fetal watch record
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Fetal watch deleted successfully"
  }
  ```

## Lab Results

### Create Lab Result
- **URL**: `/api/v1/labResults`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new lab result record
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Lab result created successfully",
    "data": { "lab result object" }
  }
  ```

### Get All Lab Results
- **URL**: `/api/v1/labResults`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a list of all lab results
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": [
      { "lab result objects" }
    ]
  }
  ```

### Get Lab Result by ID
- **URL**: `/api/v1/labResults/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific lab result by ID
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": { "lab result object" }
  }
  ```

### Update Lab Result
- **URL**: `/api/v1/labResults/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update a lab result
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Lab result updated successfully",
    "data": { "updated lab result object" }
  }
  ```

### Delete Lab Result
- **URL**: `/api/v1/labResults/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete a lab result
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Lab result deleted successfully"
  }
  ```

## Maternal Health

### Create Maternal Health Record
- **URL**: `/api/v1/maternal`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new maternal health record
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Maternal health record created successfully",
    "data": { "maternal health object" }
  }
  ```

### Get All Maternal Health Records
- **URL**: `/api/v1/maternal`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a list of all maternal health records
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": [
      { "maternal health objects" }
    ]
  }
  ```

### Get Maternal Health by ID
- **URL**: `/api/v1/maternal/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific maternal health record by ID
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": { "maternal health object" }
  }
  ```

### Get Maternal Health by Patient
- **URL**: `/api/v1/maternal/patient/:patientId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get maternal health records for a specific patient
- **URL Parameters**: `patientId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": [
      { "maternal health objects for patient" }
    ]
  }
  ```

### Update Maternal Health
- **URL**: `/api/v1/maternal/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update a maternal health record
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Maternal health record updated successfully",
    "data": { "updated maternal health object" }
  }
  ```

### Delete Maternal Health
- **URL**: `/api/v1/maternal/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete a maternal health record
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Maternal health record deleted successfully"
  }
  ```

## Delivery Management

### Create Delivery
- **URL**: `/api/v1/delivery`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new delivery record
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Delivery record created successfully",
    "data": { "delivery object" }
  }
  ```

### Get All Deliveries
- **URL**: `/api/v1/delivery`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a list of all delivery records
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": [
      { "delivery objects" }
    ]
  }
  ```

### Get Delivery by ID
- **URL**: `/api/v1/delivery/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific delivery record by ID
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": { "delivery object" }
  }
  ```

### Get Deliveries by Patient
- **URL**: `/api/v1/delivery/patient/:patientId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get delivery records for a specific patient
- **URL Parameters**: `patientId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": [
      { "delivery objects for patient" }
    ]
  }
  ```

### Update Delivery
- **URL**: `/api/v1/delivery/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update a delivery record
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Delivery record updated successfully",
    "data": { "updated delivery object" }
  }
  ```

### Delete Delivery
- **URL**: `/api/v1/delivery/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete a delivery record
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Delivery record deleted successfully"
  }
  ```

## Postnatal Management

### Create Postnatal Record
- **URL**: `/api/v1/postnatal`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new postnatal record
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Postnatal record created successfully",
    "data": { "postnatal object" }
  }
  ```

### Get All Postnatal Records
- **URL**: `/api/v1/postnatal`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a list of all postnatal records
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": [
      { "postnatal objects" }
    ]
  }
  ```

### Get Postnatal Record by ID
- **URL**: `/api/v1/postnatal/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific postnatal record by ID
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": { "postnatal object" }
  }
  ```

### Get Postnatal Records by Patient
- **URL**: `/api/v1/postnatal/patient/:patientId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get postnatal records for a specific patient
- **URL Parameters**: `patientId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": [
      { "postnatal objects for patient" }
    ]
  }
  ```

### Get Postnatal Records by Delivery
- **URL**: `/api/v1/postnatal/delivery/:deliveryId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get postnatal records for a specific delivery
- **URL Parameters**: `deliveryId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": [
      { "postnatal objects for delivery" }
    ]
  }
  ```

### Update Postnatal Record
- **URL**: `/api/v1/postnatal/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update a postnatal record
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Postnatal record updated successfully",
    "data": { "updated postnatal object" }
  }
  ```

### Delete Postnatal Record
- **URL**: `/api/v1/postnatal/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete a postnatal record
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Postnatal record deleted successfully"
  }
  ```

## AI Results

### Create AI Result
- **URL**: `/api/v1/aiResults`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new AI analysis result
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "AI result created successfully",
    "data": { "AI result object" }
  }
  ```

### Get All AI Results
- **URL**: `/api/v1/aiResults`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a list of all AI results
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": [
      { "AI result objects" }
    ]
  }
  ```

### Get AI Result by ID
- **URL**: `/api/v1/aiResults/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a specific AI result by ID
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": { "AI result object" }
  }
  ```

### Update AI Result
- **URL**: `/api/v1/aiResults/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update an AI result
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "AI result updated successfully",
    "data": { "updated AI result object" }
  }
  ```

### Delete AI Result
- **URL**: `/api/v1/aiResults/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete an AI result
- **URL Parameters**: `id=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "AI result deleted successfully"
  }
  ```

## Reports

### Get Facility Dashboard
- **URL**: `/api/v1/reports/dashboard`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get facility-level dashboard statistics
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": {
      "totalPatients": 245,
      "activePregnancies": 120,
      "highRiskCases": 35,
      "recentDeliveries": 18,
      "patientsByRiskLevel": {
        "high": 35,
        "medium": 75,
        "low": 135
      }
    }
  }
  ```

### Generate Patient Report
- **URL**: `/api/v1/reports/patient/:patientId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Generate a comprehensive report for a specific patient
- **URL Parameters**: `patientId=[string]`
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": {
      "patientInfo": { "patient object" },
      "pregnancyHistory": [ "pregnancy objects" ],
      "maternalHealth": [ "maternal health objects" ],
      "fetalData": [ "fetal data objects" ],
      "labResults": [ "lab result objects" ],
      "riskAssessment": { "risk assessment object" }
    }
  }
  ```

### Generate Facility Report
- **URL**: `/api/v1/reports/facility`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Generate aggregate statistics for the entire facility
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": {
      "patientMetrics": { "metrics object" },
      "pregnancyOutcomes": { "outcomes object" },
      "riskDistribution": { "risk distribution object" },
      "facilityPerformance": { "performance metrics" }
    }
  }
  ```

### Get Risk Indicators Report
- **URL**: `/api/v1/reports/risk-indicators`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get statistics on high-risk indicators for monitoring trends
- **Success Response**:
  ```json
  {
    "status": "success",
    "data": {
      "hypertensionCases": 45,
      "diabetesCases": 32,
      "anemiaPrevalence": 56,
      "preeclampsiaRisk": 18,
      "trendsByMonth": [ "monthly trend data" ]
    }
  }
  ```

### Export Report
- **URL**: `/api/v1/reports/export/:reportType`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Export a report in a specific format (PDF, CSV, etc.)
- **URL Parameters**: `reportType=[string]` (patient, facility, or risk)
- **Query Parameters**:
  - `format=[string]` - Export format (pdf, csv, xlsx)
  - `id=[string]` - ID of entity for report (for patient reports)
- **Response**: File download
