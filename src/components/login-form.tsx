"use client";

import { useState } from "react";
import Link from "next/link";

import { SiteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface LoginFormProps {
  className?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  onGoogleLogin?: () => void;
  onGitHubLogin?: () => void;
  isLoading?: boolean;
  error?: string;
  showSocialLogins?: boolean;
  showForgotPassword?: boolean;
  showSignUpLink?: boolean;
}

export function LoginForm({
  className,
  onSubmit,
  onGoogleLogin,
  onGitHubLogin,
  isLoading = false,
  error,
  showSocialLogins = true,
  showForgotPassword = true,
  showSignUpLink = true,
}: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg">
              <span className="text-lg font-bold">T</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your {SiteConfig.title} account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {showSocialLogins && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onGoogleLogin}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Icons.google className="mr-2 h-4 w-4" />
                      )}
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onGitHubLogin}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Icons.gitHub className="mr-2 h-4 w-4" />
                      )}
                      GitHub
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background text-muted-foreground px-2">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  disabled={isLoading}
                  className={cn(
                    fieldErrors.email &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                  required
                />
                {fieldErrors.email && (
                  <p className="text-destructive text-sm">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {showForgotPassword && (
                    <Link
                      href="/forgot-password"
                      className="text-sm underline-offset-4 hover:underline"
                      tabIndex={-1}
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  disabled={isLoading}
                  className={cn(
                    fieldErrors.password &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                  required
                />
                {fieldErrors.password && (
                  <p className="text-destructive text-sm">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>

            {showSignUpLink && (
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
