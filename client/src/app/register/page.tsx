"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { axiosClient } from "../../lib/axios";

// 1. Định nghĩa bộ luật kiểm tra dữ liệu Đăng ký
const registerSchema = zod
  .object({
    fullName: zod
      .string()
      .nonempty("Họ và tên không được để trống")
      .min(2, "Họ và tên quá ngắn"),
    email: zod
      .string()
      .nonempty("Email không được để trống")
      .email("Email không đúng định dạng"),
    password: zod
      .string()
      .nonempty("Mật khẩu không được để trống")
      .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
    confirmPassword: zod.string().nonempty("Vui lòng xác nhận lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp",
    path: ["confirmPassword"], // Báo lỗi đỏ ngay tại ô nhập lại mật khẩu
  });

type RegisterFormData = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setApiError(null);

      // Gọi API đăng ký của NestJS
      await axiosClient.post("/v1/auth/register", {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });

      setIsSuccess(true);
      // Đợi 2 giây để khách đọc thông báo thành công rồi đá sang trang login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      setApiError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Tạo tài khoản <span className="text-blue-600">ShopZone</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {/* Thông báo Đăng ký thành công mỹ mãn */}
        {isSuccess && (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <div className="text-sm font-medium text-green-800">
              🎉 Đăng ký thành công! Hệ thống đang chuyển hướng bạn về trang
              đăng nhập...
            </div>
          </div>
        )}

        {/* Hiển thị thông báo lỗi từ API Backend nếu email đã tồn tại */}
        {apiError && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="text-sm font-medium text-red-800">{apiError}</div>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Ô Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              {...register("fullName")}
              type="text"
              className={`block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Ô Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ Email
            </label>
            <input
              {...register("email")}
              type="text"
              className={`block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Ô Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              {...register("password")}
              type="password"
              className={`block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Tối thiểu 6 ký tự"
            />
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Ô Nhập lại mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              className={`block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Nút Đăng ký */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition"
            >
              {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
