import Link from "next/link";
import { Mail, Send } from "lucide-react";

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

const serviceLinks: FooterLink[] = [
  { href: "/song", label: "Персональная песня" },
  { href: "/santa", label: "Видео от Деда Мороза" },
];

const legalLinks: FooterLink[] = [
  { href: "/legal/privacy", label: "Политика конфиденциальности" },
  { href: "/legal/terms", label: "Пользовательское соглашение" },
  { href: "mailto:support@youwow.ru", label: "Поддержка", external: true },
];

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Наши сервисы</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Документы</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contacts */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@youwow.ru"
                  className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  support@youwow.ru
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/youwow_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Telegram
                </a>
                <p className="text-stone-500 text-sm mt-1">
                  Круглосуточная поддержка 24/7
                </p>
              </li>
              <li className="pt-2">
                <p className="text-stone-500 text-sm">
                  Принимаем: Мир, СБП, Visa/MC
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-stone-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center">
              <span className="font-display font-bold text-white">YouWow</span>
            </Link>
            <p className="text-stone-500 text-sm text-center">
              &copy; 2026 YouWow. Создано специально для вас
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
