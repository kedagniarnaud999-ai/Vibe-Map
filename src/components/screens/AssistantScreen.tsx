import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  RefreshCw, 
  Compass, 
  ShieldAlert,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  fonPhrase?: {
    fon: string;
    phonetic: string;
    meaning: string;
  };
  etiquetteTip?: string;
}

export const AssistantScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Akwaba! I am your La Vibe Map Cultural Companion. I can help you understand local etiquette, decode Fon royal symbols, practice traditional greetings, or answer questions about sacred sanctuaries in Benin.',
      time: 'Just now',
      fonPhrase: {
        fon: 'Ku abo / Akwaba',
        phonetic: '/koo ah-boh/',
        meaning: 'Welcome — used as a warm greeting when entering a compound.'
      }
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'How should I greet elders in Fon?',
    'What is the etiquette inside the Temple of Pythons?',
    'What does the shark symbolize in Dahomey appliqué?',
    'Why is the Iroko tree sacred in Ouidah?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const generateAnswer = async (query: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Call server Gemini Cultural AI API route
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: query,
          conversationHistory: messages.slice(-6)
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply || data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fonPhrase: data.fonPhrase,
          etiquetteTip: data.etiquetteTip
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Gemini chat API offline/fallback:', e);
    }

    // Local rich fallback response based on cultural queries
    setTimeout(() => {
      let reply = '';
      let fonPhrase = undefined;
      let etiquetteTip = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('greet') || lower.includes('hello') || lower.includes('fon')) {
        reply = 'In Fon culture, greetings carry deep respect. You should always greet with your right hand, slightly inclining your head towards elders. Morning greetings inquire about the peace of the night.';
        fonPhrase = {
          fon: 'Afon gangji a?',
          phonetic: '/ah-fon gan-jee ah/',
          meaning: 'Did you wake up in peace? (Standard respectful morning greeting)'
        };
        etiquetteTip = 'Never hand objects or point at someone with your left hand; the left hand is reserved for personal ablutions.';
      } else if (lower.includes('python') || lower.includes('temple')) {
        reply = 'At the Temple of Pythons in Ouidah, pythons (Dangbé) represent peace and spiritual covenant with King Kpassè. They are completely harmless to visitors and protected by the community.';
        etiquetteTip = 'Remove your footwear before entering the inner sanctum and ask the priest before taking any flash photographs.';
      } else if (lower.includes('shark') || lower.includes('applique') || lower.includes('symbol')) {
        reply = 'The shark (Glèlè / Gbêhanzin emblem) symbolizes King Gbehanzin (1889–1894): "The fierce shark that defies the colonizers and protects the territorial waters of Dahomey." It was embroidered on royal banners and war tapestries.';
        etiquetteTip = 'When buying appliqué textiles in Abomey, look for hand-stitched cutouts which indicate authentic master artisan craft.';
      } else if (lower.includes('iroko') || lower.includes('tree') || lower.includes('kpasse')) {
        reply = 'The Lokotin (Iroko tree) in the Sacred Forest is said to be the living metamorphosis of King Kpassè, who transformed himself into the tree in the 14th century to protect Ouidah from invading forces.';
        etiquetteTip = 'Speak in a soft whisper inside the sacred forest. Do not touch cloths wrapped around the ancient root systems.';
      } else {
        reply = `In Benin, every historic site and cultural tradition is rooted in balance between humans, nature, and ancestral memory. Regarding "${query}", local mediators always recommend approaching with open curiosity, quiet listening, and seeking permission before recording sacred rituals.`;
        etiquetteTip = 'A warm smile and the greeting "Akwaba" opens every door in Benin.';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fonPhrase,
        etiquetteTip
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 700);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    generateAnswer(inputQuery);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 flex flex-col h-[calc(100vh-130px)]">
      {/* Header Info */}
      <div className="space-y-1 pb-3 border-b border-[#e8e2d5]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#fceee9] text-[#c14e2f]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-[#2c2926]">
              AI Cultural Companion
            </h2>
            <p className="text-xs text-[#5a5a40] font-medium">
              Grounded in Beninese traditions, proverbs & sanctuary etiquette
            </p>
          </div>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-[#c14e2f] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-md rounded-2xl p-4 space-y-2.5 shadow-sm text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#c14e2f] text-white rounded-tr-none'
                  : 'bg-white text-[#2c2926] border border-[#e8e2d5] rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line font-sans">{msg.text}</p>

              {/* Fon Phrase Box */}
              {msg.fonPhrase && (
                <div className="p-3 rounded-xl bg-[#efece2] border border-[#d9822b]/40 space-y-1 text-[#3a3a28]">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm">
                      {msg.fonPhrase.fon}
                    </span>
                    <span className="text-[10px] font-mono text-[#5a5a40]">
                      {msg.fonPhrase.phonetic}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6b665e]">
                    {msg.fonPhrase.meaning}
                  </p>
                </div>
              )}

              {/* Etiquette Tip Box */}
              {msg.etiquetteTip && (
                <div className="p-2.5 rounded-xl bg-[#f0ece1] border border-[#e8e2d5] text-[#5a5a40] flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#c14e2f] flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] font-medium">{msg.etiquetteTip}</span>
                </div>
              )}

              <span
                className={`text-[9px] block text-right ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-[#8c867c]'
                }`}
              >
                {msg.time}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[#5a5a40] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#5a5a40] bg-white p-3 rounded-2xl border border-[#e8e2d5] w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c14e2f]" />
            <span>Consulting cultural knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => generateAnswer(prompt)}
            className="px-3 py-1.5 rounded-full bg-white border border-[#e8e2d5] text-[#6b665e] text-[11px] whitespace-nowrap hover:border-[#c14e2f] hover:text-[#c14e2f] transition-all flex-shrink-0 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Query Input Box */}
      <form onSubmit={handleSend} className="relative pt-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything about Fon rituals, greetings, or site rules..."
          className="w-full pl-4 pr-12 py-3.5 bg-white text-[#2c2926] placeholder-[#8c867c] text-xs sm:text-sm rounded-2xl border border-[#e8e2d5] focus:border-[#c14e2f] focus:outline-none shadow-sm transition-all"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 w-9 h-9 rounded-xl bg-[#c14e2f] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#a83f23] active:scale-95 transition-all shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
