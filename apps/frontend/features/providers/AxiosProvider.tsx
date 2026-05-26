// providers/AxiosProvider.tsx

"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { axiosInstance } from "@/lib/axios";

export default function AxiosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return children;
}
