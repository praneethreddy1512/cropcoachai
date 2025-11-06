import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Droplets,
  Sun,
  IndianRupee,
  Activity,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // ✅ Fix: Add proper queryFn to actually fetch data
  const {
    data: dashboardData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch("/api/dashboard", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
  });

  // ✅ Use API data with fallback mock data
  const cropHealthData = dashboardData?.cropHealthTrend || [
    { month: "Jan", health: 85 },
    { month: "Feb", health: 88 },
    { month: "Mar", health: 92 },
    { month: "Apr", health: 78 },
    { month: "May", health: 95 },
    { month: "Jun", health: 90 },
  ];

  const marketPricesData = dashboardData?.marketPrices || [
    { crop: "Rice", price: 2500 },
    { crop: "Wheat", price: 2100 },
    { crop: "Cotton", price: 5600 },
    { crop: "Maize", price: 1800 },
    { crop: "Sugarcane", price: 3200 },
  ];

  // Extract metric values from API data with fallbacks
  const cropHealth = dashboardData?.cropHealth ?? 92;
  const soilMoisture = dashboardData?.soilMoisture ?? 68;
  const temperature = dashboardData?.temperature ?? 28;
  const marketPrice = dashboardData?.marketPrice ?? 2500;
  const weatherCondition = dashboardData?.weatherCondition ?? "Sunny, low rainfall";

  // Animation variants
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2
          className="h-8 w-8 animate-spin text-primary"
          data-testid="loading-dashboard"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-12">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-3xl font-display font-bold text-foreground"
          data-testid="text-dashboard-title"
        >
          {t("dashboard")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("farmAnalytics")}</p>
      </motion.div>

      {/* Metric Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: t("cropHealth"),
            value: `${cropHealth}%`,
            icon: <Activity className="h-4 w-4 text-muted-foreground" />,
            subtext: (
              <>
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {cropHealthData.length > 1 && cropHealthData[0].health > cropHealthData[1].health ? "+" : ""}
                {cropHealthData.length > 1 ? Math.abs(cropHealthData[0].health - cropHealthData[1].health) : "5"}% from last month
              </>
            ),
            color: "text-chart-2",
          },
          {
            title: "Soil Moisture",
            value: `${soilMoisture}%`,
            icon: <Droplets className="h-4 w-4 text-muted-foreground" />,
            subtext: soilMoisture > 50 && soilMoisture < 80 ? "Optimal range" : "Needs attention",
            color: "text-chart-1",
          },
          {
            title: t("weatherForecast"),
            value: `${temperature}°C`,
            icon: <Sun className="h-4 w-4 text-muted-foreground" />,
            subtext: weatherCondition,
            color: "text-chart-3",
          },
          {
            title: t("marketPrices"),
            value: `₹${marketPrice.toLocaleString()}`,
            icon: <IndianRupee className="h-4 w-4 text-muted-foreground" />,
            subtext: "Average crop price",
            color: "text-chart-4",
          },
        ].map((card, index) => (
          <motion.div key={index} variants={item}>
            <Card className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground">{card.subtext}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Health Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Crop Health Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cropHealthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="health"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Market Prices */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Market Prices (₹/quintal)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketPricesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="crop" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar
                  dataKey="price"
                  fill="hsl(var(--chart-1))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t("recentActivity")}</h3>
          <div className="space-y-4">
            {(
              dashboardData?.recentActivity || [
                {
                  action: "Disease detected in wheat crop",
                  time: "2 hours ago",
                  status: "warning",
                },
                {
                  action: "Crop recommendation received",
                  time: "1 day ago",
                  status: "success",
                },
                {
                  action: "Government scheme available",
                  time: "3 days ago",
                  status: "info",
                },
              ]
            ).map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover-elevate"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "warning"
                        ? "bg-chart-3"
                        : activity.status === "success"
                          ? "bg-chart-2"
                          : "bg-chart-1"
                    }`}
                  />
                  <span className="text-sm">{activity.action}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
