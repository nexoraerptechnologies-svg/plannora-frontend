import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Plus, Pencil, Trash2, AlertTriangle, TrendingUp, PieChart, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

type ExpenseStatus = "planned" | "confirmed" | "paid";
type ExpenseCategory = "venue" | "catering" | "music" | "decoration" | "photography" | "entertainment" | "planning" | "drinks" | "other";

interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  vendor: string;
  estimated: number;
  actual: number;
  status: ExpenseStatus;
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  venue: "Venue",
  catering: "Catering",
  music: "Music & DJ",
  decoration: "Decoration",
  photography: "Photography",
  entertainment: "Entertainment",
  planning: "Planning",
  drinks: "Drinks & Bar",
  other: "Other",
};

const CATEGORY_COLORS = [
  "hsl(42, 50%, 57%)",
  "hsl(200, 60%, 50%)",
  "hsl(340, 60%, 55%)",
  "hsl(160, 50%, 45%)",
  "hsl(280, 50%, 55%)",
  "hsl(20, 70%, 55%)",
  "hsl(100, 40%, 50%)",
  "hsl(220, 50%, 55%)",
  "hsl(0, 0%, 55%)",
];

const STATUS_VARIANT: Record<ExpenseStatus, "default" | "secondary" | "outline"> = {
  planned: "outline",
  confirmed: "secondary",
  paid: "default",
};

const INITIAL_EXPENSES: Expense[] = [
  { id: "1", name: "Grand Ballroom Rental", category: "venue", vendor: "The Grand Palace", estimated: 8000, actual: 7500, status: "confirmed" },
  { id: "2", name: "Dinner Service (150 guests)", category: "catering", vendor: "Elite Catering Co.", estimated: 12000, actual: 0, status: "planned" },
  { id: "3", name: "DJ & Sound System", category: "music", vendor: "BeatMasters", estimated: 3000, actual: 3000, status: "paid" },
  { id: "4", name: "Floral Arrangements", category: "decoration", vendor: "Bloom Studio", estimated: 4500, actual: 4200, status: "confirmed" },
  { id: "5", name: "Photo & Video Package", category: "photography", vendor: "Luxe Lens", estimated: 5000, actual: 0, status: "planned" },
  { id: "6", name: "Open Bar Package", category: "drinks", vendor: "", estimated: 6000, actual: 0, status: "planned" },
];

const TOTAL_BUDGET = 50000;

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const emptyExpense = (): Omit<Expense, "id"> => ({
  name: "", category: "other", vendor: "", estimated: 0, actual: 0, status: "planned",
});

export default function Budget() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Expense, "id">>(emptyExpense());
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalEstimated = useMemo(() => expenses.reduce((s, e) => s + e.estimated, 0), [expenses]);
  const totalActual = useMemo(() => expenses.reduce((s, e) => s + (e.actual || e.estimated), 0), [expenses]);
  const remaining = TOTAL_BUDGET - totalActual;
  const pct = Math.min((totalActual / TOTAL_BUDGET) * 100, 100);
  const budgetStatus = pct >= 100 ? "over" : pct >= 80 ? "warn" : "safe";

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const val = e.actual || e.estimated;
      map[e.category] = (map[e.category] || 0) + val;
    });
    return Object.entries(map).map(([cat, value]) => ({
      name: CATEGORY_LABELS[cat as ExpenseCategory],
      value,
      category: cat,
    }));
  }, [expenses]);

  const filtered = filterCategory === "all" ? expenses : expenses.filter((e) => e.category === filterCategory);

  const openAdd = () => { setEditingId(null); setForm(emptyExpense()); setDialogOpen(true); };
  const openEdit = (exp: Expense) => { setEditingId(exp.id); setForm({ name: exp.name, category: exp.category, vendor: exp.vendor, estimated: exp.estimated, actual: exp.actual, status: exp.status }); setDialogOpen(true); };

  const save = () => {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    if (editingId) {
      setExpenses((prev) => prev.map((e) => e.id === editingId ? { ...e, ...form } : e));
      toast({ title: "Expense updated" });
    } else {
      setExpenses((prev) => [...prev, { ...form, id: crypto.randomUUID() }]);
      toast({ title: "Expense added" });
    }
    setDialogOpen(false);
  };

  const remove = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Expense removed" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Budget</h1>
          <p className="text-muted-foreground">Track and manage all your event expenses</p>
        </div>
        <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" /> Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10"><DollarSign className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-foreground">{fmt(TOTAL_BUDGET)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10"><TrendingUp className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent / Estimated</p>
                <p className="text-2xl font-bold text-foreground">{fmt(totalActual)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${budgetStatus === "over" ? "bg-destructive/10" : budgetStatus === "warn" ? "bg-[hsl(var(--warning))]/10" : "bg-[hsl(var(--success))]/10"}`}>
                {budgetStatus === "over" ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <DollarSign className={`h-5 w-5 ${budgetStatus === "warn" ? "text-[hsl(var(--warning))]" : "text-[hsl(var(--success))]"}`} />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-2xl font-bold ${remaining < 0 ? "text-destructive" : "text-foreground"}`}>{fmt(remaining)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget Usage</span>
            <span className="font-medium text-foreground">{pct.toFixed(0)}%</span>
          </div>
          <Progress
            value={pct}
            className={`h-3 ${budgetStatus === "over" ? "[&>div]:bg-destructive" : budgetStatus === "warn" ? "[&>div]:bg-[hsl(var(--warning))]" : "[&>div]:bg-[hsl(var(--success))]"}`}
          />
          {budgetStatus === "over" && (
            <p className="text-sm text-destructive flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> You have exceeded your budget!</p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
        </TabsList>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">Start adding your event expenses</p>
                <Button variant="outline" className="mt-4" onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Add Expense</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Estimated</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium text-foreground">{exp.name}</TableCell>
                      <TableCell><Badge variant="outline">{CATEGORY_LABELS[exp.category]}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{exp.vendor || "—"}</TableCell>
                      <TableCell className="text-right text-foreground">{fmt(exp.estimated)}</TableCell>
                      <TableCell className="text-right text-foreground">{exp.actual ? fmt(exp.actual) : "—"}</TableCell>
                      <TableCell><Badge variant={STATUS_VARIANT[exp.status]} className="capitalize">{exp.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(exp)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(exp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Summary Row */}
          <div className="flex justify-end gap-8 text-sm font-medium text-foreground pr-4">
            <span>Total Estimated: {fmt(totalEstimated)}</span>
            <span>Total Actual: {fmt(totalActual)}</span>
          </div>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Spending by Category</CardTitle></CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {categoryData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmt(v)} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Estimated vs Actual</CardTitle></CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData.map((c) => {
                      const catExpenses = expenses.filter((e) => e.category === c.category);
                      return { name: c.name, estimated: catExpenses.reduce((s, e) => s + e.estimated, 0), actual: catExpenses.reduce((s, e) => s + (e.actual || 0), 0) };
                    })}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="fill-muted-foreground" />
                      <Tooltip formatter={(v: number) => fmt(v)} />
                      <Bar dataKey="estimated" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Estimated" />
                      <Bar dataKey="actual" fill="hsl(42, 50%, 57%)" radius={[4, 4, 0, 0]} name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Expense" : "Add Expense"}</DialogTitle>
            <DialogDescription>Fill in the expense details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Venue Rental" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ExpenseCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ExpenseStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vendor (optional)</Label>
              <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="e.g. Elite Catering Co." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Cost</Label>
                <Input type="number" value={form.estimated || ""} onChange={(e) => setForm({ ...form, estimated: Number(e.target.value) })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Actual Cost</Label>
                <Input type="number" value={form.actual || ""} onChange={(e) => setForm({ ...form, actual: Number(e.target.value) })} placeholder="0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-accent text-accent-foreground hover:bg-accent/90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>Are you sure you want to remove this expense? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && remove(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
