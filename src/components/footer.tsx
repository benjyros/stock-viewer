import LanguageSwitcher from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container flex items-center justify-between text-xs gap-8 py-16">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
        <div className="flex gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
