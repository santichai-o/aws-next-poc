import { MemberProfile, UpdateMemberProfileRequest, NewMemberProfileRequest } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://pii-data-api:3000'

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // ในการใช้งานจริงจะต้องเพิ่ม Authorization header
        // 'Authorization': `Bearer ${getAuthToken()}`,
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API request error:", errorData)
        return {
          success: false,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          error: errorData.error || 'Unknown error',
          status: response.status,
          ...errorData
        }
      }
      
      const data = await response.json()
      return { success: true, ...data }
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Member registration APIs
  async register(data: NewMemberProfileRequest): Promise<any> {
    return this.request('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Member login APIs
  async login(email: string, password: string): Promise<any> {
    return this.request('/members/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  // Member logout API
  async logout(): Promise<any> {
    return this.request('/members/signout', {
      method: 'POST',
    })
  }

  // Member confirmation API
  async confirmMember(email: string, code: string): Promise<any> {
    return this.request('/members/confirm', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })
  }

  // Member Profile APIs
  async getMyProfile(): Promise<MemberProfile> {
    return this.request<MemberProfile>('/members/me', { method: 'GET' })
  }

  async updateMyProfile(data: UpdateMemberProfileRequest): Promise<MemberProfile> {
    return this.request<MemberProfile>('/members/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async confirm(email: string, code: string): Promise<any> {
    return this.request('/members/confirm', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })
  }

  // Member Profile APIs
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Create a default instance
export const apiClient = new ApiClient()
