import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle, ThumbsUp, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVendors } from "@/context/VendorContext";
import { toast } from "sonner";

export default function VendorReviews() {
  const { reviews, myVendor, replyToReview } = useVendors();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "0";
  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({ rating: r, count: reviews.filter((rv) => rv.rating === r).length }));

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim());
    setReplyingTo(null);
    setReplyText("");
    toast.success("Reply posted");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Reviews</h1>
        <p className="text-muted-foreground mt-1">See what clients say about your services.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-border/50 p-5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <span className="text-3xl font-display font-bold">{avgRating}</span>
          </div>
          <p className="text-xs text-muted-foreground">{reviews.length} reviews</p>
        </Card>
        <Card className="rounded-2xl border-border/50 p-5">
          <p className="text-xs text-muted-foreground mb-2">Rating Distribution</p>
          <div className="space-y-1.5">
            {ratingDist.map((r) => (
              <div key={r.rating} className="flex items-center gap-2">
                <span className="text-[10px] w-3">{r.rating}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${reviews.length > 0 ? (r.count / reviews.length) * 100 : 0}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground w-4">{r.count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-2xl border-border/50 p-5 text-center">
          <TrendingUp className="h-5 w-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-display font-bold">{reviews.filter((r) => r.reply).length}/{reviews.length}</p>
          <p className="text-xs text-muted-foreground">Replies sent</p>
        </Card>
      </div>

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl border-border/50 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">
                    {review.reviewerName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.reviewerName}</p>
                    <p className="text-[10px] text-muted-foreground">{review.eventName} · {review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className={`h-3.5 w-3.5 ${si < review.rating ? "fill-accent text-accent" : "text-muted"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
              {review.reply && (
                <div className="bg-muted/30 rounded-xl p-3 ml-6">
                  <p className="text-[10px] text-accent font-medium mb-1">Your Reply</p>
                  <p className="text-xs text-muted-foreground">{review.reply}</p>
                </div>
              )}
              {!review.reply && replyingTo !== review.id && (
                <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-1" onClick={() => setReplyingTo(review.id)}>
                  <MessageCircle className="h-3 w-3" /> Reply
                </Button>
              )}
              {replyingTo === review.id && (
                <div className="space-y-2 ml-6">
                  <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="rounded-xl text-xs" rows={2} placeholder="Write your reply..." />
                  <div className="flex gap-2">
                    <Button variant="gold" size="sm" className="rounded-xl text-xs" onClick={() => handleReply(review.id)}>Post Reply</Button>
                    <Button variant="ghost" size="sm" className="rounded-xl text-xs" onClick={() => { setReplyingTo(null); setReplyText(""); }}>Cancel</Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
