import React, { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { PatientsProvider, usePatients } from './PatientsContext';
import { PregnanciesProvider, usePregnancies } from './PregnanciesContext';
import { ReportsProvider, useReports } from './ReportsContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import { UserProvider, useUser } from './UserContext';

export { AuthProvider, useAuth };
export { PatientsProvider, usePatients };
export { PregnanciesProvider, usePregnancies };
export { ReportsProvider, useReports };
export { ThemeProvider, useTheme };
export { UserProvider, useUser };

// Combined provider for wrapping the entire app
export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return React.createElement(
    ThemeProvider,
    null,
    React.createElement(
      UserProvider,
      null,
      React.createElement(
        AuthProvider,
        null,
        React.createElement(
          PatientsProvider,
          null,
          React.createElement(
            PregnanciesProvider,
            null,
            React.createElement(ReportsProvider, null, children)
          )
        )
      )
    )
  );
};
