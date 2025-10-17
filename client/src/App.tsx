import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { Navigation } from "@/components/navigation";
import "./i18n/config";

// Pages
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import NewsPage from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import DiseaseDetection from "@/pages/disease-detection";
import CropRecommendationPage from "@/pages/crop-recommendation-page";
import AIChat from "@/pages/crop-recommendation"; // This is the AI chat page
import SchemesPage from "@/pages/schemes";

function Router() {
  return (
    <Switch>
      {/* Auth Route */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/news" component={NewsPage} />
      <ProtectedRoute path="/news/:id" component={NewsDetail} />
      <ProtectedRoute path="/disease-detection" component={DiseaseDetection} />
      <ProtectedRoute path="/crop-recommendation" component={CropRecommendationPage} />
      <ProtectedRoute path="/ai-chat" component={AIChat} />
      <ProtectedRoute path="/schemes" component={SchemesPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Router />
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
