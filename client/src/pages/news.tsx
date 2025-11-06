import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Newspaper, Volume2, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { indianStates } from "@/data/india-locations";

export default function NewsPage() {
  const { t, i18n } = useTranslation();
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ✅ Fetch news articles dynamically
  const {
    data: newsArticles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/api/news", selectedState, i18n.language, selectedCategory],
    queryFn: async () => {
      const url = `/api/news?state=${selectedState}&lang=${i18n.language}&category=${selectedCategory}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
  });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const categories = [
    { value: "all", label: "All News" },
    { value: "schemes", label: "Schemes" },
    { value: "weather", label: "Weather" },
    { value: "market", label: "Market" },
    { value: "technology", label: "Technology" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <Newspaper className="h-8 w-8 text-primary" />
          {t("latestNews")}
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-generated agricultural updates for your region
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("selectState")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {indianStates.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
 */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <p className="text-center text-destructive py-8">
          Failed to load news. Please try again later.
        </p>
      ) : newsArticles && newsArticles.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {newsArticles.map((article: any, idx: number) => (
            <motion.div key={idx} variants={item}>
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {article.category || "General"}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{article.state || "India"}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {article.title || "Untitled News"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.summary ||
                      "No description available for this article."}
                  </p>
                </CardContent>
                {/* <CardFooter className="flex gap-2">
                  <Link href={`/news/${article.id || idx}`}>
                    <Button variant="default" size="sm" className="flex-1">
                      {t("viewFullArticle")}
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </CardFooter> */}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No news found for the selected filters.
        </p>
      )}
    </div>
  );
}
