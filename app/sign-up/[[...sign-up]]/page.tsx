import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white dark:bg-gray-900">
      <main className="flex flex-col gap-6 p-6 md:p-10">
        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUp />
          </div>
        </section>
      </main>
      <aside className="relative hidden bg-muted lg:block">
        <Image
          src="/img.jpg"
          alt="Decorative background"
          className="absolute inset-0 h-full w-full object-cover "
          fill
          aria-hidden="true"
        />
      </aside>
    </div>
  );
}

// NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
// NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
// NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
// NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
