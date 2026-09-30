import {
  RegisterInput,
  LoginInput,
  ProfileUpdateInput,
  AdvisoryRequestInput,
  FeedbackInput,
  PaginationQuery,
  SafeUser,
  FullAdvisoryDetail,
  DashboardStats,
  ApiResponse,
} from '@shared';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('agri_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('agri_token', token);
    } else {
      localStorage.removeItem('agri_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('agri_token');
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      const contentType = response.headers.get('content-type');
      let data: any = null;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        throw new ApiError(
          data?.error || data?.message || 'An error occurred during the request.',
          response.status,
          data?.errors
        );
      }

      return data;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        err.message || 'Unable to connect to the server. Please check your network connection.',
        0
      );
    }
  }

  // Auth Endpoints
  auth = {
    register: async (input: RegisterInput): Promise<{ user: SafeUser; token: string }> => {
      const res = await this.request<{ user: SafeUser; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (res.data?.token) {
        this.setToken(res.data.token);
      }
      return res.data!;
    },

    login: async (input: LoginInput): Promise<{ user: SafeUser; token: string }> => {
      const res = await this.request<{ user: SafeUser; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (res.data?.token) {
        this.setToken(res.data.token);
      }
      return res.data!;
    },

    logout: async (): Promise<void> => {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } finally {
        this.setToken(null);
      }
    },

    me: async (): Promise<SafeUser> => {
      const res = await this.request<{ user: SafeUser }>('/auth/me');
      return res.data!.user;
    },
  };

  // Profile Endpoints
  profile = {
    get: async (): Promise<SafeUser> => {
      const res = await this.request<{ user: SafeUser }>('/profile');
      return res.data!.user;
    },

    update: async (input: ProfileUpdateInput): Promise<SafeUser> => {
      const res = await this.request<{ user: SafeUser }>('/profile', {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      return res.data!.user;
    },
  };

  // Advisory Endpoints
  advisories = {
    create: async (input: AdvisoryRequestInput): Promise<FullAdvisoryDetail> => {
      const res = await this.request<FullAdvisoryDetail>('/advisories', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return res.data!;
    },

    list: async (
      query: Partial<PaginationQuery> = {}
    ): Promise<{ advisories: any[]; total: number; page: number; limit: number }> => {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.severity) params.append('severity', query.severity);
      if (query.crop) params.append('crop', query.crop);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await this.request<{
        advisories: any[];
        total: number;
        page: number;
        limit: number;
      }>(`/advisories${qs}`);
      return res.data!;
    },

    getById: async (id: string): Promise<FullAdvisoryDetail> => {
      const res = await this.request<FullAdvisoryDetail>(`/advisories/${id}`);
      return res.data!;
    },

    delete: async (id: string): Promise<void> => {
      await this.request(`/advisories/${id}`, { method: 'DELETE' });
    },

    submitFeedback: async (resultId: string, input: FeedbackInput): Promise<any> => {
      const res = await this.request(`/advisories/${resultId}/feedback`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return res.data;
    },

    getStats: async (): Promise<DashboardStats> => {
      const res = await this.request<DashboardStats>('/advisories/stats');
      return res.data!;
    },
  };

  // Health
  health = async (): Promise<{ status: string }> => {
    const res = await this.request<{ status: string }>('/health');
    return res.data!;
  };
}

export const api = new ApiClient();
