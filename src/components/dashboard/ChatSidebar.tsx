import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, MessageSquare, X, Sparkles } from "lucide-react";
import { streamChat } from "@/lib/streamChat";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const quickPrompts = [
  "What drove the most traffic?",
  "Where should I focus this week?",
  "Any red flags in my data?",
];

export function ChatSidebar() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    const userMsg: Msg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setIsLoading(false),
      });
    } catch (e) {
      setIsLoading(false);
      toast({
        title: "Chat error",
        description: e instanceof Error ? e.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Sparkles className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <aside className="w-[380px] shrink-0 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col h-screen">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Assistant</h2>
            <p className="text-[11px] text-muted-foreground">Ask anything about your data</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 pt-6"
          >
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-accent mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Your data, explained</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ask about traffic, conversions, ad spend, and more.
                </p>
              </div>
            </div>

            {/* Quick prompts */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-1">Try asking</p>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="w-full text-left text-sm px-4 py-3 rounded-xl border border-border/60 bg-background hover:border-primary/30 hover:bg-accent/50 transition-all text-foreground/80"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted/60 border border-border/40 rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none text-foreground/90">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-muted/60 border border-border/40 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Thinking…</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2 items-center bg-background rounded-xl border border-border/60 px-3 py-1 focus-within:border-primary/40 transition-colors"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            className="flex-1 text-sm bg-transparent py-2.5 outline-none placeholder:text-muted-foreground/60 text-foreground"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 rounded-lg shrink-0"
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </aside>
  );
}
