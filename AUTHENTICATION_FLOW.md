# FetalWatch Authentication Flow with Email Verification

## Overview
The authentication system has been completely configured for FetalWatch healthcare monitoring system with mandatory email verification before users can input any other information.

## Authentication Endpoints

### 1. Registration Flow (Email Verification Required)

#### **POST** `/auth/initiate-signup`
**Purpose**: Start the registration process and send OTP for email verification

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "patient" // or "doctor", "nurse", "admin", "midwife"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Verification code sent to your email. Please check your inbox and verify to complete registration.",
  "data": {
    "email": "john.doe@example.com",
    "expiresIn": "10 minutes"
  }
}
```

#### **POST** `/auth/verify-email-and-complete-signup`
**Purpose**: Verify OTP and complete user registration

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Registration completed successfully. Welcome to FetalWatch!",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "patient",
      "emailVerified": true
    }
  }
}
```

#### **POST** `/auth/resend-otp`
**Purpose**: Resend verification code if expired or not received

**Request Body**:
```json
{
  "email": "john.doe@example.com"
}
```

### 2. Login Flow

#### **POST** `/auth/signin`
**Purpose**: Authenticate existing users (requires verified email)

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Welcome back to FetalWatch! You have been authenticated successfully.",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "patient",
      "emailVerified": true,
      "lastLogin": "2025-07-03T10:30:00.000Z"
    }
  }
}
```

### 3. Password Reset Flow (OTP-Based)

#### **POST** `/auth/forgot-password`
**Purpose**: Request password reset and send OTP

**Request Body**:
```json
{
  "email": "john.doe@example.com"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Password reset verification code sent to your email",
  "data": {
    "email": "john.doe@example.com",
    "expiresIn": "10 minutes"
  }
}
```

#### **POST** `/auth/verify-password-reset-otp`
**Purpose**: Verify OTP and get reset token

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Verification successful. You can now reset your password.",
  "data": {
    "resetToken": "jwt_reset_token",
    "expiresIn": "30 minutes"
  }
}
```

#### **POST** `/auth/reset-password`
**Purpose**: Reset password using verified token

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "resetToken": "jwt_reset_token",
  "password": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Password has been reset successfully. You can now sign in with your new password."
}
```

### 4. Logout

#### **POST** `/auth/signout`
**Purpose**: Sign out user and clear tokens

## Key Features

### ✅ Email Verification Required
- Users must verify their email before account creation
- No account is created until email is verified
- Temporary data stored in Redis with expiration

### ✅ Healthcare-Specific Roles
- `patient` - Patients receiving care
- `doctor` - Medical doctors
- `nurse` - Nursing staff
- `midwife` - Midwifery professionals
- `admin` - System administrators

### ✅ Security Features
- OTP-based verification (6-digit codes)
- Password strength validation
- Account status checks (active/inactive)
- Token-based authentication with JWT
- Password reset prevents reusing old password
- Rate limiting ready (Redis infrastructure)

### ✅ Email Templates
- Welcome/verification emails with FetalWatch branding
- Password reset notifications
- Password reset confirmation emails
- Professional healthcare-themed styling

### ✅ Redis Integration
- OTP storage with automatic expiration (10 minutes)
- Temporary user data storage
- Session management ready
- Reset token management

## Security Considerations

1. **Email Verification Mandatory**: Users cannot access the system without verifying their email
2. **OTP Expiration**: All OTPs expire in 10 minutes
3. **Password Security**: Minimum 8 characters, cannot reuse old password
4. **Token Management**: JWT tokens with appropriate expiration times
5. **Account Status**: Inactive accounts cannot sign in
6. **Role-Based Access**: Healthcare-specific role validation

## Database Requirements

The User model should include these fields:
```javascript
{
  firstName: String,
  lastName: String, 
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['patient', 'doctor', 'nurse', 'admin', 'midwife']),
  emailVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  lastLogin: Date,
  passwordResetAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables Required

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT
JWT_SECRET=your-jwt-secret

# Redis
REDIS_URL=redis://localhost:6379

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

## Usage Flow

1. **Registration**: 
   - User submits registration data → OTP sent → User verifies OTP → Account created
   
2. **Login**: 
   - User enters credentials → System checks email verification → Authentication successful
   
3. **Password Reset**: 
   - User requests reset → OTP sent → User verifies OTP → User sets new password → Confirmation sent

This implementation ensures that email verification is mandatory before users can access any FetalWatch healthcare monitoring features.
