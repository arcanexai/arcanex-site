export default function Hello({ name = "Arcanex" }: { name?: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow">
      <p className="text-sm text-gray-600">React island says:</p>
      <h2 className="mt-1 text-2xl font-bold">Hello, {name}! 👋</h2>
      <button
        className="mt-3 rounded-lg bg-black px-3 py-2 text-white"
        onClick={() => alert("React is working!")}
      >
        Click me
      </button>
    </div>
  );
}