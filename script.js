import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Captions, Check, Clapperboard, Clock, Copy, Film, Instagram, Mail, Moon, Music2, Play, Rocket, Scissors, Search, Send, Sparkles, Sun, Twitter, Upload, Wand2, Youtube, Zap } from 'lucide-react';
import './index.css';  

const EMAIL = 'ayushsahoo555@gmail.com';

/* ---------------- DATA ---------------- */

type Category = 'gaming' | 'vlogs' | 'finance' | 'podcasts' | 'fitness' | 'education';
type Format = 'short' | 'long';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'gaming', label: 'Gaming' },
  { id: 'vlogs', label: 'Vlogs' },
  { id: 'finance', label: 'Finance' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'education', label: 'Education' },
];

interface Creator {
  name: string;
  niche: string;
  initials: string;
  hue: string;
  followers: string;
  youtube: string;
  instagram: string;
  twitter: string;
}

const CREATORS: Creator[] = [
  { name: 'Aarav PixelForge', niche: 'Gaming', initials: 'AP', hue: 'from-violet-500 to-indigo-600', followers: '2.4M', youtube: '@AaravPixelForge', instagram: '@aarav.pixelforge', twitter: '@AaravPixelForge' },
  { name: 'Sana Travels', niche: 'Travel vlogs', initials: 'ST', hue: 'from-orange-400 to-rose-500', followers: '1.1M', youtube: '@SanaTravels', instagram: '@sana.travels', twitter: '@SanaTravels' },
  { name: 'Rohan Compounding', niche: 'Finance', initials: 'RC', hue: 'from-emerald-400 to-teal-600', followers: '860K', youtube: '@RohanCompounding', instagram: '@rohan.compounding', twitter: '@RohanComp' },
  { name: 'Meera Long Take', niche: 'Podcasts', initials: 'ML', hue: 'from-fuchsia-500 to-purple-600', followers: '640K', youtube: '@MeeraLongTake', instagram: '@meera.longtake', twitter: '@MeeraLongTake' },
  { name: 'Kabir Form & Function', niche: 'Fitness', initials: 'KF', hue: 'from-sky-400 to-blue-600', followers: '980K', youtube: '@KabirFormFunction', instagram: '@kabir.formfunction', twitter: '@KabirFormFunc' },
  { name: 'Lena Learn in Public', niche: 'Education', initials: 'LL', hue: 'from-amber-400 to-orange-500', followers: '1.7M', youtube: '@LenaLearnInPublic', instagram: '@lena.learnsinpublic', twitter: '@LenaLearns' },
];

interface Video {
  id: string;
  title: string;
  creator: string;
  category: Category;
  format: Format;
  gradient: string;
  duration: string;
  views: string;
  retention: string;
  hook: string;
}

const VIDEOS: Video[] = [
  { id: 'v1', title: 'The clutch that broke the lobby — 40 seconds of chaos', creator: 'Aarav PixelForge', category: 'gaming', format: 'short', gradient: 'linear-gradient(135deg,#6366F1 0%,#8B5CF6 55%,#EC4899 130%)', duration: '0:42', views: '4.2M', retention: '92% avg. view', hook: 'Cold-open kill feed, captions punched in on the beat.' },
  { id: 'v2', title: '48 hours in Kyoto with zero plans', creator: 'Sana Travels', category: 'vlogs', format: 'short', gradient: 'linear-gradient(135deg,#FB923C 0%,#F43F5E 60%,#7C3AED 135%)', duration: '0:58', views: '2.8M', retention: '88% avg. view', hook: 'Match-cut train doors into alleyways — no dead air.' },
  { id: 'v3', title: 'Index funds, explained over a cutting chai', creator: 'Rohan Compounding', category: 'finance', format: 'long', gradient: 'linear-gradient(120deg,#059669 0%,#0D9488 55%,#164E63 130%)', duration: '14:22', views: '1.3M', retention: '71% at minute 10', hook: 'Chaptered story arc with a payoff every 90 seconds.' },
  { id: 'v4', title: 'The Long Take: deep work, honest burnout', creator: 'Meera Long Take', category: 'podcasts', format: 'long', gradient: 'linear-gradient(120deg,#D946EF 0%,#7C3AED 55%,#1E1B4B 135%)', duration: '48:10', views: '920K', retention: '64% completion', hook: 'Three-cam cuts on laughter, silence left in on purpose.' },
  { id: 'v5', title: 'Fix your squat in one form check', creator: 'Kabir Form & Function', category: 'fitness', format: 'short', gradient: 'linear-gradient(135deg,#38BDF8 0%,#2563EB 60%,#312E81 135%)', duration: '0:37', views: '3.6M', retention: '94% avg. view', hook: 'Freeze-frame arrows land before the mistake happens.' },
  { id: 'v6', title: 'Statistics, but we are just cooking dinner', creator: 'Lena Learn in Public', category: 'education', format: 'long', gradient: 'linear-gradient(120deg,#F59E0B 0%,#EA580C 55%,#7C2D12 130%)', duration: '18:45', views: '1.9M', retention: '76% at minute 12', hook: 'Every concept gets a kitchen analogy and a recap card.' },
];

const SERVICES = [
  {
    icon: Zap,
    title: 'Short-form retention editing',
    blurb: 'Shorts, Reels and TikToks cut for the rewatch — hook in the first second, captions that carry the joke, zero dead frames.',
    points: ['9:16 native framing', 'Kinetic captions & SFX', 'Loop-friendly endings'],
    meta: '24–48h turnaround',
  },
  {
    icon: Film,
    title: 'Long-form story editing',
    blurb: 'YouTube videos and podcasts structured like stories — arcs, payoffs and pattern interrupts that hold attention to the end card.',
    points: ['16:9 story structure', 'Multi-cam podcast cuts', 'Chapter & recap cards'],
    meta: '3–5 day turnaround',
  },
  {
    icon: Wand2,
    title: 'Packaging & channel polish',
    blurb: 'Titles, thumbnails and intros that make the click feel inevitable — plus a retention audit on your last ten uploads.',
    points: ['Thumbnail concepts', 'Title A/B options', 'Retention audit report'],
    meta: 'Per-video or monthly',
  },
];

const PROCESS = [
  {
    icon: Upload,
    step: '01',
    title: 'Send the raw footage',
    blurb: 'Drop your files and a two-line brief. You get a cut plan back the same day — hooks, structure and runtime, before a single frame is cut.',
  },
  {
    icon: Scissors,
    step: '02',
    title: 'Edit & retention pass',
    blurb: 'First cut in your dashboard with burnt-in captions and a retention map. Every pause, zoom and cut is there to earn the next ten seconds.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Review, tweak, ship',
    blurb: 'One revision round included, timestamped comments welcome. Final export in platform-ready formats, ready to upload today.',
  },
];

/* ---------------- CURSOR GLOW ---------------- */

function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tx = -500;
    let ty = -500;
    let x = -500;
    let y = -500;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${tx - 4}px, ${ty - 4}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] hidden lg:block ez-bg">
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 400,
          height: 400,
          background:
            'radial-gradient(200px circle at center, var(--glow-a), var(--glow-b) 40%, transparent 70%)',
          filter: 'blur(24px)',
          borderRadius: '50%',
          transition: 'transform 0.12s linear',
          willChange: 'transform',
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 8,
          height: 8,
          background: 'var(--ink)',
          borderRadius: '50%',
          opacity: 0.12,
          willChange: 'transform',
        }}
      />
    </div>
  );
}

/* ---------------- SCROLL REVEAL HOOK ---------------- */

function useReveal(deps: unknown[]) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps);
}

/* ---------------- APP ---------------- */

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".ez-bg > *").forEach((el: any, i) => {
      gsap.to(el, {
        y: (i % 2 === 0 ? 200 : -200),
        rotationZ: i % 2 === 0 ? 20 : -20,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });
    });
  }, []);

  const [category, setCategory] = useState<Category>('gaming');
  const [format, setFormat] = useState<Format>('short');
  const [query, setQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = VIDEOS.filter(
    (v) =>
      v.category === category &&
      v.format === format &&
      (v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.creator.toLowerCase().includes(query.toLowerCase()))
  );

  useReveal([category, format, query, filtered.length]);

  const copyEmail = () => {
    const ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      setToast(`Email copied — ${EMAIL}`);
    } catch {
      setToast(EMAIL);
    }
    document.body.removeChild(ta);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full overflow-x-clip text-[var(--text)]"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <CursorGlow />

      {/* ---------- HEADER (Booking Button Removed) ---------- */}
      <header
        data-safe-area-sticky-top
        className="sticky z-40 border-b border-[var(--border)] backdrop-blur-md"
        style={{ top: 'var(--safe-area-inset-top)', background: 'var(--header-bg)' }}
      >
        <div className="mx-auto flex h-16 w-full max-w- items-center gap-3 px-4 sm:px-6">
          <a href="#top" className="pop flex items-center gap-2 rounded-full pr-1" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}>
            <span className="grid h-9 w-9 place-items-center rounded- bg-[var(--ink)] text-[var(--bg)]">
              <Clapperboard className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Editing Zone<span className="text-[var(--violet)]">.</span>
            </span>
          </a>

          <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Primary">
            {[
              ['Work', 'work'],
              ['Services', 'services'],
              ['Process', 'process'],
              ['Contact', 'contact'],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="pop rounded-full px-3.5 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={copyEmail}
              className="pop hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium shadow-[var(--shadow-soft)] lg:flex"
              aria-label={`Copy email ${EMAIL}`}
            >
              <Mail className="h-4 w-4 text-[var(--violet)]" />
              <span className="max-w- truncate">{EMAIL}</span>
              <Copy className="h-3.5 w-3.5 text-[var(--faint)]" />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="pop grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="relative">
        {/* ---------- HERO (Booking Button Removed) ---------- */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid w-full max-w- gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
            <div>
              <div className="reveal inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] shadow-[var(--shadow-soft)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--violet)]" />
                Video editing studio for creators
              </div>

              <h1 className="reveal reveal-delay-1 font-display mt-6 text- font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-">
                Edits that <span className="text-[var(--violet)]">retain.</span>
                <br />
                Stories that <span className="relative inline-block">convert.
                  <span className="absolute -bottom-1 left-0 h- w-full rounded-full bg-[#D6FF57] opacity-80" aria-hidden="true" />
                </span>
              </h1>

              <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
                Editing Zone turns raw footage into videos people finish. Retention-first cuts,
                kinetic captions and packaging that earns the click — for Shorts and long-form alike.
              </p>

              <div className="reveal reveal-delay-3 mt-9 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {CREATORS.slice(0, 5).map((c) => (
                    <span
                      key={c.name}
                      className={`grid h-10 w-10 place-items-center rounded-full border-2 border-[var(--bg)] bg-gradient-to-br ${c.hue} text- font-bold text-white`}
                      title={c.name}
                    >
                      {c.initials}
                    </span>
                  ))}
                </div>
                <p className="text-sm leading-snug text-[var(--muted)]">
                  Trusted by <strong className="text-[var(--ink)]">40+ creators</strong>
                  <br className="sm:hidden" /> cutting for 8M+ subscribers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- WORK, SERVICES, PROCESS SECTIONS ---------- */}
        {/* ... */}

        {/* ---------- NEON CTA (Apply for Editing Button Removed) ---------- */}
        <section id="contact" className="mx-auto w-full max-w- px-4 pb-20 sm:px-6">
          <div className="grid gap-6 rounded- bg-[#D6FF57] p-6 text-[#111113] shadow-[var(--shadow-lift)] sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="reveal">
              <p className="inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> Slots open this week
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                Ship your content today.
              </h2>
              <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-black/70">
                Send one raw video and get a retention-first first cut back in 48 hours.
                No calls required — everything happens over email.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={copyEmail}
                  className="pop inline-flex items-center gap-2 rounded-full border border-black/25 bg-white/40 px-6 py-3.5 text-base font-semibold transition hover:-translate-y-0.5"
                >
                  <Copy className="h-5 w-5" /> Copy email
                </button>
              </div>
            </div>
            <div className="reveal reveal-delay-2 pop rounded- bg-white p-6 text-[#111113] shadow-md">
              <h3 className="font-display text-xl font-bold">How it works</h3>
              <ol className="mt-4 space-y-4">
                {[
                  ['Email your footage link', 'Drive, Dropbox or Frame.io — plus a two-line brief.'],
                  ['Get a cut plan same day', 'Hooks, structure and runtime before we cut a frame.'],
                  ['First cut in 48 hours', 'Captioned, retention-mapped, one revision round included.'],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-3">
                    <span className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#111113] text-sm font-bold text-white">{i + 1}</span>
                    <span>
                      <span className="block font-semibold">{t}</span>
                      <span className="block text-sm text-black/60">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-[var(--border)]">
        {/* ... */}
      </footer>
    </div>
  );
}
