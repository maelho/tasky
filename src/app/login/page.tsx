"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "~/components/login-form";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (_data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(undefined);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError(undefined);

    try {
      console.log("Google login clicked");
    } catch {
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    setIsLoading(true);
    setError(undefined);

    try {
      console.log("GitHub login clicked");
    } catch {
      setError("Failed to sign in with GitHub. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
          onGitHubLogin={handleGitHubLogin}
          isLoading={isLoading}
          error={error}
          showSocialLogins={true}
          showForgotPassword={true}
          showSignUpLink={true}
        />
      </div>
    </div>
  );
}
