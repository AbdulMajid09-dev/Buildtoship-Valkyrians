import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import {
  Sprout,
  ShieldCheck,
  Droplets,
  Layers,
  Bug,
  CloudSun,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Search,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const ctaLink = isAuthenticated ? '/app/advisory/new' : '/register';

  const supportedDomains = [
    {
      title: 'Pest & Insect Management',
      icon: <Bug className="w-6 h-6 text-amber-600" />,
      desc: 'Identification considerations, threshold scouting, and integrated pest management (IPM) protocols.',
    },
    {
      title: 'Foliar & Soil Disease',
      icon: <Activity className="w-6 h-6 text-rose-600" />,
      desc: 'Symptom matching for fungal, bacterial, and viral threats without fabricated chemical prescriptions.',
    },
    {
      title: 'Soil & Nutrient Health',
      icon: <Layers className="w-6 h-6 text-earth-600" />,
      desc: 'Nutrient deficiency diagnosis, pH correlation, and organic compost strategies for long-term vitality.',
    },
    {
      title: 'Irrigation & Moisture Optimization',
      icon: <Droplets className="w-6 h-6 text-blue-600" />,
      desc: 'Watering schedules tailored to soil texture, root zone depth, and recent local precipitation.',
    },
    {
      title: 'Weather & Heat Stress',
      icon: <CloudSun className="w-6 h-6 text-orange-600" />,
      desc: 'Management actions for drought spells, flash waterlogging, heat waves, and unseasonal humidity spikes.',
    },
    {
      title: 'Sustainable Agronomy',
      icon: <Sprout className="w-6 h-6 text-agri-600" />,
      desc: 'Crop rotation, cover cropping, and residue management to boost smallholder resilience and soil biology.',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-28">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-agri-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-agri-50 border border-agri-200 text-agri-800 text-xs font-semibold shadow-2xs">
            <Sprout className="w-4 h-4 text-agri-600" />
            <span>AI-Powered Agricultural Intelligence for Modern Farming</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
            Describe your crop problem. <br />
            <span className="text-agri-700">Get structured, practical AI guidance.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Empowering farmers and agronomists with evidence-aware crop advice tailored to your soil profile, growth stage, irrigation method, and local weather conditions.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={ctaLink}>
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-3.5 shadow-md" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Get Crop Advisory
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                How It Works
              </Button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-agri-600" />
              Evidence-Aware Guardrails
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-agri-600" />
              Conservative Chemical Rules
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-agri-600" />
              Extension Officer Escalation
            </span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-widest text-agri-700">
            Field Workflow
          </h2>
          <h3 className="text-3xl font-bold text-stone-900">
            How AgriAdvisory Guides Your Field Decisions
          </h3>
          <p className="text-stone-600 text-sm">
            Three simple steps to transform raw field observations into prioritized, actionable recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center font-bold text-lg mb-6">
              1
            </div>
            <h4 className="text-lg font-bold text-stone-900 mb-2">Input Field Telemetry</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Specify your crop, growth stage, soil type, moisture level, irrigation method, and describe symptoms in your own words.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg mb-6">
              2
            </div>
            <h4 className="text-lg font-bold text-stone-900 mb-2">Server-Side AI Synthesis</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Google Gemini AI analyzes your field data on secure backend infrastructure, strictly validating responses against agronomic Zod schemas.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-6">
              3
            </div>
            <h4 className="text-lg font-bold text-stone-900 mb-2">Actionable Field Protocol</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Receive prioritized immediate steps, irrigation/soil tips, preventive checklists, and clear criteria for consulting local authorities.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORTED DOMAINS */}
      <section id="domains" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-widest text-agri-700">
            Agronomic Scope
          </h2>
          <h3 className="text-3xl font-bold text-stone-900">
            Supported Agriculture Domains
          </h3>
          <p className="text-stone-600 text-sm">
            Comprehensive coverage across the agricultural lifecycle, from seedling emergence through post-harvest storage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportedDomains.map((domain, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 p-6 hover:border-agri-300 hover:shadow-xs transition-all space-y-3"
            >
              <div className="p-2.5 rounded-xl bg-stone-50 inline-block border border-stone-100">
                {domain.icon}
              </div>
              <h4 className="text-base font-bold text-stone-900">{domain.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{domain.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI SAFETY & DISCLAIMER */}
      <section id="safety" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-stone-900 rounded-3xl p-8 md:p-12 text-white border border-stone-800 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Responsible Agricultural AI Guidelines</h3>
              <p className="text-xs text-stone-400">Strict safety boundaries engineered into every recommendation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs text-stone-300 leading-relaxed">
            <div className="space-y-2 bg-stone-800/60 p-4 rounded-xl border border-stone-700/50">
              <h5 className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                Never Fabricates Measurements
              </h5>
              <p>
                If soil pH, ambient temperature, or moisture are not provided by you, the AI engine explicitly acknowledges their absence rather than inventing simulated figures.
              </p>
            </div>

            <div className="space-y-2 bg-stone-800/60 p-4 rounded-xl border border-stone-700/50">
              <h5 className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                No Speculative Chemical Prescriptions
              </h5>
              <p>
                We do not recommend unverified chemical dosages or dangerous tank mixtures. All chemical guidance references manufacturer product labels and local safety approvals.
              </p>
            </div>

            <div className="space-y-2 bg-stone-800/60 p-4 rounded-xl border border-stone-700/50">
              <h5 className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                Differential Hypotheses Over False Certainty
              </h5>
              <p>
                Crop symptoms often mimic multiple pathogens or abiotic stresses. The engine provides likelihood-graded causes rather than claiming definitive diagnosis.
              </p>
            </div>

            <div className="space-y-2 bg-stone-800/60 p-4 rounded-xl border border-stone-700/50">
              <h5 className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                Local Authority Escalation
              </h5>
              <p>
                For severe outbreaks or rapid field decline, advisories clearly direct you to physical inspection by certified extension officers or plant pathology labs.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400 text-center">
            Disclaimer: AgriAdvisory AI provides educational and advisory decision-support. Users must follow local agricultural regulations and manufacturer labels.
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
          Ready to diagnose and protect your crops?
        </h2>
        <p className="text-stone-600 text-sm md:text-base max-w-xl mx-auto">
          Start your first advisory now. Takes less than two minutes to provide your field observations and receive structured guidance.
        </p>
        <div>
          <Link to={ctaLink}>
            <Button size="lg" className="px-8 py-3.5 shadow-md" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get Crop Advisory Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
