import { useParams, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Loader2,
  Calendar,
  MapPin,
} from "lucide-react";
import { useState } from "react";

export default function NewsDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ✅ Fetch full news article by ID
  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/api/news", id],
    queryFn: async () => {
      const res = await fetch(`/api/news/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch article");
      return res.json();
    },
  });

  // 🎧 Voice narration
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ("speechSynthesis" in window && article) {
      const utterance = new SpeechSynthesisUtterance(
        `${article.title}. ${article.description}. ${article.content}`,
      );
      utterance.lang =
        i18n.language === "en"
          ? "en-US"
          : i18n.language === "hi"
            ? "hi-IN"
            : i18n.language === "te"
              ? "te-IN"
              : i18n.language === "ta"
                ? "ta-IN"
                : i18n.language === "kn"
                  ? "kn-IN"
                  : "en-US";
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8">
            <p className="text-center text-muted-foreground">
              Article not found
            </p>
            <Link href="/news">
              <Button variant="outline" className="mt-4">
                Back to News
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Back Button */}
        <Link href="/news">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Button>
        </Link>

        {/* Full Article */}
        <Card>
          <CardContent className="p-8 space-y-6">
            {/* Title + Meta */}
            <div className="space-y-4">
              <h1 className="text-3xl font-display font-bold text-foreground">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{article.state || "India"}</span>
                </div>

                <Button
                  variant={isSpeaking ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleSpeak}
                  className="gap-2"
                >
                  {isSpeaking ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                  {isSpeaking ? "Stop" : t("listenToArticle")}
                </Button>
              </div>
            </div>

            {/* Description */}
            {article.description && (
              <p className="text-lg text-muted-foreground italic">
                {article.description}
              </p>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-foreground">
                {article.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
