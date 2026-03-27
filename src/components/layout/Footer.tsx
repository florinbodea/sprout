export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white px-8 py-6 text-center text-xs text-gray-400">
      <p>
        🌿 <span className="font-semibold text-gray-600">Sprout</span> — Shop
        smarter, eat better.
      </p>
      <p className="mt-1">
        Nutrition data from{" "}
        <a
          href="https://world.openfoodfacts.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          Open Food Facts
        </a>{" "}
        (CC BY-SA).
      </p>
    </footer>
  );
}
