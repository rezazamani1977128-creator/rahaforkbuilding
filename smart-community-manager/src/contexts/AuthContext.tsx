import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthContextType, User, Building, RegisterData } from '@/types/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  buildings: [],
  currentBuilding: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; buildings: Building[] } }
  | { type: 'LOGOUT' }
  | { type: 'SELECT_BUILDING'; payload: Building }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'RESTORE_SESSION'; payload: { user: User; buildings: Building[]; currentBuilding: Building | null } };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        buildings: action.payload.buildings,
        currentBuilding: action.payload.buildings.length === 1 ? action.payload.buildings[0] : null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SELECT_BUILDING':
      return { ...state, currentBuilding: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        buildings: action.payload.buildings,
        currentBuilding: action.payload.currentBuilding,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API functions (replace with real API calls later)
const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Check for demo session first
        const demoSession = localStorage.getItem('demo_session');
        if (demoSession) {
          const demoUser = JSON.parse(localStorage.getItem('demo_user') || '{}');
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: {
                id: 'demo-user',
                firstName: demoUser.firstName || 'کاربر',
                lastName: demoUser.lastName || 'دمو',
                phone: '09120000000',
                role: 'manager',
                createdAt: new Date(),
              },
              buildings: [{
                id: 'demo-building',
                name: 'ساختمان دمو',
                address: 'تهران، خیابان آزادی',
                unitsCount: 24,
                role: 'manager',
              }],
            },
          });
          return;
        }
        
        const savedSession = localStorage.getItem('auth_session');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          dispatch({ type: 'RESTORE_SESSION', payload: session });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        localStorage.removeItem('auth_session');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    restoreSession();
  }, []);

  // Save session to localStorage when it changes
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      localStorage.setItem('auth_session', JSON.stringify({
        user: state.user,
        buildings: state.buildings,
        currentBuilding: state.currentBuilding,
      }));
    }
  }, [state.isAuthenticated, state.user, state.buildings, state.currentBuilding]);

  const login = async (phone: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await mockApiDelay();
      // In real app, call API to send OTP
      // For now, just simulate success
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'خطا در ارسال کد تأیید' });
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await mockApiDelay();
      
      // Mock verification - accept any 6-digit OTP
      if (otp.length !== 6) {
        throw new Error('کد تأیید نامعتبر است');
      }

      // Mock user data
      const mockUser: User = {
        id: '1',
        phone,
        firstName: 'علی',
        lastName: 'محمدی',
        role: 'manager',
        createdAt: new Date(),
      };

      const mockBuildings: Building[] = [
        {
          id: '1',
          name: 'برج آسمان',
          address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
          unitsCount: 24,
          role: 'manager',
        },
        {
          id: '2',
          name: 'مجتمع گلستان',
          address: 'تهران، خیابان شریعتی، پلاک ۴۵۶',
          unitsCount: 16,
          role: 'owner',
        },
      ];

      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: mockUser, buildings: mockBuildings } 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'خطا در تأیید کد' });
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await mockApiDelay();
      
      const mockUser: User = {
        id: Date.now().toString(),
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.isNewBuilding ? 'manager' : 'tenant',
        createdAt: new Date(),
      };

      const mockBuilding: Building = {
        id: Date.now().toString(),
        name: data.buildingName || 'ساختمان جدید',
        address: data.buildingAddress || '',
        unitsCount: 0,
        role: data.isNewBuilding ? 'manager' : 'tenant',
      };

      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: mockUser, buildings: [mockBuilding] } 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'خطا در ثبت‌نام' });
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    localStorage.removeItem('auth_token');
    dispatch({ type: 'LOGOUT' });
  };

  const selectBuilding = (buildingId: string) => {
    const building = state.buildings.find(b => b.id === buildingId);
    if (building) {
      dispatch({ type: 'SELECT_BUILDING', payload: building });
    }
  };

  const resetPassword = async (phone: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await mockApiDelay();
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'خطا در بازیابی رمز عبور' });
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await mockApiDelay();
      dispatch({ type: 'UPDATE_USER', payload: data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'خطا در بروزرسانی پروفایل' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: AuthContextType = {
    ...state,
    login,
    verifyOTP,
    register,
    logout,
    selectBuilding,
    resetPassword,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
