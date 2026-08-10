"use client";

import { useState } from "react";

export default function DesignerPage() {
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [floors, setFloors] = useState(1);
  const [size, setSize] = useState(120);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold">
            You<span className="text-green-600">Build</span>
          </a>

          <span className="text-sm text-gray-500">Home Designer</span>
        </div>
      </header>

      {/* Page heading */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
          Home Designer
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Start designing your home
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Tell YouBuild what you want to build. We'll use these requirements
          later to create your floor plan and estimate the construction cost.
        </p>

        {/* Designer controls */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-semibold">Your requirements</h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {/* Bedrooms */}
              <div>
                <label className="text-sm font-medium">Bedrooms</label>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                    className="h-10 w-10 rounded-lg border text-lg hover:bg-gray-50"
                  >
                    −
                  </button>

                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-gray-100 font-semibold">
                    {bedrooms}
                  </div>

                  <button
                    onClick={() => setBedrooms(bedrooms + 1)}
                    className="h-10 w-10 rounded-lg border text-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="text-sm font-medium">Bathrooms</label>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                    className="h-10 w-10 rounded-lg border text-lg hover:bg-gray-50"
                  >
                    −
                  </button>

                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-gray-100 font-semibold">
                    {bathrooms}
                  </div>

                  <button
                    onClick={() => setBathrooms(bathrooms + 1)}
                    className="h-10 w-10 rounded-lg border text-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Floors */}
              <div>
                <label className="text-sm font-medium">Floors</label>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => setFloors(Math.max(1, floors - 1))}
                    className="h-10 w-10 rounded-lg border text-lg hover:bg-gray-50"
                  >
                    −
                  </button>

                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-gray-100 font-semibold">
                    {floors}
                  </div>

                  <button
                    onClick={() => setFloors(floors + 1)}
                    className="h-10 w-10 rounded-lg border text-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-sm font-medium">
                  Approximate size (m²)
                </label>

                <input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="mt-2 w-full rounded-lg border px-4 py-2 outline-none focus:border-green-600"
                />
              </div>
            </div>

            <button className="mt-8 w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
              Continue designing
            </button>
          </div>

          {/* Summary */}
          <div className="rounded-2xl bg-gray-900 p-6 text-white">
            <p className="text-sm text-gray-400">Your project</p>

            <h2 className="mt-2 text-2xl font-bold">Home concept</h2>

            <div className="mt-8 space-y-5">
              <Summary label="Bedrooms" value={bedrooms} />
              <Summary label="Bathrooms" value={bathrooms} />
              <Summary label="Floors" value={floors} />
              <Summary label="Estimated size" value={`${size} m²`} />
            </div>

            <div className="mt-8 border-t border-gray-700 pt-6">
              <p className="text-sm text-gray-400">
                Next step
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                We'll turn these requirements into a floor-plan concept and
                eventually connect it to the YouBuild construction cost
                calculator.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}