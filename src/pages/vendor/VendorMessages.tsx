import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, FileText, DollarSign, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVendors, Conversation, ChatMessage } from "@/context/VendorContext";
import { toast } from "sonner";

export default function VendorMessages() {
  const { conversations, sendChatMessage, markConversationRead } = useVendors();
  const [activeId, setActiveId] = useState(conversations[0]?.id || "");
  const active = conversations.find((c) => c.id === activeId);

  const selectConversation = (id: string) => {
    setActiveId(id);
    markConversationRead(id);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-7rem)] -m-6 lg:-m-8 flex">
      <div className="w-72 border-r border-border bg-background/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-border/30">
          <h2 className="font-display font-semibold text-sm">Messages</h2>
          <p className="text-[10px] text-muted-foreground">{conversations.length} conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const isActive = conv.id === activeId;
            return (
              <button key={conv.id} onClick={() => selectConversation(conv.id)}
                className={`w-full text-left px-4 py-3 border-b border-border/10 hover:bg-muted/30 transition-colors ${isActive ? "bg-muted/50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0">
                    {conv.organizerName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conv.unread > 0 ? "font-semibold" : "font-medium"}`}>{conv.organizerName}</p>
                      {conv.unread > 0 && <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center shrink-0">{conv.unread}</span>}
                    </div>
                    <p className="text-[10px] text-accent truncate">{conv.eventName}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{lastMsg.text}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {active ? (
        <ChatView conversation={active} onSend={(text, type) => sendChatMessage(active.id, text, type)} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Select a conversation</div>
      )}
    </motion.div>
  );
}

function ChatView({ conversation, onSend }: { conversation: Conversation; onSend: (text: string, type?: ChatMessage["type"]) => void }) {
  const [input, setInput] = useState("");
  const [showActions, setShowActions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const sendProposal = () => {
    onSend("📋 I've prepared a proposal for your event. It includes venue access, setup, and all amenities discussed. Total: $45,000 MXN. Let me know if you'd like to proceed!", "proposal");
    setShowActions(false);
    toast.success("Proposal sent");
  };

  const sendQuote = () => {
    onSend("💰 Here's your detailed quote:\n• Venue Rental (8hrs): $35,000\n• Premium Lighting: $5,000\n• Sound System: $3,000\n• Setup & Cleanup: $2,000\n\nTotal: $45,000 MXN\n\n*Payments are handled directly between you and us.*", "quote");
    setShowActions(false);
    toast.success("Quote sent");
  };

  const sendConfirmation = () => {
    onSend("✅ Your booking has been confirmed! Event: " + conversation.eventName + ". We'll send you the full details and contract via email. Payments are handled directly between us.", "confirmation");
    setShowActions(false);
    toast.success("Confirmation sent");
  };

  const getMsgStyle = (msg: ChatMessage) => {
    if (msg.type === "proposal") return "bg-violet-500/10 border border-violet-500/20";
    if (msg.type === "quote") return "bg-accent/10 border border-accent/20";
    if (msg.type === "confirmation") return "bg-emerald-500/10 border border-emerald-500/20";
    return msg.sender === "vendor" ? "bg-accent text-accent-foreground" : "bg-muted";
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-14 px-4 border-b border-border/30 flex items-center gap-3 bg-background/50 shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-[10px] font-semibold text-accent">
          {conversation.organizerName.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{conversation.organizerName}</p>
          <p className="text-[10px] text-accent">{conversation.eventName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversation.messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "vendor" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${getMsgStyle(msg)} ${msg.sender === "vendor" && !msg.type ? "rounded-br-md" : ""} ${msg.sender === "organizer" ? "rounded-bl-md" : ""}`}>
              {msg.type === "proposal" && <div className="flex items-center gap-1.5 mb-1"><FileText className="h-3 w-3 text-violet-500" /><span className="text-[10px] font-semibold text-violet-500">Proposal</span></div>}
              {msg.type === "quote" && <div className="flex items-center gap-1.5 mb-1"><DollarSign className="h-3 w-3 text-accent" /><span className="text-[10px] font-semibold text-accent">Quote</span></div>}
              {msg.type === "confirmation" && <div className="flex items-center gap-1.5 mb-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /><span className="text-[10px] font-semibold text-emerald-500">Booking Confirmed</span></div>}
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              <p className={`text-[9px] mt-1 ${msg.sender === "vendor" && !msg.type ? "text-accent-foreground/60" : "text-muted-foreground"}`}>{msg.timestamp}</p>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-border/30 bg-background/50 space-y-2">
        {showActions && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 flex-1" onClick={sendProposal}>
              <FileText className="h-3 w-3" /> Send Proposal
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 flex-1" onClick={sendQuote}>
              <DollarSign className="h-3 w-3" /> Send Quote
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 flex-1" onClick={sendConfirmation}>
              <CheckCircle2 className="h-3 w-3" /> Confirm Booking
            </Button>
          </motion.div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" className="rounded-xl shrink-0" onClick={() => setShowActions(!showActions)}>
            <FileText className="h-4 w-4" />
          </Button>
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="rounded-xl flex-1" />
          <Button type="submit" variant="gold" size="icon" className="rounded-xl shrink-0" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
