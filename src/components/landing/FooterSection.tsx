import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Mail, MessageCircle } from 'lucide-react';
import logoWhite from '@/assets/logo-white.png';

const footerLinks = {
  worlds: [
    { label: 'The Playground (Kids)', href: '/student-signup' },
    { label: 'The Academy (Teens)', href: '/student-signup' },
    { label: 'Professional Hub', href: '/signup' },
  ],
  learn: [
    { label: 'Methodology', href: '/methodology' },
    { label: 'Curriculum', href: '/curriculum' },
    { label: 'Teachers', href: '/teachers' },
    { label: 'Pricing', href: '/pricing' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/teach-with-us' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: 'mailto:hello@engleuphoria.com' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export function FooterSection() {
  return (
    <footer className="relative bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img src={logoWhite} alt="EnglEuphoria" className="w-10 h-10 object-contain" />
              <h3 className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                EnglEuphoria
              </h3>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Three specialized English schools under one roof. From playful kids' adventures to professional business mastery.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* The Worlds */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">The Worlds</h4>
            <ul className="space-y-3">
              {footerLinks.worlds.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Learn</h4>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} EnglEuphoria. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
              Teacher Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
