import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import * as gemini from "./gemini";

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Dashboard endpoint - AI-generated analytics
  app.get("/api/dashboard", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const profile = await storage.getFarmerProfile(req.user!.id);
      if (!profile) return res.status(404).send("Farmer profile not found");

      const dashboardData = await gemini.getDashboardData(
        profile.state,
        profile.district,
      );
      res.json(dashboardData);
    } catch (error) {
      next(error);
    }
  });

  // News endpoints
  app.get("/api/news", async (req, res, next) => {
    try {
      const { state, language, lang, category } = req.query;
      // Accept both 'lang' and 'language' query parameters for compatibility
      const languageParam = (language || lang) as string;

      // Get existing news from database
      let news = await storage.getNews(
        state as string,
        languageParam,
        category as string,
      );

      // If no news exists, generate some with AI
      if (news.length === 0 && req.isAuthenticated()) {
        const profile = await storage.getFarmerProfile(req.user!.id);
        const userState = profile?.state || "maharashtra";
        const userLanguage = profile?.preferredLanguage || "en";

        // Generate 3 news articles
        for (let i = 0; i < 3; i++) {
          const categories = ["schemes", "weather", "market", "technology"];
          const aiNews = await gemini.generateNews(
            userState,
            userLanguage,
            categories[i % categories.length],
          );

          await storage.createNewsArticle({
            state: userState,
            language: userLanguage,
            title: aiNews.title || "Agricultural Update",
            summary: aiNews.summary || "Latest farming news",
            content: aiNews.content || "Detailed information coming soon",
            category: categories[i % categories.length],
            imageUrl: null,
          });
        }

        news = await storage.getNews(
          state as string,
          languageParam,
          category as string,
        );
      }

      res.json(news);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/news/:id", async (req, res, next) => {
    try {
      const newsId = parseInt(req.params.id);

      // Validate ID
      if (isNaN(newsId)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }

      // Fetch news article from your storage or DB
      const article = await storage.getNewsById(newsId);

      if (!article) {
        // ❌ Don't use multiple params in send()
        // ✅ Instead, send JSON or a message
        return res.status(404).json({
          error: "News article not found",
          id: newsId,
        });
      }

      // ✅ Return the article
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      next(error);
    }
  });

  // Disease detection endpoint
  app.post(
    "/api/disease-detect",
    upload.single("image"),
    async (req, res, next) => {
      try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        if (!req.file) return res.status(400).send("No image uploaded");

        const imageBase64 = req.file.buffer.toString("base64");

        // Use Gemini AI to detect disease
        const result = await gemini.detectDisease(imageBase64);

        // Save detection to database
        const detection = await storage.createDiseaseDetection({
          userId: req.user!.id,
          imagePath: `data:image/jpeg;base64,${imageBase64.substring(0, 100)}...`, // Store reference
          diseaseName: result.diseaseName,
          confidence: result.confidence,
          treatment: result.treatment,
          aiResponse: result,
        });

        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  // Crop recommendation endpoint
  app.post("/api/crop-recommend", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const profile = await storage.getFarmerProfile(req.user!.id);
      if (!profile) return res.status(404).send("Farmer profile not found");

      const { soilType, climate, budget, area } = req.body;
      
      // Validate required fields
      if (!soilType || !climate) {
        return res.status(400).json({ error: "soilType and climate are required" });
      }
      
      // Accept both 'budget' and 'area' - if area is provided, use it as budget estimate
      const budgetParam = budget || (area ? `${area}` : "50000");

      // Get AI recommendations
      const recommendations = await gemini.getCropRecommendations({
        soilType,
        climate,
        budget: budgetParam,
        state: profile.state,
      });

      // Save to database
      await storage.createCropRecommendation({
        userId: req.user!.id,
        soilType,
        climate,
        budget: budgetParam,
        state: profile.state,
        recommendedCrops: recommendations.crops || [],
        reasoning: recommendations.reasoning || "",
      });

      res.json(recommendations);
    } catch (error) {
      next(error);
    }
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const { message, language } = req.body;

      // Validate required fields
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required" });
      }

      const languageParam = language || "en";

      // Get AI response
      const response = await gemini.getChatResponse(message.trim(), languageParam);

      // Save chat to database
      await storage.createChatMessage({
        userId: req.user!.id,
        message: message.trim(),
        response,
        language: languageParam,
        isVoice: false,
      });

      res.json({ response });
    } catch (error) {
      next(error);
    }
  });

  // Government schemes endpoint
  app.get("/api/schemes", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const profile = await storage.getFarmerProfile(req.user!.id);
      if (!profile) return res.status(404).send("Farmer profile not found");

      // Accept language from query parameter or use profile's preferred language
      const { lang, language } = req.query;
      const languageParam = (language || lang || profile.preferredLanguage) as string;

      // Get existing schemes from database
      let schemes = await storage.getGovernmentSchemes(profile.state, languageParam);

      // If no schemes exist, generate with AI
      if (schemes.length === 0) {
        const aiSchemes = await gemini.getGovernmentSchemes(
          profile.state,
          languageParam,
        );

        for (const scheme of aiSchemes) {
          await storage.createGovernmentScheme({
            state: profile.state,
            language: languageParam,
            schemeName: scheme.schemeName,
            description: scheme.description,
            eligibility: scheme.eligibility,
            benefits: scheme.benefits,
            howToApply: scheme.howToApply,
            category: scheme.category,
          });
        }

        schemes = await storage.getGovernmentSchemes(profile.state, languageParam);
      }

      res.json(schemes);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
