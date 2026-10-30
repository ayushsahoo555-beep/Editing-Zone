import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Captions, Check, Clapperboard, Clock, Copy, Film, Instagram, Mail, Moon, Music2, Play, Rocket, Scissors, Search, Send, Sparkles, Sun, Twitter, Upload, Wand2, Youtube, Zap } from 'lucide-react';
import './index.css';  
  Captions,
  Check,
  Clapperboard,
  Clock,
  Copy,
  Film,
  Instagram,
  Mail,
  Moon,
  Music2,
  Play,
  Rocket,
  Scissors,
  Search,
  Send,
  Sparkles,
  Sun,
  Twitter,
  Upload,
  Wand2,
  Youtube,
  Zap,
} from 'lucide-react';
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

  useEffect(() => {
  const elements = document.querySelectorAll('.floating-element');
  elements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      const { innerWidth: width, innerHeight: height } = window;
      const xPos = (x / width) - 0.5;
      const yPos = (y / height) - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${xPos * 10}deg) rotateX(${yPos * -10}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s ease';
      el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      setTimeout(() => el.style.transition = 'none', 500);
    });
  });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  gsap.utils.toArray(".ez-bg > *").forEach((el, i) => {
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

      {/* ---------- HEADER ---------- */}
      <header
        data-safe-area-sticky-top
        className="sticky z-40 border-b border-[var(--border)] backdrop-blur-md"
        style={{ top: 'var(--safe-area-inset-top)', background: 'var(--header-bg)' }}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-3 px-4 sm:px-6">
          <a href="#top" className="pop flex items-center gap-2 rounded-full pr-1" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}>
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--ink)] text-[var(--bg)]">
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
              <span className="max-w-[190px] truncate">{EMAIL}</span>
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
        {/* ---------- HERO ---------- */}
        <section className="relative overflow-hidden">
          {/* video-editing background layer */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            {/* dotted keyframe grid */}
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)',
                backgroundSize: '26px 26px',
                maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)',
              }}
            />
            {/* timeline ruler with keyframes */}
            <div className="absolute left-[5%] right-[10%] top-[16%] hidden h-px bg-[var(--border)] opacity-30 lg:block">
              <div className="absolute inset-0 flex justify-around">
                <span className=" -mt-1 h-2 w-2 rotate-45 bg-[var(--violet)] opacity-50" />
                <span className=" -mt-1 h-2 w-2 rotate-45 bg-[var(--violet)] opacity-50" style={{ marginLeft: '30%' }} />
                <span className=" -mt-1 h-2 w-2 rotate-45 bg-[#D6FF57] opacity-70" style={{ marginLeft: '60%' }} />
              </div>
            </div>
            <div className="absolute bottom-[14%] left-[8%] right-[16%] hidden h-px bg-[var(--border)] opacity-20 lg:block">
              <div className="absolute inset-0 flex justify-around">
                <span className="-mt-1 h-2 w-2 rotate-45 bg-[#D6FF57] opacity-60" />
                <span className="-mt-1 h-2 w-2 rotate-45 bg-[var(--violet)] opacity-40" style={{ marginLeft: '45%' }} />
              </div>
            </div>
            {/* floating clip blocks */}
            <div className="floaty-slow absolute left-[6%] top-[34%] hidden h-6 w-16 rotate-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] opacity-20 lg:block" />
            <div className="floaty absolute right-[7%] top-[24%] hidden h-6 w-20 -rotate-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] opacity-15 lg:block" />
            <div className="floaty-fast absolute bottom-[20%] right-[22%] hidden h-6 w-14 rotate-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] opacity-20 lg:block" />
            {/* floating editing icons */}
            <Scissors className="floaty absolute left-[4%] top-[58%] h-10 w-10 text-[var(--violet)] opacity-[0.07]" />
            <Film className="floaty-slow absolute right-[5%] top-[52%] h-12 w-12 text-[var(--violet)] opacity-[0.06]" />
            <Music2 className="floaty-fast absolute bottom-[10%] left-[16%] h-8 w-8 text-[var(--ink)] opacity-[0.06]" />
            <Clock className="floaty absolute right-[26%] top-[8%] h-8 w-8 text-[var(--ink)] opacity-[0.05]" />
            <Play className="floaty-slow absolute bottom-[26%] left-[42%] h-8 w-8 text-[var(--violet)] opacity-[0.06]" />
            <Zap className="floaty-fast absolute right-[40%] top-[64%] h-7 w-7 text-[var(--ink)] opacity-[0.05]" />
          </div>

          <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
            <div>
              <div className="reveal inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] shadow-[var(--shadow-soft)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--violet)]" />
                Video editing studio for creators
              </div>

              <h1 className="reveal reveal-delay-1 font-display mt-6 text-[42px] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[68px]">
                Edits that <span className="text-[var(--violet)]">retain.</span>
                <br />
                Stories that <span className="relative inline-block">convert.
                  <span className="absolute -bottom-1 left-0 h-[6px] w-full rounded-full bg-[#D6FF57] opacity-80" aria-hidden="true" />
                </span>
              </h1>

              {/* floating format labels next to the headline */}
              <div className="reveal reveal-delay-2 mt-6 flex flex-wrap items-center gap-3">
                <span className="pop floaty-fast inline-flex items-center gap-2 rounded-[14px] border border-black/10 bg-[#E9FF8E] px-3.5 py-2 text-sm font-bold text-[#111113] shadow-sm">
                  <Play className="h-4 w-4" /> Shorts · 9:16
                </span>
                <span className="pop floaty inline-flex items-center gap-2 rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-sm font-bold text-[#111113] shadow-sm">
                  <Film className="h-4 w-4" /> Long-form · 16:9
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)]">
                  <Clock className="h-4 w-4" /> First cut in 48 hours
                </span>
              </div>

              <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
                Editing Zone turns raw footage into videos people finish. Retention-first cuts,
                kinetic captions and packaging that earns the click — for Shorts and long-form alike.
              </p>

              <div className="reveal reveal-delay-3 mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${EMAIL}?subject=Book%20an%20edit`}
                  className="pop inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 text-base font-semibold text-[var(--bg)] transition hover:-translate-y-0.5"
                >
                  Book an Edit <ArrowRight className="h-5 w-5" />
                </a>
                <button
                  onClick={() => scrollTo('work')}
                  className="pop inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-3.5 text-base font-semibold transition hover:-translate-y-0.5"
                >
                  <Play className="h-5 w-5 text-[var(--violet)]" /> Watch selected work
                </button>
              </div>

              <div className="reveal reveal-delay-3 mt-9 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {CREATORS.slice(0, 5).map((c) => (
                    <span
                      key={c.name}
                      className={`grid h-10 w-10 place-items-center rounded-full border-2 border-[var(--bg)] bg-gradient-to-br ${c.hue} text-[11px] font-bold text-white`}
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

            {/* hero mockup: preview + timeline */}
            <div className="reveal reveal-delay-2 relative">
              <div className="pop relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-lift)]">
                <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-2 truncate text-xs font-medium text-[var(--faint)]">kyoto_vlog_final_v3.mp4</span>
                  <span className="ml-auto rounded-md bg-[var(--field)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted)]">4K · 9:16</span>
                </div>
                <div className="relative aspect-video" style={{ background: 'linear-gradient(135deg,#FB923C 0%,#F43F5E 60%,#7C3AED 135%)' }}>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-[#111113] shadow-lg">
                      <Play className="ml-1 h-7 w-7 fill-current" />
                    </span>
                  </div>
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">00:12 / 00:58</span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
                    <Captions className="h-3.5 w-3.5" /> CC on
                  </span>
                </div>
                {/* timeline tracks */}
                <div className="relative space-y-2 px-4 py-4">
                  <div className="relative h-6 overflow-hidden rounded-md bg-[var(--field)]">
                    <div className="absolute inset-y-1 left-[4%] w-[22%] rounded bg-[var(--violet)] opacity-80" />
                    <div className="absolute inset-y-1 left-[28%] w-[30%] rounded bg-[var(--violet)] opacity-60" />
                    <div className="absolute inset-y-1 left-[60%] w-[24%] rounded bg-[var(--violet)] opacity-80" />
                    <span className="absolute left-[27%] top-1 h-2 w-2 rotate-45 bg-[#D6FF57] ring-1 ring-black/20" />
                    <span className="absolute left-[59%] top-1 h-2 w-2 rotate-45 bg-[#D6FF57] ring-1 ring-black/20" />
                  </div>
                  <div className="relative h-6 overflow-hidden rounded-md bg-[var(--field)]">
                    <div className="absolute inset-y-1 left-[10%] w-[38%] rounded bg-[#D6FF57] opacity-90" />
                    <div className="absolute inset-y-1 left-[52%] w-[30%] rounded bg-[#D6FF57] opacity-70" />
                  </div>
                  <div className="relative h-6 overflow-hidden rounded-md bg-[var(--field)]">
                    <div className="flex h-full items-end gap-[3px] px-2 pb-1" aria-hidden="true">
                      {[10, 18, 8, 22, 14, 24, 11, 19, 9, 21, 13, 23, 10, 17, 12, 20, 9, 15, 22, 11].map((h, i) => (
                        <span key={i} className="w-[5px] rounded-sm bg-[var(--border-strong)]" style={{ height: h }} />
                      ))}
                    </div>
                  </div>
                  {/* playhead */}
                  <div className="playhead-scan pointer-events-none absolute inset-y-2 w-px bg-[#D6FF57]" aria-hidden="true">
                    <span className="playhead-dot absolute -left-[5px] top-0 h-[11px] w-[11px] rounded-full bg-[#D6FF57] ring-2 ring-black/10" />
                  </div>
                </div>
              </div>

              {/* floating stat cards */}
              <div className="pop floaty absolute -left-3 -top-5 rounded-[14px] border border-black/10 bg-[#E9FF8E] px-3.5 py-2.5 text-[#111113] shadow-md sm:-left-6">
                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Avg. retention</p>
                <p className="font-display text-lg font-bold leading-none">+38% watch time</p>
              </div>
              <div className="pop floaty-slow absolute -bottom-5 right-4 rounded-[14px] border border-black/10 bg-white px-3.5 py-2.5 text-[#111113] shadow-md">
                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Turnaround</p>
                <p className="font-display text-lg font-bold leading-none">48h first cut</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- CREATORS ---------- */}
        <section className="mx-auto w-full max-w-[1200px] px-4 pb-4 sm:px-6" aria-label="Creators we cut for">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CREATORS.map((c, i) => (
              <article
                key={c.name}
                className={`reveal pop rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] reveal-delay-${(i % 3) + 1}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${c.hue} text-sm font-bold text-white`}>
                    {c.initials}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display truncate text-base font-semibold">{c.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{c.niche} · {c.followers} followers</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-[var(--muted)]">
                  <p className="flex items-center gap-2"><Youtube className="h-4 w-4 shrink-0 text-[#FF0000]" /> {c.youtube}</p>
                  <p className="flex items-center gap-2"><Instagram className="h-4 w-4 shrink-0 text-[#E1306C]" /> {c.instagram}</p>
                  <p className="flex items-center gap-2"><Twitter className="h-4 w-4 shrink-0 text-[var(--violet)]" /> {c.twitter}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- WORK ---------- */}
        <section id="work" className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--violet)]">Portfolio</p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Selected work</h2>
              <p className="mt-2 max-w-lg text-[var(--muted)]">Real cuts, real retention numbers. Pick a niche, pick a format, press play.</p>
            </div>
            <label className="pop flex w-full max-w-xs items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 shadow-[var(--shadow-soft)]">
              <Search className="h-4 w-4 shrink-0 text-[var(--faint)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search edits or creators…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--faint)]"
                aria-label="Search edits or creators"
              />
            </label>
          </div>

          {/* filters */}
          <div className="reveal reveal-delay-1 mt-8 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={`pop rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    category === c.id
                      ? 'bg-[var(--ink)] text-[var(--bg)]'
                      : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow-soft)]" role="group" aria-label="Filter by format">
              {([
                ['short', 'Shorts · 9:16'],
                ['long', 'Long-form · 16:9'],
              ] as [Format, string][]).map(([f, label]) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  aria-pressed={format === f}
                  className={`pop rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    format === f ? 'bg-[var(--ink)] text-[var(--bg)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* bento grid */}
          {filtered.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v, i) => {
                const playing = playingId === v.id;
                return (
                  <article
                    key={v.id}
                    data-reveal
                    className={`reveal pop group overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)] ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                    style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                  >
                    <div
                      className={`relative w-full overflow-hidden ${v.format === 'short' ? 'aspect-[9/16] max-h-[420px]' : 'aspect-video'}`}
                      style={{ background: v.gradient }}
                    >
                      {/* keyframe diamonds */}
                      <span className="absolute left-[18%] top-3 h-2 w-2 rotate-45 bg-white/50" aria-hidden="true" />
                      <span className="absolute left-[55%] top-3 h-2 w-2 rotate-45 bg-[#D6FF57]/80" aria-hidden="true" />
                      <span className="absolute left-[82%] top-3 h-2 w-2 rotate-45 bg-white/40" aria-hidden="true" />
                      <div className="absolute inset-x-0 top-6 h-px bg-white/25" aria-hidden="true" />

                      {playing ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 text-white">
                          <div className="flex h-10 items-end gap-1.5" aria-hidden="true">
                            {[0, 1, 2, 3, 4].map((n) => (
                              <span key={n} className="eq-bar w-2 rounded bg-[#D6FF57]" style={{ height: 34, animationDelay: `${n * 0.12}s` }} />
                            ))}
                          </div>
                          <p className="mt-3 text-xs font-semibold uppercase tracking-widest">Preview playing</p>
                          <div className="absolute inset-x-4 bottom-4 h-1 overflow-hidden rounded-full bg-white/30">
                            <div className="progress-slide h-full rounded-full bg-[#D6FF57]" />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPlayingId(v.id)}
                          className="absolute inset-0 grid place-items-center"
                          aria-label={`Play preview: ${v.title}`}
                        >
                          <span className="grid h-14 w-14 scale-90 place-items-center rounded-full bg-white/90 text-[#111113] opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                            <Play className="ml-0.5 h-6 w-6 fill-current" />
                          </span>
                        </button>
                      )}
                      {playing && (
                        <button
                          onClick={() => setPlayingId(null)}
                          className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Stop
                        </button>
                      )}
                      <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">{v.duration}</span>
                      <span className="absolute bottom-3 right-3 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
                        {v.format === 'short' ? '9:16' : '16:9'}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--violet)]">
                        <span className="capitalize">{v.category}</span>·<span>{v.views} views</span>
                      </div>
                      <h3 className="font-display mt-2 text-lg font-semibold leading-snug">{v.title}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">for {v.creator}</p>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{v.hook}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
                          <Zap className="h-4 w-4 text-[var(--violet)]" /> {v.retention}
                        </span>
                        <button
                          onClick={() => setPlayingId(playing ? null : v.id)}
                          className="pop inline-flex items-center gap-1 text-sm font-semibold text-[var(--violet)] transition hover:-translate-y-0.5"
                        >
                          {playing ? 'Stop preview' : 'Preview'} <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="reveal is-visible mt-8 rounded-[20px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)] px-6 py-14 text-center">
              <Film className="mx-auto h-10 w-10 text-[var(--faint)]" />
              <h3 className="font-display mt-4 text-xl font-semibold">No {format === 'short' ? 'Shorts' : 'long-form'} in {category} match that search</h3>
              <p className="mx-auto mt-2 max-w-md text-[var(--muted)]">
                Try clearing the search, or jump to a format we have already shipped for this niche.
              </p>
              <button
                onClick={() => { setQuery(''); setFormat(format === 'short' ? 'long' : 'short'); }}
                className="pop mt-6 rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition hover:-translate-y-0.5"
              >
                Show {format === 'short' ? 'long-form' : 'Shorts'} instead
              </button>
            </div>
          )}
        </section>

        {/* ---------- SERVICES ---------- */}
        <section id="services" className="relative overflow-hidden py-16">
          {/* services background layer */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="absolute bottom-0 left-[12%] top-0 w-px bg-gradient-to-b from-transparent via-[var(--border-strong)] to-transparent opacity-60">
              <span className="playhead-dot absolute left-1/2 top-[22%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#D6FF57]" />
              <span className="absolute left-1/2 top-[55%] h-2 w-2 -translate-x-1/2 rotate-45 bg-[var(--violet)] opacity-60" />
              <span className="absolute left-1/2 top-[80%] h-2 w-2 -translate-x-1/2 rotate-45 bg-[var(--violet)] opacity-40" />
            </div>
            <Scissors className="floaty absolute right-[6%] top-10 h-10 w-10 text-[var(--violet)] opacity-[0.06]" />
            <Music2 className="floaty-slow absolute bottom-10 left-[30%] h-9 w-9 text-[var(--ink)] opacity-[0.05]" />
            <div className="floaty-fast absolute right-[24%] top-[38%] hidden h-6 w-16 rotate-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] opacity-15 lg:block" />
          </div>

          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
            <div className="reveal max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--violet)]">Services</p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">What we cut, frame by frame</h2>
              <p className="mt-2 text-[var(--muted)]">Three ways to hand over the timeline and get back videos that hold attention.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {SERVICES.map((s, i) => (
                <article
                  key={s.title}
                  className={`reveal pop rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] reveal-delay-${i + 1}`}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[var(--field)] text-[var(--violet)]">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-5 text-xl font-semibold leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{s.blurb}</p>
                  <ul className="mt-4 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm font-medium">
                        <Check className="h-4 w-4 shrink-0 text-[var(--violet)]" /> {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--field)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                    <Clock className="h-3.5 w-3.5" /> {s.meta}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- PROCESS ---------- */}
        <section id="process" className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="reveal max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--violet)]">Process</p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Raw footage in. Retention out.</h2>
          </div>
          <div className="relative mt-10 grid gap-5 md:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-[var(--border)] md:block" aria-hidden="true">
              <span className="absolute left-[33%] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[var(--violet)] opacity-50" />
              <span className="absolute left-[66%] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#D6FF57] ring-1 ring-black/10" />
            </div>
            {PROCESS.map((p, i) => (
              <article
                key={p.step}
                className={`reveal pop relative rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] reveal-delay-${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[var(--ink)] text-[var(--bg)]">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-4xl font-bold text-[var(--border-strong)]">{p.step}</span>
                </div>
                <h3 className="font-display mt-5 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{p.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- NEON CTA ---------- */}
        <section id="contact" className="mx-auto w-full max-w-[1200px] px-4 pb-20 sm:px-6">
          <div className="grid gap-6 rounded-[28px] bg-[#D6FF57] p-6 text-[#111113] shadow-[var(--shadow-lift)] sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="reveal">
              <p className="inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> Slots open this week
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                Book an edit.<br />Ship today.
              </h2>
              <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-black/70">
                Send one raw video and get a retention-first first cut back in 48 hours.
                No calls required — everything happens over email.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={`mailto:${EMAIL}?subject=Book%20an%20edit`}
                  className="pop inline-flex items-center gap-2 rounded-full bg-[#111113] px-6 py-3.5 text-base font-semibold text-white transition hover:-translate-y-0.5"
                >
                  <Send className="h-5 w-5" /> {EMAIL}
                </a>
                <button
                  onClick={copyEmail}
                  className="pop inline-flex items-center gap-2 rounded-full border border-black/25 bg-white/40 px-6 py-3.5 text-base font-semibold transition hover:-translate-y-0.5"
                >
                  <Copy className="h-5 w-5" /> Copy email
                </button>
              </div>
            </div>
            <div className="reveal reveal-delay-2 pop rounded-[20px] bg-white p-6 text-[#111113] shadow-md">
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
              <a
                href={`mailto:${EMAIL}?subject=Book%20an%20edit`}
                className="pop mt-6 inline-flex items-center gap-1.5 font-semibold text-[#5B5BD6] transition hover:-translate-y-0.5"
              >
                  Start with an email <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display flex items-center gap-2 text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[var(--ink)] text-[var(--bg)]">
                <Clapperboard className="h-4 w-4" />
              </span>
              Editing Zone<span className="-ml-2 text-[var(--violet)]">.</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
              Retention-first video editing for Shorts, YouTube and podcasts.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Footer">
            {[
              ['Work', 'work'],
              ['Services', 'services'],
              ['Process', 'process'],
              ['Contact', 'contact'],
            ].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="pop rounded-full px-3 py-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">
                {label}
              </button>
            ))}
          </nav>
          <div className="flex flex-col gap-2 md:items-end">
            <button onClick={copyEmail} className="pop inline-flex items-center gap-2 text-sm font-semibold transition hover:-translate-y-0.5">
              <Mail className="h-4 w-4 text-[var(--violet)]" /> {EMAIL}
            </button>
            <p className="text-xs text-[var(--faint)]">© {new Date().getFullYear()} Editing Zone. Cut, captioned & shipped with care.</p>
          </div>
        </div>
      </footer>

      {/* ---------- TOAST ---------- */}
      {toast && (
        <div
          role="status"
          className="toast-in fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--bg)] shadow-[var(--shadow-lift)]"
        >
          <Check className="h-4 w-4" /> {toast}
        </div>
      )} 
</div>
 
