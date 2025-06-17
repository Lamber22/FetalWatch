# FetalWatch Mobile App 🏥

A professional React Native application built with [Expo](https://expo.dev) and [Expo Router](https://docs.expo.dev/router/introduction/) for fetal health monitoring and patient management.

## 🚀 Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run on device/simulator**

   - Scan QR code with Expo Go (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 🏗️ Project Architecture

### Professional File Structure

```
app/
├── index.tsx                 # Root entry point with auth routing
├── _layout.tsx              # Root layout with providers
├── (auth)/                  # Authentication flow
│   ├── _layout.tsx         # Auth stack navigation
│   ├── index.tsx           # Welcome/landing screen
│   ├── login.tsx           # Sign in screen
│   ├── register.tsx        # Sign up screen
│   └── forgot-password.tsx # Password recovery
└── (main)/                  # Main authenticated app
    ├── _layout.tsx         # Tab navigation
    ├── dashboard.tsx       # Home/overview screen
    ├── patients/           # Patient management
    │   ├── index.tsx       # Patient list
    │   ├── add.tsx         # Add new patient
    │   └── [id].tsx        # Patient details
    ├── appointments/       # Appointment scheduling
    │   ├── index.tsx       # Calendar view
    │   └── add.tsx         # Schedule appointment
    ├── reports/            # Analytics & reports
    │   └── index.tsx       # Reports dashboard
    └── profile/            # User settings
        └── index.tsx       # Profile management

components/
├── ui/                     # Reusable UI components
├── forms/                  # Form components
└── constants/              # Theme, colors, etc.

contexts/                   # React Context providers
├── AuthContext.tsx        # Authentication state
├── ThemeContext.tsx       # Theme management
└── PatientsContext.tsx    # Patient data management

services/                   # API services
├── api.ts                 # Base API configuration
├── auth.ts                # Authentication services
└── patients.ts            # Patient-related API calls

types/                     # TypeScript type definitions
utils/                     # Utility functions
hooks/                     # Custom React hooks
```

## 🔐 Authentication Flow

The app implements a secure, professional authentication system:

1. **Root Index** (`app/index.tsx`) - Checks authentication status
2. **Unauthenticated Route** - `(auth)` group with welcome, login, register
3. **Authenticated Route** - `(main)` group with tab-based interface

### Route Groups Explanation

- `(auth)` - Authentication screens (no tabs, stack navigation)
- `(main)` - Main app screens (bottom tab navigation)

## 📱 Core Features

### 🏠 Dashboard

- Patient statistics overview
- Quick action buttons
- Recent patient activity
- High-risk case alerts

### 👥 Patient Management

- Complete patient profiles
- Medical history tracking
- Risk assessment
- Search and filtering

### 📅 Appointment Scheduling

- Calendar-based interface
- Appointment reminders
- Patient availability
- Provider scheduling

### 📊 Reports & Analytics

- Patient data visualization
- Risk trend analysis
- Appointment statistics
- Export capabilities

### 👤 Profile Management

- User settings
- Notification preferences
- Security settings
- Account management

## 🎨 Design System

### Theme Structure

- **Colors**: Primary, secondary, success, warning, error
- **Typography**: Consistent font scales and weights
- **Spacing**: Standardized padding and margins
- **Shadows**: Depth and elevation system
- **Components**: Reusable, styled components

### Modal System

The app includes a professional modal component that behaves like React web modals:

```tsx
import Modal from '@/components/ui/Modal';

// Basic usage
<Modal
  visible={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
>
  <YourContent />
</Modal>

// Advanced usage with animations
<Modal
  visible={showModal}
  onClose={() => setShowModal(false)}
  title="Add Patient"
  size="large"
  animationType="slide"
  closeOnBackdropPress={true}
>
  <AddPatientForm />
</Modal>
```

**Features:**
- Multiple sizes: `small`, `medium`, `large`, `fullscreen`
- Animation types: `scale` (default), `slide`, `fade`
- Backdrop press to close
- Smooth entrance/exit animations
- Portal-like behavior (renders above all content)
- Proper status bar handling

### Responsive Design

- Optimized for both phones and tablets
- Adaptive layouts
- Accessibility features
- Dark/light theme support

## 🔧 Development Workflow

### Reset Project Structure

When starting fresh or restructuring:

```bash
npm run reset-project
```

This creates a clean, professional app structure following best practices.

### Code Organization

- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Type Safety**: Full TypeScript integration
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized with React Native best practices

### State Management

- **Context API**: For global state (auth, theme, patients)
- **Local State**: Component-level state with hooks
- **Async Storage**: Persistent local data storage

## 🧪 Testing & Quality

### Code Quality

- ESLint configuration
- TypeScript strict mode
- Consistent code formatting
- Component documentation

### Performance Optimization

- Lazy loading for screens
- Image optimization
- Memory management
- Bundle size optimization

## 📚 Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Expo Router**: File-based routing system
- **TypeScript**: Type safety and better DX
- **React Context**: State management
- **Async Storage**: Local data persistence
- **React Native Gesture Handler**: Touch interactions
- **Vector Icons**: Consistent iconography

## 🔗 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Follow the established architecture patterns
2. Maintain type safety with TypeScript
3. Write clear, documented code
4. Test thoroughly on multiple devices
5. Follow mobile design guidelines

## 📄 License

This project is licensed under the MIT License.
