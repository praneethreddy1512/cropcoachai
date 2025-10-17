import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [selectedState, setSelectedState] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch news articles based on state and language
  const { data: newsArticles, isLoading } = useQuery({
    queryKey: ["/api/news", selectedState, i18n.language, selectedCategory],
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2" data-testid="text-news-title">
          <Newspaper className="h-8 w-8 text-primary" />
          {t("latestNews")}
        </h1>
        <p className="text-muted-foreground mt-1">AI-generated agricultural updates for your region</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-news-state">
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

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-news-category">
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

      {/* News Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loading-news" />
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Sample news cards - will be replaced with AI-generated data */}
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <motion.div key={id} variants={item}>
              <Card className="h-full flex flex-col hover-elevate" data-testid={`card-news-${id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Schemes
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>Maharashtra</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    New Subsidy Program for Organic Farming in 2024
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    Government announces new subsidies for farmers transitioning to organic farming
                    methods. Apply before March 31st to receive benefits...
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link href={`/news/${id}`}>
                    <Button variant="default" size="sm" className="flex-1" data-testid={`button-read-news-${id}`}>
                      {t("viewFullArticle")}
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" data-testid={`button-listen-news-${id}`}>
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
