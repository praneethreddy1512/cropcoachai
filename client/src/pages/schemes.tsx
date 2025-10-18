import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Loader2, CheckCircle2, FileText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SchemesPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ✅ Fetch Schemes API with React Query
  const {
    data: schemes = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["/api/schemes", i18n.language],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch(`/api/schemes?lang=${i18n.language}`);
      if (!res.ok) throw new Error("Failed to fetch schemes");
      return res.json();
    },
    retry: 2, // retry up to 2 times on failure
    staleTime: 5 * 60 * 1000, // cache data for 5 minutes
  });

  // ✅ Re-fetch whenever language changes
  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ["/api/schemes"] });
      refetch();
    }
  }, [i18n.language, user, queryClient, refetch]);

  // ✅ Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // ✅ Ensure valid array
  const displaySchemes = Array.isArray(schemes) ? schemes : [];

  // ✅ Dynamic color for category badges
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      subsidy: "bg-chart-2 text-white",
      loan: "bg-chart-1 text-white",
      insurance: "bg-chart-4 text-white",
      training: "bg-chart-3 text-white",
    };
    return colors[category] || "bg-muted";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-3xl font-display font-bold text-foreground flex items-center gap-2"
          data-testid="text-schemes-title"
        >
          <Award className="h-8 w-8 text-primary" />
          {t("governmentSchemes")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("schemesSubtitle") ||
            "Schemes and subsidies available in your region"}
        </p>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse p-4 border rounded-lg bg-muted/20 h-40"
            >
              <div className="h-6 w-1/3 bg-muted mb-3 rounded"></div>
              <div className="h-4 w-2/3 bg-muted mb-2 rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500 space-y-4">
          <p>
            {error instanceof Error ? error.message : "Failed to load schemes."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
          >
            {t("retry") || "Retry"}
          </button>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {displaySchemes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {t("noSchemes") ||
                  "No schemes available at the moment. Please check back later."}
              </p>
            </div>
          ) : (
            displaySchemes.map((scheme, index) => (
              <motion.div key={scheme.id || index} variants={item}>
                <Card
                  className="h-full hover:shadow-lg transition-shadow duration-300"
                  data-testid={`card-scheme-${index}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-xl font-semibold">
                        {scheme.schemeName}
                      </CardTitle>
                      <Badge className={getCategoryColor(scheme.category)}>
                        {scheme.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {scheme.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-chart-2" />
                        {t("eligibility")}
                      </h4>
                      <p className="text-sm text-muted-foreground pl-6">
                        {scheme.eligibility}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Award className="h-4 w-4 text-chart-1" />
                        {t("benefits")}
                      </h4>
                      <p className="text-sm text-muted-foreground pl-6">
                        {scheme.benefits}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-chart-4" />
                        {t("howToApply")}
                      </h4>
                      <p className="text-sm text-muted-foreground pl-6">
                        {scheme.howToApply}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
