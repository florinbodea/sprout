"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function FieldGroup({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const { user, isLoading, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  // Already logged in — redirect away
  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace(user.onboardingComplete ? "/search" : "/onboarding");
    }
  }, [user, isLoading, router]);

  function validate() {
    const e: typeof errors = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Please enter your full name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Please enter a valid email address.";
    if (!password || password.length < 8)
      e.password = "Password must be at least 8 characters.";
    return e;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // Password is validated but intentionally not stored (demo app)
    register(name, email);
    router.push("/onboarding");
  }

  if (isLoading || user) return null; // avoid flash while redirecting

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900">
            <span className="text-3xl">🌿</span>
            Sprout
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Shop smarter, eat better
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-400 mt-1">
              Free forever. Your data stays on your device.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FieldGroup label="Full name" error={errors.name}>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                placeholder="Jane Smith"
                autoComplete="name"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </FieldGroup>

            <FieldGroup label="Email" error={errors.email}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="jane@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </FieldGroup>

            <FieldGroup label="Password" error={errors.password}>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </FieldGroup>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 active:bg-emerald-700 transition"
            >
              Create account →
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          No credit card required. No account on our servers.
        </p>
      </div>
    </div>
  );
}
