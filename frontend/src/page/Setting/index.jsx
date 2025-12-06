import useThemeStore from "../../store/useThemeStore";
import { Link } from "react-router-dom";

const Setting = () => {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  return (
    <div className="min-h-screen px-4 py-23">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Theme Settings</h1>
        <Link
          to="/profile"
          className="btn btn-primary btn-sm"
        >
          تغییر عکس پروفایل
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition
              ${theme === t ? "border-primary shadow-lg" : "border-base-300"}
            `}
          >
            {/* Theme preview */}
            <div
              className="relative h-8 w-full rounded-md overflow-hidden"
              data-theme={t}
            >
              <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                <div className="rounded bg-primary"></div>
                <div className="rounded bg-secondary"></div>
                <div className="rounded bg-accent"></div>
                <div className="rounded bg-neutral"></div>
              </div>
            </div>

            <span className="text-xs font-medium truncate w-full text-center uppercase">
              {t}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Setting;
