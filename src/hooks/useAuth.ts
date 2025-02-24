"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axiosInstance";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface User {
  firstName?: string;
  companyName?: string;
}

export function useAuth() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  // Access the redux-persist state
  const persistState = useSelector((state: RootState) => state._persist);
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      // Wait until redux-persist has rehydrated
      if (!persistState?.rehydrated) {
        return;
      }

      if (!token) {
        router.push("/welcome");
        return;
      }

      try {
        const response = await axiosInstance.get<User>("/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push("/welcome");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router, token, persistState]);

  return { user, loading };
}
