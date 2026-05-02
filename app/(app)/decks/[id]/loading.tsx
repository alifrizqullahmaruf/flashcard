export default function DeckDetailLoading() {
  return (
    <div className="px-6 py-8 max-w-2xl w-full">
      <div className="skeleton h-4 w-24 rounded mb-3" />
      <div className="skeleton h-9 w-64 rounded-lg mb-2" />
      <div className="skeleton h-4 w-32 rounded mb-6" />
      <div className="border border-cream-dark rounded-xl overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-2 gap-4 px-5 py-4 border-b border-cream-dark last:border-b-0"
          >
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
