import { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke akun Panguripan Olahraga Anda.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <LoginForm />
      </div>
    </main>
  );
}
