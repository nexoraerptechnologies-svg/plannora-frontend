import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-surface p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-12">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-display font-semibold mb-6">Terms & Conditions</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Last updated: March 26, 2026</p>
          <h2 className="text-lg font-display font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing Planora by Nexora, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          <h2 className="text-lg font-display font-semibold text-foreground">2. Use License</h2>
          <p>Permission is granted to temporarily use the platform for personal, non-commercial event management purposes. This license does not include modifying or copying the platform's underlying technology.</p>
          <h2 className="text-lg font-display font-semibold text-foreground">3. User Content</h2>
          <p>You retain ownership of all content you upload, including photos, guest lists, and event details. By uploading, you grant Planora a license to display and process this content for service delivery.</p>
          <h2 className="text-lg font-display font-semibold text-foreground">4. Privacy</h2>
          <p>Your privacy is important. Please review our Privacy Policy for details on data handling.</p>
          <h2 className="text-lg font-display font-semibold text-foreground">5. Limitation of Liability</h2>
          <p>Planora shall not be held liable for any damages arising from the use or inability to use the platform.</p>
        </div>
      </motion.div>
    </div>
  );
}
