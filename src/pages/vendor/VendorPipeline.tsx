import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Calendar, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVendors, PipelineStage } from "@/context/VendorContext";
import { toast } from "sonner";

const STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: "inquiry", label: "Inquiry", color: "border-blue-500/30 bg-blue-500/5" },
  { key: "negotiation", label: "Negotiation", color: "border-amber-500/30 bg-amber-500/5" },
  { key: "proposal_sent", label: "Proposal Sent", color: "border-violet-500/30 bg-violet-500/5" },
  { key: "confirmed", label: "Confirmed", color: "border-emerald-500/30 bg-emerald-500/5" },
  { key: "completed", label: "Completed", color: "border-muted-foreground/30 bg-muted/5" },
];

const NEXT_STAGE: Partial<Record<PipelineStage, PipelineStage>> = {
  inquiry: "negotiation",
  negotiation: "proposal_sent",
  proposal_sent: "confirmed",
  confirmed: "completed",
};

export default function VendorPipeline() {
  const { pipeline, updateDealStage, vendorStats } = useVendors();

  const moveNext = (dealId: string, current: PipelineStage) => {
    const next = NEXT_STAGE[current];
    if (next) {
      updateDealStage(dealId, next);
      toast.success(`Moved to ${STAGES.find((s) => s.key === next)?.label}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Booking Pipeline</h1>
          <p className="text-muted-foreground mt-1">Track deals from inquiry to completion.</p>
        </div>
        <Card className="rounded-2xl border-accent/20 px-5 py-3 flex items-center gap-3">
          <DollarSign className="h-4 w-4 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Pipeline Value</p>
            <p className="text-lg font-display font-semibold">${vendorStats.totalPipelineValue.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {STAGES.map((stage, si) => {
          const deals = pipeline.filter((d) => d.stage === stage.key);
          const stageValue = deals.reduce((a, d) => a + d.value, 0);
          return (
            <motion.div key={stage.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.05 }}>
              <div className={`rounded-2xl border p-3 min-h-[300px] ${stage.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider">{stage.label}</h3>
                    <p className="text-[10px] text-muted-foreground">{deals.length} deals · ${stageValue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {deals.map((deal) => (
                    <Card key={deal.id} className="rounded-xl border-border/50 p-3 space-y-2 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[8px] font-bold text-accent">
                          {deal.organizerName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <p className="text-xs font-medium truncate flex-1">{deal.organizerName}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{deal.eventName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Calendar className="h-2.5 w-2.5" />{deal.eventDate}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-accent">${deal.value.toLocaleString()}</span>
                        {deal.proposalSent && <FileText className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      {NEXT_STAGE[deal.stage] && (
                        <Button variant="ghost" size="sm" className="w-full rounded-lg text-[10px] h-7 gap-1" onClick={() => moveNext(deal.id, deal.stage)}>
                          Move <ArrowRight className="h-2.5 w-2.5" />
                        </Button>
                      )}
                    </Card>
                  ))}
                  {deals.length === 0 && <p className="text-[10px] text-muted-foreground text-center py-6">No deals</p>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
