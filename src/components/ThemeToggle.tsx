import { Moon, Sun, Monitor, Globe } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslate } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "dropdown" }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage } = useTranslate();

  if (variant === "icon") {
    return (
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-[10px] font-bold"
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
        >
          {language === "es" ? "EN" : "ES"}
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
          <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Tema</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")} className="text-xs gap-2">
          <Sun className="h-3 w-3" /> {language === "es" ? "Claro" : "Light"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="text-xs gap-2">
          <Moon className="h-3 w-3" /> {language === "es" ? "Oscuro" : "Dark"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="text-xs gap-2">
          <Monitor className="h-3 w-3" /> {language === "es" ? "Sistema" : "System"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">
          <Globe className="h-3 w-3 inline mr-1" />{language === "es" ? "Idioma" : "Language"}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setLanguage("es")} className={`text-xs gap-2 ${language === "es" ? "font-semibold text-accent" : ""}`}>
          🇪🇸 Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")} className={`text-xs gap-2 ${language === "en" ? "font-semibold text-accent" : ""}`}>
          🇺🇸 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
