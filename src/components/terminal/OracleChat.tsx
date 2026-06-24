import { useState, useRef, useEffect } from 'react';
import { useGrimoireStore } from '../../store/grimoire.store';
import { ArrowUp } from 'lucide-react';
import type { Message } from '../../types';

export default function OracleChat() {
  const { oracleMessages, addOracleMessage, oracleLoading, setOracleLoading, oracleContext } = useGrimoireStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [oracleMessages]);

  const suggestions = [
    'What is the strongest signal right now?',
    'Analyze top wallet behavior on Solana today',
    'Explain the $WIF chart pattern',
    'Which tokens have unusual buy pressure?',
  ];

  const handleSend = async () => {
    if (!input.trim() || oracleLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    addOracleMessage(userMsg);
    setInput('');
    setOracleLoading(true);

    // Simulate AI response (replace with actual Groq API call)
    setTimeout(() => {
      const oracleMsg: Message = {
        id: `oracle_${Date.now()}`,
        role: 'oracle',
        content: generateMockOracleResponse(input),
        timestamp: Date.now(),
      };
      addOracleMessage(oracleMsg);
      setOracleLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Context bar */}
      {oracleContext && (
        <div className="rounded-sm border border-border-dim bg-surface px-4 py-2 mb-4 flex items-center gap-2">
          <span className="text-gold-dim text-xs">◈</span>
          <span className="font-mono text-xs text-muted">Analyzing: ${oracleContext.symbol} — {oracleContext.address.slice(0, 20)}...</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-4">
        {oracleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-4xl mb-4">◈</span>
            <h3 className="font-display text-xl text-parchment mb-2">GRIMOIRE Oracle</h3>
            <p className="text-sm text-muted max-w-xs">Ask anything about Solana tokens, patterns, or market conditions.</p>
          </div>
        )}

        {oracleMessages.map((msg) => (
          <div key={msg.id} className={`${msg.role === 'user' ? 'flex justify-end' : ''}`}>
            {msg.role === 'oracle' && (
              <div className="font-mono text-[10px] text-gold-dim mb-1">◈ GRIMOIRE ORACLE</div>
            )}
            <div className={`${
              msg.role === 'user'
                ? 'bg-surface border border-border-dim rounded-sm px-4 py-3 max-w-[80%]'
                : 'font-display text-base text-parchment leading-[1.8]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {oracleLoading && (
          <div>
            <div className="font-mono text-[10px] text-gold-dim mb-1">◈ GRIMOIRE ORACLE</div>
            <span className="font-mono text-sm text-gold-bright animate-pulse-gold">◈ ◈ ◈</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips */}
      {oracleMessages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="rounded-sm border border-border-subtle bg-surface px-3 py-1.5 text-xs text-muted hover:border-border-active transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-border-dim pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask the Oracle about any token, pattern, or market condition..."
          className="flex-1 bg-surface border border-border-dim rounded-none px-4 py-3 font-mono text-sm text-parchment placeholder:text-text-tertiary focus:outline-none focus:border-border-active"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || oracleLoading}
          className="p-3 text-gold-bright hover:text-gold-dim transition-colors disabled:opacity-30"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
      <div className="text-right mt-1">
        <span className="font-mono text-[10px] text-text-tertiary">{input.length}/2000</span>
      </div>
    </div>
  );
}

function generateMockOracleResponse(query: string): string {
  if (query.toLowerCase().includes('signal')) {
    return 'The strongest signal currently detected is a WHALE ACCUMULATION SURGE on $BONK. Buy/sell ratio at 4.2:1 with $890K volume in the last hour. Three major smart money wallets show consistent accumulation across multiple clusters. Confidence: 87%. This pattern historically precedes 15-30% moves within 48 hours.';
  }
  if (query.toLowerCase().includes('wallet')) {
    return 'Top 5 Solana wallets increased SOL holdings by 12% this week. Notable activity: 3 wallets withdrew from Binance and moved to self-custody. One wallet (5Q544f…) accumulated $2.3M in $WIF over 6 hours. Pattern suggests pre-event positioning — possibly ahead of a major announcement or token unlock.';
  }
  return `Analyzing your query: "${query.slice(0, 50)}..."\n\nBased on current on-chain data, I detect moderate bullish momentum across the Solana ecosystem. Volume profiles suggest smart money is accumulating mid-cap tokens while taking profits on recent runners. Key levels to watch: SOL $145 support, $155 resistance. Pattern confidence: 72%.`;
}
