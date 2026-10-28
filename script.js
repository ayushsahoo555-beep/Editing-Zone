import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Captions,
  Check,
  Clock,
  Film,
  Globe,
  Instagram,
  Mail,
  Menu,
  Moon,
  Music2,
  Play,
  Scissors,
  Search,
  Sparkles,
  Sun,
  Tag,
  Twitter,
  X,
  Youtube,
  Zap,
} from 'lucide-react';
import './index.css';

/* ---------------------------------- types --------------------------------- */

type CategoryId = 'gaming' | 'vlogs' | 'finance' | 'podcasts' | 'fitness' | 'education';
type Format = 'short' | 'long';

interface Socials {
  instagram: string;
  youtube: string;
  x: string;
  tiktok: string;
  website: string;
}

interface Creator {
  id: string;
  name: string;
  channel: string;
  initials: string;
  bio: string;
  hue: string;
  socials: Socials;
}

interface VideoItem {
  id: string;
  title: string;
  category: CategoryId;
  format: Format;
  creatorId: string;
  source: string; // raw URL as pasted by the creator — parsed at runtime
  duration: string;
  views: string;
  tags: string[];
  gradient: string;
  accent: string;
  result: string;
}

interface ParsedVideo {
  platform: 'YouTube' | 'Google Drive' | 'Direct file';
  kind: string;
  id: string;
  watchUrl: string;
  canonical: string;
}

/* --------------------------- video URL parsing ---------------------------- */
/* Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID,
   youtube.com/embed/ID, drive.google.com/file/d/ID -> /preview,
   and direct .mp4 / .mov / .webm files. */

function parseVideoUrl(raw: string): ParsedVideo {
  const url = (raw || '').trim();

  const ytPatterns: Array<{ re: RegExp; kind: string }> = [
    { re: /(?:youtube\.com\/watch\?[^#]*v=)([\w-]{6,})/, kind: 'Watch' },
    { re: /(?:youtu\.be\/)([\w-]{6,})/, kind: 'Short link' },
    { re: /(?:youtube\.com\/shorts\/)([\w-]{6,})/, kind: 'Shorts' },
    { re: /(?:youtube\.com\/embed\/)([\w-]{6,})/, kind: 'Embed' },
    { re: /(?:youtube\.com\/live\/)([\w-]{6,})/, kind: 'Live' },
  ];
  for (const { re, kind } of ytPatterns) {
    const m = url.match(re);
    if (m) {
      return {
        platform: 'YouTube',
        kind,
        id: m[1],
        watchUrl: `https://www.youtube.com/watch?v=${m[1]}`,
        canonical: `youtube.com/embed/${m[1]}`,
      };
    }
  }

  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive) {
    return {
      platform: 'Google Drive',
      kind: 'Drive preview',
      id: drive[1],
      watchUrl: `https://drive.google.com/file/d/${drive[1]}/preview`,
      canonical: `drive.google.com/file/d/${drive[1]}/preview`,
    };
  }

  if (/\.(mp4|mov|webm)(\?.*)?$/i.test(url)) {
    const file = url.split('/').pop() || 'video';
    return {
      platform: 'Direct file',
      kind: file.split('.').pop()!.toUpperCase(),
      id: file,
      watchUrl: url,
      canonical: file,
    };
  }

  return { platform: 'YouTube', kind: 'Link', id: '—', watchUrl: url, canonical: url };
}

/* ---------------------------------- data ---------------------------------- */

const EMAIL = 'ayushsahoo555@gmail.com';

const CATEGORIES: Array<{ id: CategoryId; label: string }> = [
  { id: 'gaming', label: 'Gaming' },
  { id: 'vlogs', label: 'Vlogs' },
  { id: 'finance', label: 'Finance' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'education', label: 'Education' },
];

const CREATORS: Creator[] = [
  {
    id: 'aarav',
    name: 'Aarav Mehta',
    channel: 'PixelForge',
    initials: 'AM',
    bio: 'Hardcore Minecraft & speedruns — 890K subscribers',
    hue: '#6366F1',
    socials: { instagram: '@pixelforge', youtube: '@PixelForge', x: '@pixelforge', tiktok: '@pixelforge', website: 'pixelforge.gg' },
  },
  {
    id: 'sana',
    name: 'Sana Kapoor',
    channel: 'Sana Travels',
    initials: 'SK',
    bio: 'Slow travel films & city diaries — 1.2M subscribers',
    hue: '#0EA5A4',
    socials: { instagram: '@sanatravels', youtube: '@SanaTravels', x: '@sanatravels', tiktok: '@sanatravels', website: 'sanatravels.com' },
  },
  {
    id: 'rohan',
    name: 'Rohan Iyer',
    channel: 'Compounding',
    initials: 'RI',
    bio: 'Personal finance, minus the jargon — 640K subscribers',
    hue: '#111113',
    socials: { instagram: '@compounding.in', youtube: '@Compounding', x: '@compoundingin', tiktok: '@compounding.in', website: 'compounding.in' },
  },
  {
    id: 'meera',
    name: 'Meera Nair',
    channel: 'The Long Take',
    initials: 'MN',
    bio: 'Weekly podcast on building creative businesses',
    hue: '#7C3AED',
    socials: { instagram: '@thelongtake', youtube: '@TheLongTake', x: '@thelongtake', tiktok: '@thelongtake', website: 'thelongtake.show' },
  },
  {
    id: 'kabir',
    name: 'Kabir Singh',
    channel: 'Form & Function',
    initials: 'KS',
    bio: 'Strength coaching & form breakdowns — 980K subscribers',
    hue: '#D97706',
    socials: { instagram: '@formandfunction', youtube: '@FormAndFunction', x: '@formfunction', tiktok: '@formandfunction', website: 'formandfunction.fit' },
  },
  {
    id: 'lena',
    name: 'Dr. Lena Thomas',
    channel: 'Learn in Public',
    initials: 'LT',
    bio: 'Computer science explained visually — 2.1M subscribers',
    hue: '#2563EB',
    socials: { instagram: '@learninpublic', youtube: '@LearnInPublic', x: '@learninpublic', tiktok: '@learninpublic', website: 'learninpublic.dev' },
  },
];

const VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: 'I Survived 100 Days in a Hardcore World',
    category: 'gaming',
    format: 'short',
    creatorId: 'aarav',
    source: 'https://youtube.com/shorts/a1B2c3D4e5F',
    duration: '0:47',
    views: '4.8M views',
    tags: ['Retention cuts', 'Sound design', 'Captions'],
    gradient: 'linear-gradient(135deg,#6366F1 0%,#7C3AED 55%,#111113 130%)',
    accent: '#E9FF8E',
    result: '+212% average view duration vs. channel baseline',
  },
  {
    id: 'v2',
    title: '48 Hours in Kyoto — A Slow Travel Film',
    category: 'vlogs',
    format: 'long',
    creatorId: 'sana',
    source: 'https://www.youtube.com/watch?v=b2C3d4E5f6G',
    duration: '14:22',
    views: '1.1M views',
    tags: ['Colour grade', 'Narrative arc', 'B-roll pacing'],
    gradient: 'linear-gradient(135deg,#0EA5A4 0%,#0F766E 60%,#134E4A 120%)',
    accent: '#E9FF8E',
    result: 'Held 62% of viewers past the 10-minute mark',
  },
  {
    id: 'v3',
    title: 'The 50/30/20 Rule, Explained in 40 Seconds',
    category: 'finance',
    format: 'short',
    creatorId: 'rohan',
    source: 'https://youtu.be/c3D4e5F6g7H',
    duration: '0:40',
    views: '2.6M views',
    tags: ['Motion graphics', 'Hook rewrite', 'Captions'],
    gradient: 'linear-gradient(135deg,#111113 0%,#1F2937 60%,#374151 120%)',
    accent: '#E9FF8E',
    result: '38K new subscribers attributed in 30 days',
  },
  {
    id: 'v4',
    title: 'Building a Studio That Pays for Itself',
    category: 'podcasts',
    format: 'long',
    creatorId: 'meera',
    source: 'https://www.youtube.com/embed/d4E5f6G7h8I',
    duration: '52:10',
    views: '318K views',
    tags: ['Multi-cam edit', 'Chapter markers', 'Clips package'],
    gradient: 'linear-gradient(135deg,#7C3AED 0%,#5B21B6 60%,#111113 130%)',
    accent: '#E9FF8E',
    result: 'Cut into 6 Shorts that added 410K extra views',
  },
  {
    id: 'v5',
    title: 'Fix Your Squat in 3 Cues',
    category: 'fitness',
    format: 'short',
    creatorId: 'kabir',
    source: 'https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view?usp=sharing',
    duration: '0:35',
    views: '3.9M views',
    tags: ['On-screen cues', 'Loop ending', 'Captions'],
    gradient: 'linear-gradient(135deg,#D97706 0%,#B45309 55%,#78350F 120%)',
    accent: '#FFFFFF',
    result: 'Saved 84K times — highest save rate on the channel',
  },
  {
    id: 'v6',
    title: 'How Neural Networks Actually Learn',
    category: 'education',
    format: 'long',
    creatorId: 'lena',
    source: 'https://storage.learninpublic.dev/media/how-neural-networks-learn.mp4',
    duration: '18:04',
    views: '2.2M views',
    tags: ['Explainer animation', 'Diagram builds', 'Pacing pass'],
    gradient: 'linear-gradient(135deg,#2563EB 0%,#1D4ED8 55%,#111827 125%)',
    accent: '#E9FF8E',
    result: 'Watch time up 3.1× over the previous explainer',
  },
];

const creatorById = (id: string) => CREATORS.find((c) => c.id === id)!;
const categoryLabel = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!.label;

/* --------------------------------- helpers -------------------------------- */

function Avatar({ creator, size = 28 }: { creator: Creator; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: creator.hue,
        fontSize: Math.max(9, size * 0.38),
      }}
      aria-hidden="true"
    >
      {creator.initials}
    </span>
  );
}

function socialLinks(creator: Creator) {
  const h = (v: string) => v.replace('@', '');
  return [
    { label: 'Instagram', handle: creator.socials.instagram, href: `https://instagram.com/${h(creator.socials.instagram)}`, Icon: Instagram },
    { label: 'YouTube', handle: creator.socials.youtube, href: `https://youtube.com/${creator.socials.youtube}`, Icon: Youtube },
    { label: 'X', handle: creator.socials.x, href: `https://x.com/${h(creator.socials.x)}`, Icon: Twitter },
    { label: 'TikTok', handle: creator.socials.tiktok, href: `https://tiktok.com/${creator.socials.tiktok}`, Icon: Music2 },
    { label: 'Website', handle: creator.socials.website, href: `https://${creator.socials.website}`, Icon: Globe },
  ];
}

function SocialRow({ creator, onToast }: { creator: Creator; onToast: (m: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {socialLinks(creator).map(({ label, handle, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener"
          title={`${label} — ${handle}`}
          aria-label={`${creator.name} on ${label}: ${handle}`}
          onClick={() => onToast(`${label}: ${handle}`)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
        >
          <Icon size={13} strokeWidth={1.8} />
        </a>
      ))}
    </div>
  );
}

/* ------------------------------- video card ------------------------------- */

function VideoCard({
  video,
  tall,
  onOpen,
  onToast,
}: {
  video: VideoItem;
  tall?: boolean;
  onOpen: (v: VideoItem) => void;
  onToast: (m: string) => void;
}) {
  const creator = creatorById(video.creatorId);
  const isShort = video.format === 'short';
  return (
    <article
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--ink)] hover:shadow-[var(--shadow-lift)]"
      onClick={() => onOpen(video)}
    >
      {/* thumbnail */}
      <div
        className={`thumb-sheen relative w-full overflow-hidden ${isShort && tall ? 'aspect-[9/14]' : isShort ? 'aspect-[9/12]' : 'aspect-video'}`}
        style={{ background: video.gradient }}
      >
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
            style={{ background: video.accent, color: '#111113' }}
          >
            {isShort ? 'Shorts · 9:16' : 'Long-form · 16:9'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <Clock size={11} /> {video.duration}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-display text-[22px] font-700 leading-[1.05] text-white" style={{ fontWeight: 700 }}>
            {video.title}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">{creator.channel}</p>
        </div>
        {/* single play button, on hover only */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-200 group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition duration-200 group-hover:scale-105">
            <Play size={20} fill="currentColor" className="ml-0.5" />
          </span>
        </div>
      </div>

      {/* meta */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-[var(--field)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ink-2)]">
            {categoryLabel(video.category)}
          </span>
          <span className="rounded-full bg-[var(--field)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)]">
            {isShort ? 'Shorts' : 'Long-form'}
          </span>
          <span className="ml-auto text-[11px] font-medium text-[var(--faint)]">{video.views}</span>
        </div>

        <h3 className="text-[16px] font-semibold leading-snug tracking-tight text-[var(--ink)]">{video.title}</h3>

        <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--border)] pt-3">
          <Avatar creator={creator} size={28} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-semibold text-[var(--ink)]">{creator.name}</p>
            <p className="truncate text-[11px] text-[var(--muted)]">{creator.bio}</p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <SocialRow creator={creator} onToast={onToast} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {video.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--muted)]">
              <Tag size={10} /> {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ---------------------------------- modals -------------------------------- */

function ModalShell({
  children,
  onClose,
  labelledBy,
}: {
  children: React.ReactNode;
  onClose: () => void;
  labelledBy: string;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fade-anim fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div
        className="modal-anim max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[24px] bg-[var(--surface)] shadow-2xl sm:rounded-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function VideoModal({
  video,
  onClose,
  onToast,
  onBook,
}: {
  video: VideoItem;
  onClose: () => void;
  onToast: (m: string) => void;
  onBook: () => void;
}) {
  const creator = creatorById(video.creatorId);
  const parsed = useMemo(() => parseVideoUrl(video.source), [video.source]);
  const isShort = video.format === 'short';

  return (
    <ModalShell onClose={onClose} labelledBy="video-modal-title">
      {/* player */}
      <div className={`thumb-sheen relative w-full ${isShort ? 'aspect-[16/10]' : 'aspect-video'}`} style={{ background: video.gradient }}>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
        >
          <X size={16} />
        </button>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <a
            href={parsed.watchUrl}
            target="_blank"
            rel="noopener"
            onClick={() => onToast(`Opening on ${parsed.platform}…`)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl transition hover:scale-105"
            aria-label={`Watch “${video.title}” on ${parsed.platform}`}
          >
            <Play size={24} fill="currentColor" className="ml-1" />
          </a>
          <p className="font-display max-w-md text-[22px] font-bold leading-tight text-white">{video.title}</p>
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/75">
            {creator.channel} · {video.duration} · {video.views}
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[var(--ink)] px-2.5 py-1 text-[11px] font-semibold text-white">{categoryLabel(video.category)}</span>
          <span className="rounded-full bg-[var(--field)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)]">
            {isShort ? 'Shorts · 9:16' : 'Long-form · 16:9'}
          </span>
          {video.tags.map((t) => (
            <span key={t} className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--muted)]">{t}</span>
          ))}
        </div>

        <h2 id="video-modal-title" className="font-display mt-4 text-[26px] font-bold leading-tight tracking-tight text-[var(--ink)]">
          {video.title}
        </h2>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3.5">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-[var(--violet)]" />
          <p className="text-[13px] leading-relaxed text-[var(--muted)]">
            <span className="font-semibold text-[var(--ink)]">Result — </span>
            {video.result}
          </p>
        </div>

        {/* creator card */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] p-4">
          <Avatar creator={creator} size={44} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[15px] font-semibold text-[var(--ink)]">{creator.name}</p>
            <p className="text-[12px] text-[var(--muted)]">{creator.channel} · {creator.bio}</p>
          </div>
          <SocialRow creator={creator} onToast={onToast} />
        </div>

        {/* parsed source */}
        <div className="mt-4 rounded-2xl bg-[var(--field)] p-3.5 text-[12px] leading-relaxed text-[var(--muted)]">
          <p>
            <span className="font-semibold text-[var(--ink)]">Source parsed:</span> {parsed.platform} · {parsed.kind} · ID{' '}
            <span className="font-mono text-[11px] text-[var(--ink-2)]">{parsed.id}</span>
          </p>
          <p className="truncate font-mono text-[11px]">{parsed.canonical}</p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={parsed.watchUrl}
            target="_blank"
            rel="noopener"
            onClick={() => onToast(`Opening on ${parsed.platform}…`)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-[14px] font-semibold text-white transition hover:opacity-85"
          >
            <Play size={15} fill="currentColor" /> Watch video
          </a>
          <button
            onClick={onBook}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-3 text-[14px] font-semibold text-[var(--ink)] transition hover:border-[var(--ink)]"
          >
            Book a similar edit <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function BookModal({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  const [form, setForm] = useState({ name: '', email: '', channel: '', type: 'Shorts (9:16)', deadline: '', requirements: '' });
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const field =
    'w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-[14px] text-[var(--ink)] outline-none transition placeholder:text-[var(--faint)] focus:border-[var(--ink)]';
  const label = 'mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-[var(--muted)]';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.channel.trim() || !form.requirements.trim()) {
      setError('Please fill in Name, Email, Channel and Requirements.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      setError('That email address does not look complete.');
      return;
    }
    setError(null);
    const subject = encodeURIComponent(`New Editing Request from ${form.name} - ${form.type}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nChannel: ${form.channel}\nProject type: ${form.type}\nDeadline: ${form.deadline || 'Flexible'}\n\nRequirements:\n${form.requirements}`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    onToast("Request sent! We'll reach out within 6 hours.");
    onClose();
  };

  return (
    <ModalShell onClose={onClose} labelledBy="book-modal-title">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--violet)]">Editing Zone</p>
            <h2 id="book-modal-title" className="font-display mt-1 text-[28px] font-bold tracking-tight text-[var(--ink)]">
              Book an Edit
            </h2>
            <p className="mt-1 text-[14px] text-[var(--muted)]">
              Tell us about the project. We reply at <span className="font-medium text-[var(--ink)]">{EMAIL}</span> within 24 hours.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
          <div>
            <label className={label} htmlFor="bk-name">Name *</label>
            <input id="bk-name" className={field} placeholder="Your name" value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label className={label} htmlFor="bk-email">Email *</label>
            <input id="bk-email" type="email" className={field} placeholder="you@channel.com" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className={label} htmlFor="bk-channel">Channel *</label>
            <input id="bk-channel" className={field} placeholder="Channel name or link" value={form.channel} onChange={set('channel')} />
          </div>
          <div>
            <label className={label} htmlFor="bk-type">Project Type</label>
            <select id="bk-type" className={field} value={form.type} onChange={set('type')}>
              <option>Shorts (9:16)</option>
              <option>Long-form (16:9)</option>
              <option>Shorts + Long-form package</option>
              <option>Podcast multi-cam</option>
              <option>Channel retainer</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="bk-deadline">Deadline</label>
            <input id="bk-deadline" type="date" className={field} value={form.deadline} onChange={set('deadline')} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="bk-req">Requirements *</label>
            <textarea
              id="bk-req"
              className={`${field} min-h-[110px] resize-y`}
              placeholder="Video length, style references, turnaround, anything we should know…"
              value={form.requirements}
              onChange={set('requirements')}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700 sm:col-span-2" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 text-[14px] font-semibold text-white transition hover:opacity-85 sm:col-span-2"
          >
            Send Request
          </button>
          <p className="text-center text-[12px] text-[var(--faint)] sm:col-span-2">
            Request will be sent to {EMAIL}
          </p>
        </form>
      </div>
    </ModalShell>
  );
}

/* ----------------------------------- app ----------------------------------- */

export default function App() {
  const [category, setCategory] = useState<CategoryId>('gaming');
  const [format, setFormat] = useState<Format>('short');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = window.localStorage.getItem('editing_zone_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch { /* ignore */ }
    return 'light';
  });
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<VideoItem | null>(null);
  const [booking, setBooking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('editing_zone_theme', theme);
    } catch { /* ignore */ }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      showToast(next === 'dark' ? 'Dark mode on' : 'Light mode on');
      return next;
    });
  };

  const counts = useMemo(() => {
    const map = new Map<CategoryId, number>();
    VIDEOS.filter((v) => v.format === format).forEach((v) => map.set(v.category, (map.get(v.category) || 0) + 1));
    return map;
  }, [format]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VIDEOS.filter((v) => {
      if (v.category !== category) return false;
      if (v.format !== format) return false;
      if (!q) return true;
      const c = creatorById(v.creatorId);
      return [v.title, c.name, c.channel, categoryLabel(v.category), ...v.tags].join(' ').toLowerCase().includes(q);
    });
  }, [category, format, query]);

  const openBook = () => {
    setActive(null);
    setBooking(true);
  };

  const navItems: Array<{ label: string; href: string }> = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  const pillBase =
    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition whitespace-nowrap';

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen bg-[var(--bg)] text-[var(--ink)]"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      {/* ------------------------------- header ------------------------------ */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 border-b border-[var(--border)] backdrop-blur-md"
        style={{ top: 'var(--safe-area-inset-top)', background: 'var(--header-bg)' }}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-5 sm:px-8">
          <a href="#top" className="font-display text-[19px] font-bold tracking-tight text-[var(--ink)]">
            Editing Zone<span className="text-[var(--violet)]">.</span>
          </a>
          <nav className="ml-8 hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="rounded-full px-3.5 py-2 text-[14px] font-medium text-[var(--muted)] transition hover:bg-[var(--field)] hover:text-[var(--ink)]"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={`mailto:${EMAIL}`}
              className="hidden items-center gap-1.5 text-[13px] font-medium text-[var(--muted)] transition hover:text-[var(--ink)] lg:inline-flex"
            >
              <Mail size={14} /> {EMAIL}
            </a>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              title="Toggle theme"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-[12px] font-semibold text-[var(--ink)] transition hover:border-[var(--ink)]"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={() => setBooking(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-5 py-2.5 text-[13.5px] font-semibold text-white transition hover:opacity-85"
            >
              Book an Edit <ArrowUpRight size={14} />
            </button>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink)] md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-3 md:hidden" aria-label="Mobile">
            {navItems.map((n) => (
              <a
                key={n.label}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-[15px] font-medium text-[var(--ink)] hover:bg-[var(--field)]"
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="top" className="mx-auto max-w-[1200px] px-5 sm:px-8">
        {/* -------------------------------- hero ------------------------------ */}
        <section className="relative py-16 sm:py-24">
          <div className="dotted-bg pointer-events-none absolute inset-0 -z-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_35%,black,transparent)]" />
          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--muted)] shadow-[var(--shadow-soft)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]" />
                Video editing for creators & brands
              </span>
              <h1 className="font-display mt-6 text-[44px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--ink)] sm:text-[64px]">
                Edits that retain.
                <br />
                Stories that <span className="relative inline-block">convert.<span className="absolute inset-x-0 -bottom-1 -z-10 h-[10px] rounded-sm bg-[var(--lime)]" /></span>
              </h1>
              <p className="mt-5 max-w-[480px] text-[17px] leading-relaxed text-[var(--muted)]">
                Editing Zone cuts Shorts and long-form videos that hold attention to the last second — retention-first pacing,
                clean captions, and sound design your audience can feel.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setBooking(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 text-[15px] font-semibold text-white transition hover:opacity-85"
                >
                  Book an Edit <ArrowRight size={16} />
                </button>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-3.5 text-[15px] font-semibold text-[var(--ink)] transition hover:border-[var(--ink)]"
                >
                  <Play size={15} /> View Work
                </a>
              </div>
              <div className="mt-9 flex items-center gap-3.5">
                <div className="flex -space-x-2.5">
                  {CREATORS.slice(0, 5).map((c) => (
                    <span key={c.id} className="ring-2 ring-[var(--bg)] rounded-full">
                      <Avatar creator={c} size={32} />
                    </span>
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="text-[13.5px] font-semibold text-[var(--ink)]">Trusted by 40+ creators</p>
                  <p className="text-[12px] text-[var(--muted)]">1,200+ videos edited · 48h average turnaround</p>
                </div>
              </div>
            </div>

            {/* floating mockup cards */}
            <div className="relative mx-auto hidden w-full max-w-[440px] sm:block lg:max-w-none">
              <button
                onClick={() => setActive(VIDEOS[0])}
                className="group relative z-10 ml-auto block w-[62%] rotate-[3deg] overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)] text-left shadow-[var(--shadow-lift)] transition hover:rotate-[1.5deg]"
              >
                <div className="thumb-sheen relative aspect-[9/11] w-full" style={{ background: VIDEOS[0].gradient }}>
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--lime)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--ink)]">
                    Shorts · 9:16
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-xl">
                      <Play size={17} fill="currentColor" className="ml-0.5" />
                    </span>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-3.5 font-display text-[16px] font-bold leading-tight text-white">
                    {VIDEOS[0].title}
                  </span>
                </div>
                <span className="flex items-center gap-2 p-3">
                  <Avatar creator={creatorById(VIDEOS[0].creatorId)} size={24} />
                  <span className="text-[12.5px] font-semibold text-[var(--ink)]">{creatorById(VIDEOS[0].creatorId).channel}</span>
                  <span className="ml-auto text-[11.5px] text-[var(--faint)]">{VIDEOS[0].views}</span>
                </span>
              </button>

              <button
                onClick={() => setActive(VIDEOS[1])}
                className="group relative z-20 -mt-16 block w-[68%] -rotate-[2.5deg] overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)] text-left shadow-[var(--shadow-lift)] transition hover:rotate-[-1deg]"
              >
                <div className="thumb-sheen relative aspect-video w-full" style={{ background: VIDEOS[1].gradient }}>
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--ink)]">
                    Long-form · 16:9
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-xl">
                      <Play size={17} fill="currentColor" className="ml-0.5" />
                    </span>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-3.5 font-display text-[16px] font-bold leading-tight text-white">
                    {VIDEOS[1].title}
                  </span>
                </div>
                <span className="flex items-center gap-2 p-3">
                  <Avatar creator={creatorById(VIDEOS[1].creatorId)} size={24} />
                  <span className="text-[12.5px] font-semibold text-[var(--ink)]">{creatorById(VIDEOS[1].creatorId).channel}</span>
                  <span className="ml-auto text-[11.5px] text-[var(--faint)]">{VIDEOS[1].views}</span>
                </span>
              </button>

              <div className="absolute -right-2 top-[46%] z-30 hidden rotate-[4deg] items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 shadow-[var(--shadow-lift)] lg:flex">
                <BarChart3 size={15} className="text-[var(--violet)]" />
                <p className="text-[12px] leading-tight">
                  <span className="font-bold text-[var(--ink)]">+212%</span>{' '}
                  <span className="text-[var(--muted)]">avg. view duration</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------- work ------------------------------- */}
        <section id="work" className="py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--violet)]">Selected work</p>
              <h2 className="font-display mt-2 text-[34px] font-bold tracking-tight text-[var(--ink)] sm:text-[40px]">Recent edits</h2>
              <p className="mt-2 max-w-[520px] text-[15px] text-[var(--muted)]">
                Every project ships in both worlds — vertical Shorts (9:16) and long-form (16:9) — cut from the same story.
              </p>
            </div>
            <label className="relative block w-full sm:w-[260px]">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--faint)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, creator, tag…"
                className="w-full rounded-full border border-transparent bg-[var(--field)] py-2.5 pl-10 pr-9 text-[13.5px] text-[var(--ink)] outline-none transition placeholder:text-[var(--faint)] focus:border-[var(--ink)] focus:bg-[var(--surface)]"
                aria-label="Search work"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--ink)]"
                >
                  <X size={13} />
                </button>
              )}
            </label>
          </div>

          {/* filters — categories only (no All), format is Shorts / Long-form toggle */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={`${pillBase} ${category === c.id ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]'}`}
                >
                  {c.label} <span className={category === c.id ? 'text-white/60' : 'text-[var(--faint)]'}>{counts.get(c.id) || 0}</span>
                </button>
              ))}
            </div>

            <div className="ml-auto inline-flex rounded-full bg-[var(--field)] p-1" role="group" aria-label="Format filter">
              {(
                [
                  { id: 'short', label: 'Shorts' },
                  { id: 'long', label: 'Long-form' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  aria-pressed={format === f.id}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
                    format === f.id ? 'bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-soft)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* bento grid */}
          {filtered.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v, i) => (
                <VideoCard key={v.id} video={v} tall={i % 3 === 0} onOpen={setActive} onToast={showToast} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[20px] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-14 text-center">
              <Film size={22} className="mx-auto text-[var(--faint)]" />
              <p className="mt-3 text-[15px] font-semibold text-[var(--ink)]">No edits match that combination</p>
              <p className="mt-1 text-[13.5px] text-[var(--muted)]">Try a different category, format, or search term.</p>
              <button
                onClick={() => {
                  setCategory('gaming');
                  setFormat('short');
                  setQuery('');
                }}
                className="mt-5 rounded-full bg-[var(--ink)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-85"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* ----------------------------- services ----------------------------- */}
        <section id="services" className="py-14 sm:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--violet)]">Services</p>
          <h2 className="font-display mt-2 text-[34px] font-bold tracking-tight text-[var(--ink)] sm:text-[40px]">
            Everything after “record”
          </h2>
          <p className="mt-2 max-w-[540px] text-[15px] text-[var(--muted)]">
            Send raw footage; get publish-ready videos. Shorts and long-form, from the same edit session.
          </p>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              {
                Icon: Scissors,
                title: 'Retention Editing',
                desc: 'Hook-first structure, pattern interrupts every few seconds, and pacing tuned to your analytics — for Shorts (9:16) and long-form (16:9) alike.',
                points: ['Hook rewrite in first 3s', 'Jump-cut & B-roll pacing', '48h standard turnaround'],
              },
              {
                Icon: Captions,
                title: 'Captions & Motion Design',
                desc: 'Word-by-word captions, animated diagrams, and lower-thirds that keep muted viewers watching and make complex ideas feel simple.',
                points: ['Styled, on-brand captions', 'Charts & diagram builds', 'Thumbnails on request'],
              },
              {
                Icon: Zap,
                title: 'Shorts Repurposing',
                desc: 'Every long video becomes a package of vertical clips — re-framed, re-hooked, and captioned for Shorts, Reels, and TikTok.',
                points: ['3–6 clips per long video', 'Smart 9:16 reframing', 'Loop-friendly endings'],
              },
            ].map(({ Icon, title, desc, points }) => (
              <article
                key={title}
                className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition hover:border-[var(--ink)] hover:shadow-[var(--shadow-lift)]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--field)] text-[var(--ink)]">
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <h3 className="font-display mt-4 text-[19px] font-bold tracking-tight text-[var(--ink)]">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">{desc}</p>
                <ul className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-[13px] text-[var(--ink-2)]">
                      <Check size={13} className="shrink-0 text-[var(--violet)]" /> {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------ process ----------------------------- */}
        <section id="process" className="py-14 sm:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--violet)]">Process</p>
          <h2 className="font-display mt-2 text-[34px] font-bold tracking-tight text-[var(--ink)] sm:text-[40px]">
            Raw footage to published in three steps
          </h2>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              {
                n: '01',
                title: 'Send your footage',
                desc: 'Drop raw files via Drive or Frame.io and tell us the goal of the video. We confirm scope and timeline within a day.',
              },
              {
                n: '02',
                title: 'We cut for retention',
                desc: 'First cut in 48 hours with hook options, captions, and sound design. You comment with timestamps; we revise fast.',
              },
              {
                n: '03',
                title: 'Publish & compound',
                desc: 'Final exports in 9:16 and 16:9, plus a Shorts package from every long video. Then we review analytics and iterate.',
              },
            ].map((s, i) => (
              <article key={s.n} className="relative rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
                <span className="font-display text-[40px] font-bold leading-none text-[var(--border-strong)]">{s.n}</span>
                <h3 className="font-display mt-3 text-[19px] font-bold tracking-tight text-[var(--ink)]">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">{s.desc}</p>
                {i < 2 && <ArrowRight size={16} className="absolute right-5 top-7 hidden text-[var(--faint)] md:block" />}
              </article>
            ))}
          </div>

          {/* Neon CTA — lime in both light & dark mode */}
          <div className="mt-12">
            <div
              className="grid items-start gap-8 overflow-hidden p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]"
              style={{ background: '#D6FF57', borderRadius: 28 }}
            >
              {/* left column */}
              <div>
                <h2
                  className="text-[32px] sm:text-[42px]"
                  style={{
                    fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
                    fontWeight: 700,
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em',
                    color: '#111113',
                  }}
                >
                  Book an edit.
                  <br />
                  Ship today.
                </h2>
                <p
                  className="mt-3 max-w-[380px] text-[15px]"
                  style={{ color: 'rgba(17,17,19,0.7)', lineHeight: 1.5 }}
                >
                  Tell us your channel, style, references and deadline – we handle hook, cut, captions, SFX, grade. No
                  pricing pages, just custom scope.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[12px] font-medium"
                    style={{ background: '#111113', color: '#D6FF57' }}
                  >
                    Response &lt; 2h
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-[12px] font-medium"
                    style={{ background: 'rgba(17,17,19,0.12)', color: '#111113', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    No watermark
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-[12px] font-medium"
                    style={{ background: 'rgba(17,17,19,0.12)', color: '#111113', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    Revisions included
                  </span>
                </div>
                <button
                  onClick={() => setBooking(true)}
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full px-6 py-3.5 text-[14px] font-semibold text-white transition hover:brightness-125"
                  style={{ background: '#111113' }}
                >
                  Apply for Editing <ArrowUpRight size={15} />
                </button>
              </div>

              {/* right column — white card */}
              <div
                className="w-full max-w-[440px] justify-self-start lg:justify-self-end"
                style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
              >
                <h3 className="mb-5 text-[16px] font-semibold" style={{ color: '#111113' }}>
                  How it works
                </h3>
                <ol className="space-y-4">
                  {[
                    'Send channel link + 2-3 reference edits you love',
                    'We reply with turnaround + custom scope (no public pricing)',
                    'First cut in 24h, revisions until it slaps',
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
                        style={{ background: '#111113' }}
                      >
                        {i + 1}
                      </span>
                      <span className="pt-1 text-[14px] leading-snug" style={{ color: '#111113' }}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6" style={{ background: '#111113', borderRadius: 16, padding: 16 }}>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white" aria-hidden="true">
                      <Mail size={15} color="#111113" strokeWidth={2} />
                    </span>
                    <span className="text-[14px] font-semibold text-white">Direct to inbox</span>
                  </div>
                  <p className="mt-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                    Your request opens your email client with a pre-filled email to {EMAIL}. No server needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------- footer ------------------------------ */}
      <footer id="contact" className="border-t border-[var(--border)] bg-[var(--surface-soft)]">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-[20px] font-bold tracking-tight text-[var(--ink)]">
              Editing Zone<span className="text-[var(--violet)]">.</span>
            </p>
            <p className="mt-3 max-w-[340px] text-[14px] leading-relaxed text-[var(--muted)]">
              Retention-first video editing for creators. Shorts and long-form that hold attention — and convert it.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-[13px] font-medium text-[var(--ink)] transition hover:border-[var(--ink)]"
            >
              <Mail size={13} /> {EMAIL}
            </a>
          </div>
          <nav aria-label="Footer">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--faint)]">Explore</p>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {navItems.map((n) => (
                <li key={n.label}>
                  <a href={n.href} className="text-[var(--muted)] transition hover:text-[var(--ink)]">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--faint)]">Categories</p>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a
                    href="#work"
                    onClick={() => {
                      setCategory(c.id);
                    }}
                    className="text-[var(--muted)] transition hover:text-[var(--ink)]"
                  >
                    {c.label} edits
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--border)]">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-5 py-5 text-[12.5px] text-[var(--faint)] sm:px-8">
            <p>© {new Date().getFullYear()} Editing Zone. All rights reserved.</p>
            <p>
              Shorts 9:16 · Long-form 16:9 · <a href={`mailto:${EMAIL}`} className="hover:text-[var(--ink)]">{EMAIL}</a>
            </p>
          </div>
        </div>
      </footer>

      {/* ------------------------------ overlays ----------------------------- */}
      {active && <VideoModal video={active} onClose={() => setActive(null)} onToast={showToast} onBook={openBook} />}
      {booking && <BookModal onClose={() => setBooking(false)} onToast={showToast} />}

      {toast && (
        <div
          className="toast-anim fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--ink)] px-4.5 px-5 py-3 text-[13.5px] font-medium text-white shadow-2xl"
          role="status"
        >
          <Check size={14} className="text-[var(--lime)]" /> {toast}
        </div>
      )}
    </div>
  );
}
