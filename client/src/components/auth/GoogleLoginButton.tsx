"use client";

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { axiosClient } from "../../lib/axios";
import { useAuthStore } from "../../store/auth.store";

export default function GoogleLoginButton({
  onError,
}: {
  onError: (msg: string) => void;
}) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      // 1. Lấy mã ID Token từ pop-up Google thành công
      const googleToken = credentialResponse.credential;

      // 2. Bắn payload mã hóa sang API Backend NestJS xử lý kiểm toán dữ liệu
      const response = await axiosClient.post("/v1/auth/google", {
        token: googleToken,
      });
      const { accessToken, user } = response.data;

      // 3. Lưu thông tin phiên vào Zustand Store như bình thường
      setAuth(user, accessToken);

      // Đăng nhập thành công -> đưa về trang chủ mua sắm
      router.push("/");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Đăng nhập bằng tài khoản Google thất bại";
      onError(msg);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => onError("Kết nối xác thực Google gặp sự cố")}
        useOneTap // Bật tính năng Đăng nhập một chạm (gợi ý góc màn hình) siêu mượt
        theme="filled_blue"
        shape="pill"
        locale="vi"
      />
    </div>
  );
}
