export default function DecksLoading() {
  return (
    <div className="px-6 py-8 max-w-2xl w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-8 w-24 rounded-lg" />
        <div className="skeleton h-10 w-28 rounded-lg" />
      </div>
      <div className="border border-cream-dark rounded-xl overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center px-5 py-4 border-b border-cream-dark last:border-b-0 gap-4"
          >
            <div className="flex-1 flex flex-col gap-2">
              <div className="skeleton h-5 w-48 rounded" />
              <div className="skeleton h-4 w-16 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-9 w-20 rounded-lg" />
              <div className="skeleton h-9 w-14 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
