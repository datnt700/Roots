// app/loading.tsx — Root-level loading UI
// Shown by Next.js during Suspense boundaries / RSC streaming.
import Image from 'next/image'

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse at 15% 20%, oklch(0.88 0.06 155 / 0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 80%, oklch(0.88 0.06 50 / 0.14) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 50%, oklch(0.92 0.02 80 / 0.4) 0%, transparent 70%),
          #fdf9f4
        `,
        gap: '1.25rem',
      }}
    >
      <style>{`
        @keyframes roots-breathe {
          0%, 100% { transform: scale(1);     opacity: 0.85; }
          50%       { transform: scale(1.07);  opacity: 1;    }
        }
        @keyframes roots-pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0;   }
        }
        .roots-logo-wrap {
          position: relative;
          animation: roots-breathe 2.8s ease-in-out infinite;
        }
        .roots-ring {
          position: absolute;
          inset: -8px;
          border-radius: 1.35rem;
          border: 2px solid oklch(0.5 0.12 155 / 0.25);
          animation: roots-pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .roots-brand {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: oklch(0.45 0.12 155);
          opacity: 0.65;
        }
      `}</style>

      <div className="roots-logo-wrap">
        <div className="roots-ring" />
        <Image
          src="/icon.svg"
          alt="Roots"
          width={80}
          height={80}
          priority
          style={{ borderRadius: '1.15rem', display: 'block' }}
        />
      </div>

      <span className="roots-brand">Roots · Gốc</span>
    </div>
  )
}
