import { useGrimoireStore } from '../../store/grimoire.store';
import { timeAgo } from '../../lib/formatters';
import { ExternalLink } from 'lucide-react';

export default function NewsIntel() {
  const { news } = useGrimoireStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-parchment">News Intelligence</h2>
        <span className="font-mono text-xs text-muted">{news.length} articles</span>
      </div>

      <div className="space-y-2">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md border border-border-subtle bg-surface p-5 hover:bg-elevated transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase ${
                item.sentiment === 'bullish' ? 'bg-positive/15 text-positive' :
                item.sentiment === 'bearish' ? 'bg-rose-ghost text-rose-bright' :
                'bg-neutral/15 text-muted'
              }`}>
                {item.sentiment}
              </span>
              <span className="text-xs text-text-tertiary">{item.source}</span>
              <span className="text-xs text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">{timeAgo(item.publishedAt)}</span>
              <ExternalLink className="h-3 w-3 text-text-tertiary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-parchment/80 group-hover:text-parchment transition-colors leading-relaxed">
              {item.title}
            </p>
            {item.currencies.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {item.currencies.map((c) => (
                  <span key={c} className="rounded-sm bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted">{c}</span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
