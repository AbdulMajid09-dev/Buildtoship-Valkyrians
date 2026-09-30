import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldAlert, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-agri-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AgriAdvisory AI</span>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              Transforming farmer-supplied crop observations, soil profiles, and local weather patterns into structured, evidence-aware, actionable agronomic advice. Built with enterprise safety protocols and certified AI governance.
            </p>
            <div className="flex items-center space-x-2 text-xs text-stone-500 pt-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Advisory guidance only. Not a replacement for local agricultural authorities.</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/app" className="hover:text-white transition-colors">Farmer Dashboard</Link>
              </li>
              <li>
                <Link to="/app/advisory/new" className="hover:text-white transition-colors">Request New Advisory</Link>
              </li>
              <li>
                <Link to="/app/advisories" className="hover:text-white transition-colors">Advisory History</Link>
              </li>
              <li>
                <Link to="/app/profile" className="hover:text-white transition-colors">Field Profile & Settings</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Safety */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4">
              Safety & Governance
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Farmer Data Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Agricultural Advisory</Link>
              </li>
              <li>
                <a href="#safety" className="hover:text-white transition-colors">AI Safety Guidelines</a>
              </li>
              <li>
                <a href="#domains" className="hover:text-white transition-colors">Supported Crop Domains</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} AgriAdvisory Systems. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered for sustainable agriculture & smallholder resilience
          </p>
        </div>
      </div>
    </footer>
  );
};
