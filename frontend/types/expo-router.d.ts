import type { LinkProps as OriginalLinkProps } from 'expo-router/build/link/Link';
import type { Href, HrefOrHrefWithParams, HrefWithParams } from 'expo-router/build/link/href';
import type { Router as OriginalRouter, useRouter as originalUseRouter } from 'expo-router';

// Define our app's routes
type AppRoutes =
  // Root routes
  | '/'
  | '/not-found'
  | '/_sitemap'
  
  // Tab routes
  | '/(tabs)'
  | '/(tabs)/index'
  | '/(tabs)/patients'
  | '/(tabs)/reports'
  | '/(tabs)/profile'
  | '/(tabs)/explore'
  
  // Auth routes
  | '/(auth)'
  | '/(auth)/login'
  | '/(auth)/register'
  | '/(auth)/forgot-password'
  
  // Patient routes
  | '/(app)/Patients'
  | '/(app)/Patients/PatientDetails'
  | '/(app)/Patients/AddPatient'
  | '/(app)/Patients/Forms/AddMedication'
  | '/(app)/Patients/Forms/AddVisit'
  | '/(app)/Patients/Forms/AddVitals'
  
  // Appointment routes
  | '/appointment'
  | '/appointment/add'
  | '/appointment/[id]';

// Define dynamic route parameters
type DynamicRoutes = {
  '/(app)/Patients/PatientDetails': { id: string };
  '/(app)/Patients/Forms/AddMedication': { id: string };
  '/(app)/Patients/Forms/AddVisit': { id: string };
  '/(app)/Patients/Forms/AddVitals': { id: string };
  '/appointment/[id]': { id: string };
};

// Extend the expo-router types
declare module 'expo-router' {
  // Extend the Href type to include our routes
  type AppHref<T extends string> = T extends keyof DynamicRoutes
    ? HrefWithParams<T, DynamicRoutes[T]>
    : T extends AppRoutes
    ? Href<T>
    : HrefOrHrefWithParams;

  // Extend Link props
  export interface LinkProps<T> extends Omit<OriginalLinkProps, 'href'> {
    href: T extends string ? AppHref<T> : HrefOrHrefWithParams;
    params?: T extends keyof DynamicRoutes ? DynamicRoutes[T] : never;
  }

  // Extend Router interface
  export interface Router {
    push: <T extends string>(
      href: T,
      ...rest: T extends keyof DynamicRoutes ? [DynamicRoutes[T]?] : []
    ) => void;
    
    replace: <T extends string>(
      href: T,
      ...rest: T extends keyof DynamicRoutes ? [DynamicRoutes[T]?] : []
    ) => void;
    
    back: () => void;
    canGoBack: () => boolean;
    setParams: <T extends string>(
      params: T extends keyof DynamicRoutes ? Partial<DynamicRoutes[T]> : never
    ) => void;
  }

  // Export router and useRouter with our extended types
  export const router: Router;
  export const useRouter: () => Router;

  // Re-export types from expo-router
  export * from 'expo-router/build/global';
  export * from 'expo-router/build/interfaces/Navigation';
  export * from 'expo-router/build/interfaces/Router';
  
  // Export our custom types
  export type {
    AppRoutes as Routes,
    DynamicRoutes,
  };
}

// Export the types for use in the app
export type { AppRoutes as Routes, DynamicRoutes };