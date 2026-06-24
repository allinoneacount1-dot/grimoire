import { useState, useRef, useEffect } from 'react';
import { useGrimoireStore } from '../../../store/grimoire.store';
import type { Message } from '../../../types/message.types';

const ORACLE_SYSTEM_PROMPT = `You are GRIMOIRE Oracle — a precise, sharp on-chain market intelligence AI.
You analyze Solana token patterns, wallet behaviors, market conditions, and on-chain signals.
You communicate in dense, intelligent prose. No fluff. No disclaimers.
You give actionable intelligence. Always reference on-chain behavioral indicators when possible.
Respond in 2-4 concise paragraphs maximum unless a detailed breakdown is explicitly requested.`;

const suggestions = [
  'What is the strongest signal right now?',
  'Analyze top wallet behavior on Solana today',
  'Explain the $WIF chart pattern',
  'Which tokens have unusual buy pressure?',
];

export function OracleChat() {
  const [input, setInput] = useState('');
  const oracleMessages = useGrimoireStore((s) => s.oracleMessages);
  const addOracleMessage = useGrimoireStore((s) => s.addOracleMessage);
  const oracleLoading = useGrimoireStore((s) => s.oracleLoading);
  const setOracleLoading = useGrimoireStore((s) => s.setOracleLoading);
  const oracleContext = useGrimoireStore((s) => s.oracleContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [oracleMessages]);

  const handleSend = async () => {
    if (!input.trim() || oracleLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    addOracleMessage(userMessage);
    setInput('');
    setOracleLoading(true);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (apiKey) {
      try {
        const contextPrompt = oracleContext
          ? `\n\nContext: Analyzing token ${oracleContext.baseToken.symbol} (${oracleContext.baseToken.address}). Current price: $${oracleContext.priceUsd}. 24h change: ${oracleContext.priceChange.h24}%.`
          : '';

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: ORACLE_SYSTEM_PROMPT + contextPrompt },
              ...oracleMessages.map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
              { role: 'user', content: input.trim() },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        const data = await response.json();
        const oracleResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'oracle',
          content: data.choices?.[0]?.message?.content || 'Oracle could not process this query.',
          timestamp: Date.now(),
        };
        addOracleMessage(oracleResponse);
      } catch {
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'oracle',
          content: 'Connection error. The Oracle is temporarily unavailable.',
          timestamp: Date.now(),
        };
        addOracleMessage(errorResponse);
      }
    } else {
      const mockResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'oracle',
        content: generateMockResponse(input.trim()),
        timestamp: Date.now(),
      };
      setTimeout(() => {
        addOracleMessage(mockResponse);
        setOracleLoading(false);
      }, 1500);
      return;
    }

    setOracleLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-void">
      {/* Context Bar */}
      {oracleContext && (
        <div className="px-6 py-3 border-b border-[var(--border-dim)] bg-deep">
          <span className="font-mono text-xs text-gold-dim">
            ◈ Analyzing: ${oracleContext.baseToken.symbol} — {oracleContext.baseToken.address}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {oracleMessages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="font-mono text-2xl text-gold-bright">◈</div>
              <h3 className="font-display text-2xl text-parchment">Ask the Oracle</h3>
              <p className="font-body text-sm text-muted max-w-md">
                Query any token, pattern, or market condition. The Oracle synthesizes on-chain intelligence in real-time.
              </p>
            </div>
          </div>
        )}

        {oracleMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'oracle' ? (
              <div className="max-w-[80%]">
                <span className="font-mono text-[10px] text-gold-dim uppercase tracking-wider block mb-2">
                  ◈ GRIMOIRE ORACLE
                </span>
                <p className="font-display text-base text-parchment leading-[1.8]">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="max-w-[80%] bg-surface border border-[var(--border-dim)] px-4 py-3">
                <p className="font-body text-sm text-parchment">{message.content}</p>
              </div>
            )}
          </div>
        ))}

        {oracleLoading && (
          <div className="flex justify-start">
            <span className="font-mono text-sm text-gold-bright animate-pulse-gold">◈ ◈ ◈</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border-dim)] bg-deep">
        {oracleMessages.length === 0 && (
          <div className="px-6 pt-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className="px-3 py-1.5 bg-surface border border-[var(--border-subtle)] text-muted font-mono text-xs hover:border-gold-dim hover:text-parchment transition-colors cursor-pointer"
                style={{ borderRadius: '2px' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="px-6 py-4 flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask the Oracle about any token, pattern, or market condition..."
            className="flex-1 h-12 px-4 bg-surface border border-[var(--border-dim)] text-parchment font-mono text-sm placeholder:text-muted focus:border-gold-dim focus:outline-none transition-colors"
            style={{ borderRadius: '2px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || oracleLoading}
            className="w-12 h-12 flex items-center justify-center bg-gold-bright text-void hover:bg-gold-dim transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderRadius: '2px' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function generateMockResponse(query: string): string {
  const lower = query.toLowerCase();
  
  if (lower.includes('signal') || lower.includes('strongest')) {
    return 'Current signal stack shows whale accumulation pattern dominating across mid-cap Solana tokens. The strongest S-grade signal is on a token with 340% volume increase in the last hour, paired with a 4.2:1 buy/sell ratio. Wallet cluster analysis suggests this is coordinated smart money movement, not retail-driven. Recommend monitoring the liquidity depth — if it holds above $200k, this pattern historically precedes 2-5x moves within 48 hours.';
  }
  
  if (lower.includes('wallet') || lower.includes('behavior')) {
    return 'Top wallet behavior analysis for the last 24 hours shows three distinct patterns: (1) Quiet accumulation of small-cap tokens by wallets with >$1M SOL balance — these wallets have a 73% win rate on entries. (2) Distribution from early investors in recently launched tokens — classic profit-taking. (3) New wallet creation spikes suggesting institutional or fund entry. The accumulation pattern is the most actionable — these wallets are buying into weakness, which historically signals upcoming catalysts.';
  }
  
  if (lower.includes('pattern') || lower.includes('chart')) {
    return 'The chart pattern analysis reveals a descending wedge formation on the 4H timeframe, which is traditionally a bullish reversal pattern. Key levels: support at current price zone with 3 touches confirming validity, resistance at the upper trendline approximately 12% above current price. Volume profile shows declining volume on the descent — a classic characteristic of this pattern. If confirmed with a break above resistance, the measured move target suggests approximately 25-30% upside from the breakout level.';
  }
  
  if (lower.includes('buy pressure') || lower.includes('unusual')) {
    return 'Unusual buy pressure detected in three tokens currently. Token A shows 5:1 buy/sell ratio with $500k+ volume in the last hour — this ratio is 3 standard deviations above its 30-day average. Token B has consistent buy walls appearing at regular intervals, suggesting algorithmic accumulation. Token C shows sudden volume spike from near-zero, which could indicate insider activity or upcoming announcement. All three show positive divergence between volume and price, suggesting underlying demand exceeds current price action.';
  }
  
  return 'Analyzing current market conditions. On-chain metrics show elevated activity across Solana DeFi protocols. Key indicators: (1) Transaction volume is up 34% from 7-day average. (2) New address creation rate suggests growing interest. (3) Smart money flow is rotating from large-caps to mid-caps, historically a precursor to altcoin season. The pattern engine is currently tracking 47 active signals across the ecosystem. I recommend focusing on S and A-grade signals for optimal risk-adjusted entries. Would you like me to break down any specific token or pattern in detail?';
}
