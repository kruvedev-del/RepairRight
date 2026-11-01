import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { WHATSAPP_CONFIG } from '../lib/promotions';

interface WhatsAppButtonProps {
  className?: string;
  variant?: 'primary' | 'card' | 'footer' | 'inline';
  showDetails?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  className = '',
  variant = 'primary',
  showDetails = false,
}) => {
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-[#171635]/10 shadow-sm space-y-3.5 ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-emerald-500 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold brand-font text-[#171635]">
                Direct Help on WhatsApp
              </h3>
              <p className="text-[11px] text-[#171635]/60 font-medium">
                Talk directly with our support team
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Human Support
          </span>
        </div>

        <p className="text-xs text-[#171635]/80 leading-relaxed">
          Need a human perspective on an appliance noise or prototype question? Opens WhatsApp with your inquiry pre-filled. You decide whether to send the message.
        </p>

        <div className="pt-1">
          <a
            href={WHATSAPP_CONFIG.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            aria-label="Chat with RepairRight on WhatsApp (opens in new tab with prefilled message)"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
            <span>Chat with RepairRight on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
          </a>
        </div>

        <p className="text-[11px] text-[#171635]/60 text-center italic">
          {WHATSAPP_CONFIG.disclaimer}
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`space-y-2 ${className}`}>
        <a
          href={WHATSAPP_CONFIG.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Chat with RepairRight on WhatsApp (opens in new tab with prefilled message)"
        >
          <MessageCircle className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
          <span>Chat with RepairRight on WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
        </a>
        {showDetails && (
          <p className="text-[11px] text-[#FCFCFF]/70 max-w-sm leading-relaxed">
            {WHATSAPP_CONFIG.disclaimer}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <a
        href={WHATSAPP_CONFIG.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-label="Chat with RepairRight on WhatsApp (opens in new tab with prefilled message)"
      >
        <MessageCircle className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
        <span>Chat with RepairRight on WhatsApp</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
      </a>
      {showDetails && (
        <span className="text-[10px] text-[#171635]/60 italic">
          Prefills: &ldquo;{WHATSAPP_CONFIG.prefilledMessage}&rdquo;
        </span>
      )}
    </div>
  );
};
