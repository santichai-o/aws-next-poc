// Member Profile types based on OpenAPI schema
export interface MemberProfile {
  memberId: string
  firstName: string
  lastName: string
  email: string
  address?: {
    street: string
    city: string
    zip: string
  }
  dateOfBirth?: string
  phoneNumber?: string
  nationalId?: string
  hashedSensitiveId?: string
  lineConnected?: boolean
  countryCode?: string
}

export interface NewMemberProfileRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  countryCode: string
  nationalId: string
}

export interface UpdateMemberProfileRequest {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  address?: {
    street: string
    city: string
    zip: string
  }
  dateOfBirth?: string
}

// Component types
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  createdAt?: string
  updatedAt?: string
}

export interface PIIData {
  id: string
  userId: number
  dataType: 'email' | 'phone' | 'address' | 'ssn' | 'other'
  value: string
  isEncrypted: boolean
  createdAt: string
  updatedAt: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface UserForm {
  name: string
  email: string
  role: User['role']
}

export interface SessionData {
  idToken?: string;
}