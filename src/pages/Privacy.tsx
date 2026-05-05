import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-surface p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-12">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-display font-semibold mb-6">Privacy Policy</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Last updated: March 26, 2026</p>
          <h2 className="text-lg font-display font-semibold text-foreground">Information We Collect</h2>
          <p>We collect information you provide directly: name, email, event details, guest lists, and uploaded media. We also collect usage data and device information automatically.</p>
          <h2 className="text-lg font-display font-semibold text-foreground">How We Use Your Information</h2>
          <p>Your data is used to provide and improve our services, manage your events, send notifications, and ensure platform security.</p>
          <h2 className="text-lg font-display font-semibold text-foreground">Data Sharing</h2>
          <p>We do not sell your personal data. Information may be shared with service providers who assist in platform operations, subject to confidentiality agreements.</p>
          <h2 className="text-lg font-display font-semibold text-foreground">Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting our support team.</p>
          <h2 className="text-lg font-display font-semibold text-foreground">Contact</h2>
          <p>For privacy inquiries, contact us at privacy@planora.app</p>
        </div>
      </motion.div>
    </div>
  );
}
