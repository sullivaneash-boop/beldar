import Link from "next/link";
import { ConeMark } from "@/components/beldar/cone-mark";

export default function NotFound() {
  return (
    <div className="grid min-h-[50vh] place-items-center text-center">
      <div>
        <ConeMark className="mx-auto h-16 w-12 text-ink" />
        <h1 className="mt-4 font-display text-5xl font-extrabold uppercase">Page not found</h1>
        <p className="mt-2 text-ink-2">That page isn&apos;t in the Remulak database.</p>
        <Link href="/" className="mt-4 inline-flex min-h-11 items-center rounded-md bg-ink px-4 font-semibold text-paper">
          Back to Mission Control
        </Link>
      </div>
    </div>
  );
}
