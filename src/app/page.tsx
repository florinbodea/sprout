import Link from "next/link";

const FEATURES = [
  {
    icon: "🔬",
    title: "Real nutrition data",
    body: "Powered by Open Food Facts — the world's largest open food database with 3M+ products.",
  },
  {
    icon: "🎯",
    title: "Personalised scores",
    body: "Set your goals, allergens and diet preferences. Every score is weighted to you.",
  },
  {
    icon: "📊",
    title: "Full transparency",
    body: "See exactly why a product scored the way it did — Nutri-Score, NOVA, and more.",
  },
  {
    icon: "🛒",
    title: "Smart shopping list",
    body: "Build your basket and instantly see its health profile before you buy.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center bg-gradient-to-b from-emerald-50 to-white">
        <span className="text-6xl" aria-hidden>🌿</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight max-w-xl">
          Shop smarter,<br />
          <span className="text-emerald-600">eat better.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-md">
          Sprout scores every grocery product for your personal health goals —
          instantly, transparently, and for free.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/search"
            className="rounded-2xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition"
          >
            Search products →
          </Link>
          <Link
            href="/profile"
            className="rounded-2xl border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Set up my profile
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-10">
            Everything you need to make healthier choices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5"
              >
                <span className="text-3xl flex-shrink-0" aria-hidden>{icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-emerald-500 px-6 py-14 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to start shopping smarter?</h2>
        <p className="text-emerald-100 mb-6 text-sm">
          No account needed. Your profile is saved privately on your device.
        </p>
        <Link
          href="/search"
          className="inline-block rounded-2xl bg-white px-8 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition shadow"
        >
          Try it now — it&apos;s free
        </Link>
      </section>
    </div>
  );
}
