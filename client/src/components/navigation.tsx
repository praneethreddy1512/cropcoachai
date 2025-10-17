import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Newspaper,
  ScanSearch,
  Sprout,
  MessageSquare,
  Award,
  LogOut,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();
  const { t, i18n } = useTranslation();
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const languages = [
    { code: "en", name: t("english"), flag: "🇬🇧" },
    { code: "hi", name: t("hindi"), flag: "🇮🇳" },
    { code: "te", name: t("telugu"), flag: "🇮🇳" },
    { code: "ta", name: t("tamil"), flag: "🇮🇳" },
    { code: "kn", name: t("kannada"), flag: "🇮🇳" },
  ];

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: t("dashboard") },
    { path: "/news", icon: Newspaper, label: t("news") },
    { path: "/disease-detection", icon: ScanSearch, label: t("diseaseDetection") },
    { path: "/crop-recommendation", icon: Sprout, label: t("cropRecommendation") },
    { path: "/ai-chat", icon: MessageSquare, label: t("aiAssistant") },
    { path: "/schemes", icon: Award, label: t("schemes") },
  ];

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              data-testid="link-logo"
            >
              <div className="p-2 bg-primary rounded-lg">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">KrishiAI</span>
            </motion.div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                    data-testid={`link-nav-${item.path.slice(1) || "dashboard"}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-language-selector">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={i18n.language === lang.code ? "bg-accent" : ""}
                    data-testid={`option-language-${lang.code}`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Actions */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                className="gap-2"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t("logout")}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="icon"
                  className="h-9 w-9"
                  data-testid={`link-mobile-${item.path.slice(1) || "dashboard"}`}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
