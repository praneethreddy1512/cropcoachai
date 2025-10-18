import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import * as gemini from "./gemini";

// Configure multer for image uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
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

      const dashboardData = await gemini.getDashboardData(profile.state, profile.district);
      res.json(dashboardData);
    } catch (error) {
      next(error);
    }
  });

  // News endpoints
  app.get("/api/news", async (req, res, next) => {
    try {
      const { state, language, category } = req.query;
      
      // Get existing news from database
      let news = await storage.getNews(
        state as string, 
        language as string, 
        category as string
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
            categories[i % categories.length]
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

        news = await storage.getNews(state as string, language as string, category as string);
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
      console.log("Fetched article:", article);

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
  app.post("/api/disease-detect", upload.single("image"), async (req, res, next) => {
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
  });

  // Crop recommendation endpoint
  app.post("/api/crop-recommend", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const profile = await storage.getFarmerProfile(req.user!.id);
      if (!profile) return res.status(404).send("Farmer profile not found");

      const { soilType, climate, budget } = req.body;

      // Get AI recommendations
      const recommendations = await gemini.getCropRecommendations({
        soilType,
        climate,
        budget,
        state: profile.state,
      });

      // Save to database
      await storage.createCropRecommendation({
        userId: req.user!.id,
        soilType,
        climate,
        budget,
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

      // Get AI response
      const response = await gemini.getChatResponse(message, language);

      // Save chat to database
      await storage.createChatMessage({
        userId: req.user!.id,
        message,
        response,
        language,
        isVoice: false,
      });

      res.json({ response });
    } catch (error) {
      next(error);
    }
  });

  // Government schemes endpoint
  import express from "express";
  import { createServer } from "http";
  import { storage } from "./storage"; // your DB layer
  import { gemini } from "./gemini";   // your AI service
  import { ensureAuthenticated } from "./middleware/auth"; // optional middleware

  const app = express();

  // ✅ API: Get Government Schemes
  app.get("/api/schemes", ensureAuthenticated, async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.sendStatus(401);

      // ✅ Fetch farmer profile
      const profile = await storage.getFarmerProfile(user.id);
      if (!profile) return res.status(404).json({ message: "Farmer profile not found" });

      // ✅ Determine language priority
      const language = req.query.lang || profile.preferredLanguage || "en";

      // ✅ Fetch from DB
      let schemes = await storage.getGovernmentSchemes(profile.state, language);

      // ✅ If no schemes found, generate via AI and store
      if (!schemes || schemes.length === 0) {
        console.log(`[AI] Generating new schemes for ${profile.state} (${language})`);

        const aiSchemes = await gemini.getGovernmentSchemes(profile.state, language);

        // Store AI-generated results
        for (const scheme of aiSchemes) {
          await storage.createGovernmentScheme({
            state: profile.state,
            language,
            schemeName: scheme.schemeName,
            description: scheme.description,
            eligibility: scheme.eligibility,
            benefits: scheme.benefits,
            howToApply: scheme.howToApply,
            category: scheme.category,
          });
        }

        // Re-fetch stored schemes
        schemes = await storage.getGovernmentSchemes(profile.state, language);
      }

      // ✅ Send response
      res.json(schemes);
    } catch (error) {
      console.error("[ERROR] Failed to fetch schemes:", error);
      next(error);
    }
  });

  // ✅ Optional: Authentication middleware example
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) return next();
    return res.sendStatus(401);
  }

  // ✅ Create and export HTTP server
  const httpServer = createServer(app);
  export default httpServer;
