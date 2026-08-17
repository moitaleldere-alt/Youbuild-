import ProjectManager from "./components/projectManager";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold tracking-tight">
            You<span className="text-green-600">Build</span>
          </div>

          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
            Sign in
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-green-600">
              Build smarter
            </p>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Design your home.
              <br />
              Know the cost.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              YouBuild brings home design, construction costs, contractors,
              land and property services together in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
                Start building
              </button>

              <button className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold hover:bg-gray-50">
                Explore properties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            Everything you need to build
          </h2>

          <p className="mt-2 text-gray-600">
            One platform for the entire property journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="Home Designer"
            description="Plan your home and turn your ideas into a buildable project."
          />

          <Feature
            title="Cost Calculator"
            description="Estimate materials and construction costs before you start."
          />

          <Feature
            title="Find Contractors"
            description="Discover contractors and construction professionals near you."
          />

          <Feature
            title="Buy Land"
            description="Find land available for sale and compare opportunities."
          />

          <Feature
            title="Rent & Lease"
            description="Find houses, apartments and other properties to rent or lease."
          />

          <Feature
            title="Property Marketplace"
            description="Explore properties and connect with buyers, sellers and landlords."
          />
        </div>
      </section>

      {/* Milestone 7 — Project Management */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <ProjectManager />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">
            Your building journey starts here.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-green-50">
            From finding land to planning your home and connecting with the
            right professionals, YouBuild is designed to bring it together.
          </p>

          <button className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-green-700 hover:bg-gray-100">
            Get started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500">
          © 2026 YouBuild. Build smarter.
        </div>
      </footer>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>

      <button className="mt-6 text-sm font-semibold text-green-600 hover:text-green-700">
        Explore →
      </button>
    </div>
  );
}