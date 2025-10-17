import { useParams } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX, Loader2, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function NewsDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fetch full news article
  const { data: article, isLoading, error } = useQuery({
    queryKey: [`/api/news/${id}`],
  });

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window && article) {
      const utterance = new SpeechSynthesisUtterance(article.content);
      utterance.lang = i18n.language === 'en' ? 'en-US' :
                      i18n.language === 'hi' ? 'hi-IN' :
                      i18n.language === 'te' ? 'te-IN' :
                      i18n.language === 'ta' ? 'ta-IN' :
                      i18n.language === 'kn' ? 'kn-IN' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loading-article" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8">
            <p className="text-center text-muted-foreground">Article not found</p>
            <Link href="/news">
              <Button variant="outline" className="mt-4">Back to News</Button>
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
          <Button variant="ghost" className="gap-2" data-testid="button-back-to-news">
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Button>
        </Link>

        {/* Article */}
        <Card data-testid="card-article">
          <CardContent className="p-8 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-article-title">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{article.state}</span>
                </div>
                <Button
                  variant={isSpeaking ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleSpeak}
                  className="gap-2"
                  data-testid="button-voice-narration"
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {isSpeaking ? "Stop" : t("listenToArticle")}
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-foreground" data-testid="text-article-content">
                {article.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
