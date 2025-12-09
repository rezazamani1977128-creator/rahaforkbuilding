export type UserRole = 'manager' | 'board_member' | 'owner' | 'tenant';

export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  unitsCount: number;
  logo?: string;
  role: UserRole; // User's role in this building
}

export interface AuthState {
  user: User | null;
  buildings: Building[];
  currentBuilding: Building | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  selectBuilding: (buildingId: string) => void;
  resetPassword: (phone: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export interface RegisterData {
  phone: string;
  firstName: string;
  lastName: string;
  email?: string;
  buildingName?: string;
  buildingAddress?: string;
  isNewBuilding: boolean;
  inviteCode?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  requiresOTP: boolean;
}

export interface OTPVerifyResponse {
  success: boolean;
  user: User;
  buildings: Building[];
  token: string;
}
