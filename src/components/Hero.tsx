import { Search, Camera, MapPin, Waves } from "lucide-react";
import React from "react";

type Props = {
  onExplore: () => void;
  onSearch: (filters: { location?: string; spot?: string }) => void;
  onAbout?: () => void;
};

export default function Hero({ onExplore, onSearch, onAbout }: Props) {
  const [location, setLocation] = React.useState("");
  const [spot, setSpot] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ location: location.trim(), spot: spot.trim() });
  }

  return (
    <section className="relative overflow-hidden">
      {/* backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white" />
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-12">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/60 px-3 py-1 text-xs text-blue-700 shadow-sm backdrop-blur">
              <Waves className="h-4 w-4" /> surf photography platform
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Discover & share the world’s best surf shots
            </h1>
            <p className="mt-3 max-w-xl text-slate-600">
              Browse iconic spots, map sessions, and upload your favorite waves.
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg hover:bg-blue-700 active:scale-[0.99]"
              >
                <Search className="h-4 w-4" />
                Explore spots
              </button>
              <button
                onClick={onAbout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                <Camera className="h-4 w-4" />
                About Surfspotter
              </button>
            </div>
          </div>

          {/* Search Card */}
          <form
            onSubmit={submit}
            className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-xl backdrop-blur"
          >
            <h3 className="mb-3 text-lg font-semibold text-slate-900">
              Quick search
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-slate-600">Location</span>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-10 w-full bg-transparent outline-none"
                    placeholder="Hossegor, Bali, …"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs text-slate-600">Spot</span>
                <input
                  value={spot}
                  onChange={(e) => setSpot(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 bg-transparent outline-none"
                  placeholder="The Wedge, Uluwatu, …"
                />
              </label>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
              >
                <Search className="h-4 w-4" /> Search
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Tip: leave one field empty to search broadly.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
