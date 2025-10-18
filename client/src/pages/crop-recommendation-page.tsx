import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import {
  Sprout,
  Loader2,
  TrendingUp,
  IndianRupee,
  Thermometer,
} from "lucide-react";
import { soilTypes, climateTypes } from "@/data/india-locations";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function CropRecommendationPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    soilType: "",
    climate: "",
    budget: "",
  });

  const [recommendations, setRecommendations] = useState<any>(null);

  const recommendMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/crop-recommend", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setRecommendations(data);
      toast({
        title: "Recommendations Ready",
        description: "AI has generated crop suggestions for you",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Recommendation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recommendMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-3xl font-display font-bold text-foreground flex items-center gap-2"
          data-testid="text-crop-title"
        >
          <Sprout className="h-8 w-8 text-primary" />
          {t("cropRecommendation")}
        </h1>
        <p className="text-muted-foreground mt-1">
          Get AI-powered crop suggestions based on your conditions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card data-testid="card-crop-form">
            <CardHeader>
              <CardTitle>Your Farm Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="soil-type">{t("soilType")}</Label>
                  <Select
                    value={formData.soilType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, soilType: value })
                    }
                    required
                  >
                    <SelectTrigger
                      id="soil-type"
                      data-testid="select-soil-type"
                    >
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map((soil) => (
                        <SelectItem key={soil.value} value={soil.value}>
                          {soil.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="climate">{t("climate")}</Label>
                  <Select
                    value={formData.climate}
                    onValueChange={(value) =>
                      setFormData({ ...formData, climate: value })
                    }
                    required
                  >
                    <SelectTrigger id="climate" data-testid="select-climate">
                      <SelectValue placeholder="Select climate type" />
                    </SelectTrigger>
                    <SelectContent>
                      {climateTypes.map((climate) => (
                        <SelectItem key={climate.value} value={climate.value}>
                          {climate.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">{t("budget")}</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Enter budget in rupees"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    required
                    data-testid="input-budget"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={recommendMutation.isPending}
                  data-testid="button-get-recommendation"
                >
                  {recommendMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("getCropRecommendation")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="h-full" data-testid="card-crop-results">
            <CardHeader>
              <CardTitle>{t("recommendedCrops")}</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendMutation.isPending ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Analyzing with AI...</p>
                </div>
              ) : recommendations ? (
                <div className="space-y-4">
                  {/* Sample recommendations - will be replaced with AI data */}
                  {recommendations?.crops &&
                    recommendations.crops.map((crop: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-muted rounded-lg space-y-2"
                        data-testid={`crop-recommendation-${index}`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Sprout className="h-5 w-5 text-primary" />
                            {crop.name}
                          </h3>
                          <span className="text-sm font-mono text-chart-2">
                            {crop.suitability}% match
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span>Profit: {crop.profit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-muted-foreground" />
                            <span>Season: {crop.season}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      Budget Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Based on your budget of ₹{formData.budget}, rice
                      cultivation would provide the best returns with an
                      estimated profit margin of 40-50%.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sprout className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Fill in your farm details to get AI-powered crop
                    recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
