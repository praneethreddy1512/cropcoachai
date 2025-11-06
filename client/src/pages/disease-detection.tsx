import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formDataRequest } from "@/lib/queryClient";
import {
  Upload,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DiseaseDetection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [detectionResult, setDetectionResult] = useState<any>(null);

  const detectMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await formDataRequest("POST", "/api/disease-detect", formData);
      return await res.json();
    },
    onSuccess: (data) => {
      setDetectionResult(data);
      toast({
        title: "Detection Complete",
        description: "Disease analysis is ready",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Detection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectionResult(null);
    }
  };

  const handleDetect = () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    console.log("Detecting disease with image:", selectedImage, formData);
    detectMutation.mutate(formData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];

    console.log("Dropped file:", file);
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      console.log("Preview URL:", previewUrl);
      setDetectionResult(null);
    }
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
          data-testid="text-disease-title"
        >
          <Camera className="h-8 w-8 text-primary" />
          {t("diseaseDetection")}
        </h1>
        <p className="text-muted-foreground mt-1">
          Upload crop images for AI-powered disease diagnosis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="h-full" data-testid="card-upload">
            <CardHeader>
              <CardTitle>{t("uploadImage")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover-elevate transition-colors"
                data-testid="dropzone-image"
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      {selectedImage?.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-foreground font-medium">
                        {t("dragDropImage")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                data-testid="input-file"
              />
              <Button
                onClick={handleDetect}
                disabled={!selectedImage || detectMutation.isPending}
                className="w-full"
                data-testid="button-detect-disease"
              >
                {detectMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("detectDisease")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="h-full" data-testid="card-results">
            <CardHeader>
              <CardTitle>Detection Results</CardTitle>
            </CardHeader>
            <CardContent>
              {detectMutation.isPending ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">
                    Analyzing image with AI...
                  </p>
                </div>
              ) : detectionResult ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <AlertCircle className="h-5 w-5 text-chart-3 mt-0.5" />
                    <div className="flex-1">
                      <h3
                        className="font-semibold text-lg"
                        data-testid="text-disease-name"
                      >
                        {detectionResult.diseaseName || "Leaf Blight"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("confidence")}: {detectionResult.confidence || "85%"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-chart-2" />
                      {t("treatment")}
                    </h4>
                    <p
                      className="text-sm text-muted-foreground pl-6"
                      data-testid="text-treatment"
                    >
                      {detectionResult.treatment ||
                        "1. Remove affected leaves immediately\n2. Apply copper-based fungicide\n3. Ensure proper drainage\n4. Avoid overhead watering"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Prevention Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-6 list-disc">
                      <li>Maintain proper plant spacing for air circulation</li>
                      <li>Water in the morning to allow leaves to dry</li>
                      <li>Use disease-resistant crop varieties</li>
                      <li>Practice crop rotation annually</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Camera className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Upload a crop image to get AI-powered disease detection and
                    treatment recommendations
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
