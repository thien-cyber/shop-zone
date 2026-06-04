import { useAuthStore } from '@/store/auth.store';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // BẮT BUỘC: Để trình duyệt tự gửi HttpOnly Cookie chứa Refresh Token lên Server
});

// 1. Request Interceptor: Tự động chèn Access Token vào Header trước khi gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Đón nhận kết quả và xử lý lỗi 401 tập trung (Silent Refresh Token)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu Server trả về 401 và request này chưa từng được thử refresh lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã thử refresh để tránh vòng lặp vô hạn

      try {
        // Gọi API refresh để lấy cặp token mới (Server sẽ đọc Refresh Token từ HttpOnly Cookie)
        const response = await axios.post(`${API_URL}/v1/auth/refresh`, {}, { withCredentials: true });
        const { accessToken, user } = response.data;

        // Cập nhật Access Token mới vào Zustand Store
        useAuthStore.getState().setAuth(user, accessToken);

        // Thực hiện lại request gốc ban đầu với Access Token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Nếu gọi API refresh cũng lỗi (Refresh Token hết hạn hoặc bị ban) -> Đăng xuất cưỡng bức
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);