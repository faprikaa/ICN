"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsReady(true);
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  }, [router]);

  const clearAuthOnError = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  return { isReady, isAuthenticated, logout, clearAuthOnError };
}
