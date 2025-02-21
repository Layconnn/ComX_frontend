"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axiosInstance";

interface User {
  firstName?: string;
  companyName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("access_token");
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
  }, [router]);

  return { user, loading };
}
