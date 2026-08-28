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
  BookOpen,
  Globe,
  ExternalLink,
  Layers
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { TRANSLATIONS, playCulturalTermAudio } from '../../lib/i18n';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  groundingSources?: { title: string; url: string }[];
  fonPhrase?: {
    fon: string;
    phonetic: string;
    meaning: string;
  };
  etiquetteTip?: string;
}

interface AssistantScreenProps {
  currentLang?: AppLanguage;
}

export const AssistantScreen: React.FC<AssistantScreenProps> = ({ currentLang = 'fr' }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const [useLiveWebSearch, setUseLiveWebSearch] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Akwaba ! Je suis votre guide spirituel et culturel alimenté par Gemini & Search Grounding. Posez-moi des questions sur les sanctuaires sacrés de Ouidah, les palais royaux d’Abomey, les protocoles Vodun, la fête de la Gaani ou apprenez les salutations en Fon et Yoruba.',
      time: 'Maintenant',
      fonPhrase: {
        fon: 'Ku abo / Akwaba',
        phonetic: '/koo ah-boh/',
        meaning: 'Bienvenue chaleureuse pour franchir le seuil d’un sanctuaire ou d’une concession familiale.'
      },
      etiquetteTip: 'Dans les couvents et cours royales, saluez toujours avec la main droite et le regard bienveillant.'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Quels sont les interdits du Temple des Pythons ?',
    'Comment saluer un aîné ou un dignitaire en Fon ?',
    'Quelle est la signification du requin pour le Roi Béhanzin ?',
    'Pourquoi l’Iroko est-il sacré dans la forêt de Kpassè ?'
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
      if (useLiveWebSearch) {
        // Call live server Search Grounding endpoint
        const response = await fetch('/api/gemini/search-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query + ' patrimoine bénin culture vaudou histoire ouidah abomey' })
        });

        if (response.ok) {
          const data = await response.json();
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: data.text || data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            groundingSources: data.groundingChunks?.map((c: any) => ({
              title: c.web?.title || 'Patrimoine Bénin',
              url: c.web?.uri || 'https://fr.wikipedia.org/wiki/Culture_du_B%C3%A9nin'
            })) || [],
            fonPhrase: data.fonPhrase,
            etiquetteTip: data.etiquetteTip
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsLoading(false);
          return;
        }
      } else {
        // Call standard chat endpoint
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
      }
    } catch (e) {
      console.warn('Gemini live search grounded response error, falling back locally:', e);
    }

    // Local rich fallback response based on cultural queries
    setTimeout(() => {
      let reply = '';
      let fonPhrase = undefined;
      let etiquetteTip = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('salu') || lower.includes('greet') || lower.includes('bonjour') || lower.includes('fon')) {
        reply = 'Dans la tradition béninoise et la culture Fon, la salutation est un acte sacré qui instaure la paix (Fífá). On salue toujours de la main droite, en s’inclinant légèrement face aux aînés.';
        fonPhrase = {
          fon: 'Afon gangji a ?',
          phonetic: '/ah-fon gan-jee ah/',
          meaning: 'Vous êtes-vous réveillé dans la paix ? (Salutation matinale respectueuse)'
        };
        etiquetteTip = 'Ne tendez jamais la main gauche lors d’un salut ou pour remettre un objet.';
      } else if (lower.includes('python') || lower.includes('temple') || lower.includes('ouidah')) {
        reply = 'Au Temple des Pythons de Ouidah, les pythons royaux (Dangbé) incarnent la divinité tutélaire bienveillante qui protégea le roi fondateur Kpassè. Ils sont totalement inoffensifs et sacrés.';
        etiquetteTip = 'Déchaussez-vous à l’entrée des petits sanctuaires intérieurs et demandez la permission avant de photographier les dignitaires.';
      } else if (lower.includes('requin') || lower.includes('behanzin') || lower.includes('dahomey') || lower.includes('abomey')) {
        reply = 'Le requin (Gbêhanzin) symbolise le roi résistant : « Je suis le requin téméraire qui n’abandonne pas un pouce de ses eaux territoriales ». Cet emblème royal orne les tentures appliquées d’Abomey.';
        etiquetteTip = 'Sur les tentures d’Abomey, les coutures en relief découpées à la main attestent de l’authenticité de l’artisan royal.';
      } else if (lower.includes('iroko') || lower.includes('arbre') || lower.includes('kpasse')) {
        reply = 'L’Iroko millénaire de la Forêt Sacrée de Kpassè Zoun est considéré comme la métamorphose vivante du roi Kpassè au XIVe siècle pour échapper à ses ennemis.';
        etiquetteTip = 'Parlez à voix basse dans la forêt sacrée et ne touchez pas les tissus blancs noués autour des troncs.';
      } else {
        reply = `Au Bénin, chaque sanctuaire et tradition vivante s'appuie sur le respect des ancêtres et de la nature. Concernant votre question sur "${query}", les gardiens recommandent la sincérité, la retenue et l’écoute avant d’immortaliser les cérémonies.`;
        etiquetteTip = 'La formule « Kou do agbé » (Que la paix soit avec vous) ouvre tous les cœurs.';
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
    }, 600);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    generateAnswer(inputQuery);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 flex flex-col h-[calc(100vh-130px)] font-sans">
      {/* Header Info & Grounding Switch */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d5]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#fceee9] text-[#c14e2f] shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-[#2c2926]">
              {t.askAiCompanion}
            </h2>
            <p className="text-xs text-[#5a5a40] font-medium">
              Alimenté par Gemini 3.5 Flash & Données Culturelles du Bénin
            </p>
          </div>
        </div>

        {/* Live Search Grounding Toggle */}
        <button
          onClick={() => setUseLiveWebSearch(!useLiveWebSearch)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            useLiveWebSearch
              ? 'bg-green-50 text-green-800 border-green-300 shadow-sm'
              : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
          title="Activer la recherche Google en direct sur le web"
        >
          <Globe className={`w-3.5 h-3.5 ${useLiveWebSearch ? 'text-green-600' : 'text-gray-400'}`} />
          <span>{useLiveWebSearch ? 'Recherche Web Active' : 'Mode Mémoire'}</span>
        </button>
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
              className={`max-w-[88%] sm:max-w-md rounded-2xl p-4 space-y-2.5 shadow-sm text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#c14e2f] text-white rounded-tr-none'
                  : 'bg-white text-[#2c2926] border border-[#e8e2d5] rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line font-sans">{msg.text}</p>

              {/* Fon Phrase Box with Audio Pronunciation */}
              {msg.fonPhrase && (
                <div className="p-3 rounded-xl bg-[#efece2] border border-[#d9822b]/40 space-y-1 text-[#3a3a28]">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm">
                      {msg.fonPhrase.fon}
                    </span>
                    <button
                      onClick={() => playCulturalTermAudio(msg.fonPhrase?.fon || '')}
                      className="p-1 rounded-lg bg-white/80 text-[#c14e2f] hover:bg-white transition-all shadow-xs cursor-pointer"
                      title="Écouter la prononciation phonétique"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-[#5a5a40]">
                    {msg.fonPhrase.phonetic}
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

              {/* Grounding Web Sources Citations */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="pt-2 border-t border-[#f0ece1] space-y-1">
                  <span className="text-[10px] font-bold text-[#8c867c] flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#5a5a40]" />
                    <span>Sources et références web vérifiées :</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.groundingSources.slice(0, 2).map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[#c14e2f] hover:underline bg-[#faf7f0] px-2 py-0.5 rounded border border-[#e8e2d5] flex items-center gap-1"
                      >
                        <span className="truncate max-w-[150px]">{s.title}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
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
          <div className="flex items-center gap-2 text-xs text-[#5a5a40] bg-white p-3 rounded-2xl border border-[#e8e2d5] w-fit shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c14e2f]" />
            <span>Consultation des archives vivantes et du web...</span>
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
            className="px-3 py-1.5 rounded-full bg-white border border-[#e8e2d5] text-[#6b665e] text-[11px] whitespace-nowrap hover:border-[#c14e2f] hover:text-[#c14e2f] transition-all flex-shrink-0 shadow-2xs cursor-pointer"
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
          placeholder={t.askAiCompanion + "..."}
          className="w-full pl-4 pr-12 py-3.5 bg-white text-[#2c2926] placeholder-[#8c867c] text-xs sm:text-sm rounded-2xl border border-[#e8e2d5] focus:border-[#c14e2f] focus:outline-none shadow-sm transition-all"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 w-9 h-9 rounded-xl bg-[#c14e2f] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#a83f23] active:scale-95 transition-all shadow cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
