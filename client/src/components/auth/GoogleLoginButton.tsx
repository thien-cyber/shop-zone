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
      const googleToken = credentialResponse.credential;

      const response = await axiosClient.post("/v1/auth/google", {
        token: googleToken,
      });
      const { accessToken, user } = response.data;

      setAuth(user, accessToken);

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
        useOneTap
        theme="filled_blue"
        shape="pill"
        locale="vi"
      />
    </div>
  );
}
