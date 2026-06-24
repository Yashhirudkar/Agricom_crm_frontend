// Premium skeleton loader — shown only on first load (tree is empty).
// Subsequent refreshes keep stale tree visible (no blank flash).

function SkeletonRow({ wide = false }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <div className="h-4 w-4 rounded bg-gray-200 animate-pulse flex-shrink-0" />
      <div
        className={`h-3 rounded bg-gray-200 animate-pulse ${
          wide ? "w-32" : "w-24"
        }`}
      />
    </div>
  );
}

function SkeletonSection({ itemCount = 3, wide = false }) {
  return (
    <div className="space-y-1">
      {/* Section label */}
      <div className="px-3 mb-2">
        <div className="h-2.5 w-20 rounded bg-gray-200 animate-pulse" />
      </div>
      {/* Items */}
      {Array.from({ length: itemCount }).map((_, i) => (
        <SkeletonRow key={i} wide={wide} />
      ))}
    </div>
  );
}

export default function SidebarBuilderSkeleton() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-52 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-3 w-64 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-8 w-28 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
          <div className="h-8 w-24 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Tree card skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-5">
        {/* Folder 1 — 4 items */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          {/* Folder header */}
          <div className="flex items-center justify-between p-3 bg-gray-100/50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-28 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-8 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-4 w-8 rounded-md bg-gray-100 animate-pulse" />
              <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
          {/* Items */}
          <div className="p-2 space-y-2">
            {[36, 28, 32, 24].map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                  <div className={`h-3 w-${w} rounded bg-gray-200 animate-pulse`} />
                  <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
                  <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Folder 2 — 3 items */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-gray-100/50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-36 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-8 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-4 w-8 rounded-md bg-gray-100 animate-pulse" />
              <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
          <div className="p-2 space-y-2">
            {[32, 24, 28].map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                  <div className={`h-3 w-${w} rounded bg-gray-200 animate-pulse`} />
                  <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
                  <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Folder 3 — 2 items */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-gray-100/50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-8 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-4 w-8 rounded-md bg-gray-100 animate-pulse" />
              <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
          <div className="p-2 space-y-2">
            {[28, 20].map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                  <div className={`h-3 w-${w} rounded bg-gray-200 animate-pulse`} />
                  <div className="h-3 w-14 rounded bg-gray-100 animate-pulse" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
                  <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
