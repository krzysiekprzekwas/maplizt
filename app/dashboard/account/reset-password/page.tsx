import Link from "next/link";
import Image from "next/image";
import { FormMessage, Message } from "@/components/form-message";
import { resetPasswordAction } from "../actions";

export default async function ResetPasswordPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 brutal-shadow-hover">
          <div className="flex justify-center items-center mb-8">
            <Link href="/">
              <Image 
                src="/maplizt-logo-full.svg" 
                alt="Maplizt Logo" 
                width={158} height={80}
                className="rounded-lg border-2 border-[#19191b] brutal-shadow-all" 
              />
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">Reset Your Password</h1>

          <form>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-[#19191b] font-medium mb-2"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="confirmPassword"
                className="block text-[#19191b] font-medium mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              formAction={resetPasswordAction}
              className={`w-full bg-[#8d65e3] text-white py-3 brutal-shadow-all rounded-lg border-2 border-[#19191b] font-medium`}
            >
              Reset Password
            </button>
          </form>

          <FormMessage message={searchParams} />

          <div className="mt-8 text-center">
            <Link
              href="/auth/sign-up"
              className="text-[#8d65e3] hover:underline font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 