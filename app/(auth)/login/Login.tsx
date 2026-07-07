"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/auth-context";
import { notify } from "@/utils";
import Image from "next/image";

import { ROLE_ROUTE } from "@/utils/role-route";

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { setSession } = useSession();
  const from = searchParams.get("from");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (res.data) {
        const session = await authClient.getSession();
        setSession(session?.data);

        const user = res.data.user;
        notify.success("Log in successful!");

        router.push(
          from ||
            ROLE_ROUTE[user?.role as keyof typeof ROLE_ROUTE] ||
            "/",
        );
      } else {
        setServerError(res?.error?.message || "Login failed");
        notify.error(res?.error?.message || "Login failed");
      }
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Login failed",
      );
      notify.error(
        error instanceof Error ? error.message : "Login failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl">
        {/* Logo & Header */}
        <div className="space-y-4 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={200}
                height={200}
                className="mx-auto w-30"
              />
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Log in to your account to continue
            </p>
          </div>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
            {serverError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                disabled={isLoading}
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <FieldError>{errors.email.message}</FieldError>
              )}
            </Field>

            {/* Password Field */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:text-primary/90 underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            {/* Remember Me Checkbox */}
            <Field orientation="horizontal">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setValue("rememberMe", checked as boolean)
                }
                disabled={isLoading}
              />
              <FieldLabel
                htmlFor="rememberMe"
                className="text-sm font-normal"
              >
                Remember me
              </FieldLabel>
            </Field>
          </FieldGroup>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full p-5 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary/90 underline-offset-4 hover:underline font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
