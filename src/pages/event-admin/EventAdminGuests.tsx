import { motion } from "framer-motion";
import { Users, Plus, Search, Filter, Download, MoreHorizontal, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const guests = [
  { id: 1, name: "María García", email: "maria@example.com", table: "Mesa 5", rsvp: "confirmed", checkedIn: true },
  { id: 2, name: "Carlos López", email: "carlos@example.com", table: "Mesa 3", rsvp: "confirmed", checkedIn: true },
  { id: 3, name: "Ana Martínez", email: "ana@example.com", table: "Mesa 7", rsvp: "pending", checkedIn: false },
  { id: 4, name: "Roberto Díaz", email: "roberto@example.com", table: "Mesa 1", rsvp: "confirmed", checkedIn: false },
  { id: 5, name: "Laura Fernández", email: "laura@example.com", table: "Mesa 12", rsvp: "declined", checkedIn: false },
  { id: 6, name: "Diego Morales", email: "diego@example.com", table: "Mesa 5", rsvp: "confirmed", checkedIn: true },
  { id: 7, name: "Isabel Torres", email: "isabel@example.com", table: "Unassigned", rsvp: "pending", checkedIn: false },
  { id: 8, name: "Fernando Reyes", email: "fernando@example.com", table: "Mesa 9", rsvp: "confirmed", checkedIn: false },
];

const rsvpBadge: Record<string, string> = {
  confirmed: "text-[hsl(var(--success))] border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5",
  pending: "text-accent border-accent/30 bg-accent/5",
  declined: "text-destructive border-destructive/30 bg-destructive/5",
};

export default function EventAdminGuests() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Guests Management</h1>
          <p className="text-muted-foreground mt-1">Add, edit, and manage event guests.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="gold-outline" size="sm" className="rounded-xl">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button variant="gold" size="sm" className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" /> Add Guest
          </Button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Total", value: "248", icon: Users },
          { label: "Confirmed", value: "186", icon: CheckCircle },
          { label: "Pending", value: "38", icon: Clock },
          { label: "Declined", value: "24", icon: XCircle },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="h-4 w-4 text-accent" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-2xl font-display font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search guests..." className="pl-9 rounded-xl" />
        </div>
        <Button variant="outline" size="icon" className="rounded-xl">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card className="rounded-2xl border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>RSVP</TableHead>
              <TableHead>Checked In</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{g.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full text-[10px]">{g.table}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-full text-[10px] ${rsvpBadge[g.rsvp]}`}>{g.rsvp}</Badge>
                </TableCell>
                <TableCell>
                  {g.checkedIn ? (
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}
