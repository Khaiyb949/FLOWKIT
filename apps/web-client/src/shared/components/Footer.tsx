import { BRAND, FOOTER_LINKS, SOCIAL_LINKS } from '../constants/theme';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-2">{BRAND.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {BRAND.tagline}
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase">Product</h4>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase">Resources</h4>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase">Legal</h4>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <p>&copy; 2026 {BRAND.name}. All rights reserved.</p>
            <div className="flex gap-4">
              <a href={SOCIAL_LINKS.github} className="hover:text-slate-900 dark:hover:text-white transition">
                GitHub
              </a>
              <a href={SOCIAL_LINKS.discord} className="hover:text-slate-900 dark:hover:text-white transition">
                Discord
              </a>
              <a href={SOCIAL_LINKS.twitter} className="hover:text-slate-900 dark:hover:text-white transition">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
