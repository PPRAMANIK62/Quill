"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const AuthCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, error } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    if (data?.success === true) {
      router.push(origin !== null ? `/${origin}` : "/dashboard");
      return;
    }

    if (error?.data?.code === "UNAUTHORIZED") {
      router.push("signin");
      return;
    }
  }, [data, error, origin, router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Loading...</h3>
      </div>
    </div>
  );
};

const SuspendedAuthCallbackPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AuthCallbackPage />
    </Suspense>
  );
};

export default SuspendedAuthCallbackPage;
