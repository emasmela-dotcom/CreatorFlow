import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CreatorFlow365 AI — Your Built-In Creator Coach",
  description:
    "CreatorFlow365 AI helps creators write faster with an on-demand coach powered by Groq. See what it can do today and what is coming next.",
};

export default function AIPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-12">
        <p className="mb-4 text-sm font-medium tracking-wide text-blue-400 uppercase">
          CreatorFlow365 AI
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          A coach built into your workflow
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-300">
          This page lists the AI we offer right now. We will update it whenever
          we add stronger models or new features.
        </p>
      </section>

      {/* Current offering */}
      <section className="mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Available now</h2>
          </div>

          <h3 className="mt-6 text-2xl font-bold text-white">AI Coach</h3>
          <p className="mt-2 text-slate-300">
            Ask for captions, content ideas, quick edits, or advice while you
            work. The coach stays inside your dashboard so you do not need a
            separate app.
          </p>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-400">Powered by</dt>
              <dd className="mt-1 text-base font-medium text-white">Groq</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">
                Model in use
              </dt>
              <dd className="mt-1 text-base font-medium text-white">
                llama-3.1-8b-instant
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Good for
            </h4>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                <span>Quick captions and hook ideas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                <span>Short tips and feedback on a draft</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                <span>Fast coaching replies while you plan content</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 rounded-xl border border-amber-900/30 bg-amber-950/20 p-5">
            <h4 className="text-sm font-semibold text-amber-300">
              What to expect
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-amber-200/80">
              Capacity is shared across all CreatorFlow365 users. If the daily
              limit is reached, you will see a message asking you to try again
              later. We do not throttle individual accounts on purpose; the
              limit exists to keep the service stable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* How AI usage works */}
      <section className="mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10">
          <h2 className="text-xl font-semibold text-white">
            How AI usage works
          </h2>
          <p className="mt-4 leading-relaxed text-slate-300">
            AI is a monthly usage pool — not &ldquo;1 click = 1 credit.&rdquo;
          </p>
          <p className="mt-4 leading-relaxed text-slate-300">
            Each time you use Groq (AI Coach and any other Groq tools), some of
            your pool is used. Longer or heavier asks use more. Short asks use
            less.
          </p>
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <p className="text-sm leading-relaxed text-slate-300">
              Example: a plan with 1,000 Groq usage does{" "}
              <span className="font-semibold text-white">not</span> mean 1,000
              separate answers. One long ask can use more of the pool than one
              short ask.
            </p>
          </div>
          <p className="mt-6 leading-relaxed text-slate-300">
            When your pool is empty, ask support — more may be granted while we
            build.
          </p>
          <p className="mt-4 leading-relaxed text-slate-300">
            I don&apos;t pay for Groq, so I don&apos;t charge you for Groq.
          </p>
          <div className="mt-6 rounded-xl border border-blue-900/40 bg-blue-950/30 p-5">
            <p className="text-sm leading-relaxed text-slate-100">
              Free AI today is powered by Groq. Create an account to use it.
              When we place more advanced AI later, those advanced models will
              be for paid plans — Groq free access may change at that time.
            </p>
          </div>
        </div>
      </section>

      {/* Coming later */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-xl font-semibold text-white">Coming later</h2>
        <p className="mt-3 leading-relaxed text-slate-300">
          More advanced AI is planned for paid plans. When we place it, this
          page will be updated with the details.
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="text-2xl font-bold text-white">
            Try the AI Coach in your dashboard
          </h2>
          <p className="mt-3 text-slate-300">
            Open the dashboard and start a conversation. If you are not signed in
            yet, you will be asked to sign in first.
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <footer className="border-t border-slate-800/60 bg-slate-950 py-8">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm text-slate-500">
            Last updated August 2026. Model and capacity details may change.
          </p>
        </div>
      </footer>
    </main>
  );
}
