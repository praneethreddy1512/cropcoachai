import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Loader2, CheckCircle2, FileText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SchemesPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  // Fetch government schemes based on user's state and language
  const { data: schemes, isLoading } = useQuery({
    queryKey: ["/api/schemes", i18n.language],
    enabled: !!user,
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

  // Use AI-generated schemes from API
  const displaySchemes = schemes || [];

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
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2" data-testid="text-schemes-title">
          <Award className="h-8 w-8 text-primary" />
          {t("governmentSchemes")}
        </h1>
        <p className="text-muted-foreground mt-1">
          Schemes and subsidies available in your region
        </p>
      </motion.div>

      {/* Schemes Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loading-schemes" />
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
              <p className="text-muted-foreground">No schemes available at the moment. Please check back later.</p>
            </div>
          ) : 
            displaySchemes.map((scheme, index) => (
              <motion.div key={scheme.id || index} variants={item}>
                <Card className="h-full hover-elevate" data-testid={`card-scheme-${index}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-xl">{scheme.schemeName}</CardTitle>
                      <Badge className={getCategoryColor(scheme.category)}>
                        {scheme.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{scheme.description}</p>
                  </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-chart-2" />
                      {t("eligibility")}
                    </h4>
                    <p className="text-sm text-muted-foreground pl-6">{scheme.eligibility}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Award className="h-4 w-4 text-chart-1" />
                      {t("benefits")}
                    </h4>
                    <p className="text-sm text-muted-foreground pl-6">{scheme.benefits}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-chart-4" />
                      {t("howToApply")}
                    </h4>
                    <p className="text-sm text-muted-foreground pl-6">{scheme.howToApply}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
