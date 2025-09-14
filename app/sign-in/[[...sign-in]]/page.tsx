import { SignIn } from "@clerk/nextjs";

import Image from "next/image";

export default function Page() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white dark:bg-gray-900">
      <main className="flex flex-col gap-6 p-6 md:p-10">
        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignIn />
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
