import { useMutation } from "@tanstack/react-query";
import type { UserLoginType, UserRegistrationType } from "@/types";
import { useRouter } from "next/navigation";
import { message } from "antd";
import type { AxiosError } from "axios";
import api from "@/lib/api";

export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: UserLoginType) => {
      const res = await api.post("/users/login", values);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      message.success("Login successful!");
      router.push("/");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      message.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: UserRegistrationType) => {
      const res = await api.post("/users", values);
      return res.data;
    },
    onSuccess: () => {
      message.success("Registration successful! Please login.");
      router.push("/login");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      message.error(error.response?.data?.message || "Registration failed");
    },
  });
};
