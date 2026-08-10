"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { axiosClient } from "../../lib/axios";
import { useAuthStore } from "../../store/auth.store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

// 1. Định nghĩa Schema Validation bằng Zod khớp hoàn toàn với Backend DTO
const loginSchema = zod.object({
  email: zod
    .string()
    .nonempty("Email không được để trống")
    .email("Email không đúng định dạng"),
  password: zod
    .string()
    .nonempty("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
});

type LoginFormData = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [apiError, setApiError] = useState<string | null>(null);

  // 2. Cấu hình Hook Form kết nối với Zod Validator
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Logic xử lý Submit Form
  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);

      // Gửi request lên Backend NestJS (HttpOnly Cookie sẽ tự động được Server ghi vào trình duyệt)
      const response = await axiosClient.post("/v1/auth/login", data);
      const { accessToken, user } = response.data;

      // Lưu trữ phiên đăng nhập vào Zustand Store toàn cục
      setAuth(user, accessToken);

      // Đăng nhập thành công -> Điều hướng về trang chủ
      router.push("/");
    } catch (error: any) {
      // Hứng lỗi trả về từ tầng ValidationPipe hoặc Exception của NestJS
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại!";
      setApiError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Đăng nhập vào <span className="text-blue-600">ShopZone</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition"
            >
              đăng ký tài khoản mới miễn phí
            </Link>
          </p>
        </div>

        {/* Hiển thị thông báo lỗi từ API Backend nếu có */}
        {apiError && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="text-sm font-medium text-red-800">{apiError}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Ô nhập Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ Email
              </label>
              <input
                {...register("email")}
                type="text"
                className={`block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="name@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Ô nhập Mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                {...register("password")}
                type="password"
                className={`block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900 select-none"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Nút bấm Đăng nhập */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>
        </form>
        {/* Đường kẻ ngang ngăn cách giữa luồng Local và OAuth2 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Hoặc tiếp tục với
            </span>
          </div>
        </div>

        {/* Nhúng nút bấm Google đăng nhập đồng bộ mã Client ID từ .env */}
        <GoogleOAuthProvider
          clientId={
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
            "Thay_Mã_Client_Id_Của_Bạn_Vào_Đây"
          }
        >
          <GoogleLoginButton onError={(msg) => setApiError(msg)} />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
