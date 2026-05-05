import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useTranslate } from "@/i18n/LanguageContext";

const guestsData = [
  { id: 1, name: "María García", status: "confirmed", plusOne: true, meal: "Vegetarian", table: 3 },
  { id: 2, name: "Carlos Rodríguez", status: "confirmed", plusOne: false, meal: "Regular", table: 5 },
  { id: 3, name: "Ana López", status: "pending", plusOne: true, meal: "Vegan", table: null },
  { id: 4, name: "Diego Hernández", status: "confirmed", plusOne: true, meal: "Regular", table: 7 },
  { id: 5, name: "Isabella Torres", status: "pending", plusOne: false, meal: "Gluten-free", table: null },
  { id: 6, name: "Miguel Sánchez", status: "confirmed", plusOne: true, meal: "Regular", table: 2 },
  { id: 7, name: "Valentina Cruz", status: "confirmed", plusOne: false, meal: "Vegetarian", table: 9 },
  { id: 8, name: "Alejandro Morales", status: "pending", plusOne: true, meal: "Regular", table: null },
];

export default function Guests() {
  const [search, setSearch] = useState("");
  const { t } = useTranslate();
  const filtered = guestsData.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold">{t("guestsPage.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{guestsData.length} {t("guestsPage.total")}</p>
        </div>
        <Button variant="gold" className="rounded-2xl w-full sm:w-auto touch-target">
          <Plus className="h-4 w-4 mr-2" /> {t("guestsPage.addGuest")}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("guestsPage.searchGuests")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl border-border/60 h-11" />
        </div>
        <Button variant="outline" className="rounded-xl touch-target">
          <Filter className="h-4 w-4 mr-2" /> {t("common.filter")}
        </Button>
      </div>

      {/* Mobile: Card layout */}
      <div className="space-y-3 md:hidden">
        {filtered.map((g) => (
          <Card key={g.id} className="rounded-2xl border-border/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{g.name}</h3>
                <Badge variant={g.status === "confirmed" ? "default" : "secondary"} className={g.status === "confirmed" ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-0" : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-0"}>
                  {g.status === "confirmed" ? t("guestsPage.confirmed") : t("guestsPage.pending")}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>{t("guestsPage.plusOne")}: {g.plusOne ? t("common.yes") : t("common.no")}</span>
                <span>{t("guestsPage.meal")}: {g.meal}</span>
                <span>{t("guestsPage.table")}: {g.table ? `#${g.table}` : "—"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Table layout */}
      <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("guestsPage.name")}</TableHead>
              <TableHead>{t("guestsPage.status")}</TableHead>
              <TableHead>{t("guestsPage.plusOne")}</TableHead>
              <TableHead>{t("guestsPage.meal")}</TableHead>
              <TableHead>{t("guestsPage.table")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((g) => (
              <TableRow key={g.id} className="cursor-pointer hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{g.name}</TableCell>
                <TableCell>
                  <Badge variant={g.status === "confirmed" ? "default" : "secondary"} className={g.status === "confirmed" ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-0" : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-0"}>
                    {g.status === "confirmed" ? t("guestsPage.confirmed") : t("guestsPage.pending")}
                  </Badge>
                </TableCell>
                <TableCell>{g.plusOne ? t("common.yes") : t("common.no")}</TableCell>
                <TableCell className="text-muted-foreground">{g.meal}</TableCell>
                <TableCell>{g.table ? `${t("guestsPage.table")} ${g.table}` : <span className="text-muted-foreground">—</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}
