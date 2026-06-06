"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setFilter = useCallback(
    (name: string, value: string | string[] | number | boolean | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value === undefined || value === "") {
        params.delete(name);
      } else if (Array.isArray(value)) {
        params.delete(name);
        value.forEach((val) => params.append(name, val));
      } else {
        params.set(name, String(value));
      }

      // Reset pagination page if filter other than page changes
      if (name !== "page") {
        params.delete("page");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  return {
    searchParams,
    setFilter,
    clearFilters,
    isPending,
  };
}
