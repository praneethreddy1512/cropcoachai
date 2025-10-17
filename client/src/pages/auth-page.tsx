import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { Redirect } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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
import { Sprout, Loader2 } from "lucide-react";
import { indianStates, districtsByState, soilTypes } from "@/data/india-locations";
import { RegistrationData } from "@shared/schema";

export default function AuthPage() {
  const { t } = useTranslation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedState, setSelectedState] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Registration form state
  const [regData, setRegData] = useState<RegistrationData>({
    username: "",
    password: "",
    fullName: "",
    state: "",
    district: "",
    village: "",
    phoneNumber: "",
    farmSize: "",
    soilType: "",
    primaryCrop: "",
    preferredLanguage: "en",
  });

  // Redirect if already logged in (after hook calls)
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(regData);
  };

  const districts = selectedState ? districtsByState[selectedState] || [] : [];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-xl">
                <Sprout className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">KrishiAI</h1>
            <p className="text-muted-foreground mt-2">{t("welcome")}</p>
          </motion.div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button
              type="button"
              variant={isLogin ? "default" : "ghost"}
              className="flex-1"
              onClick={() => setIsLogin(true)}
              data-testid="button-login-tab"
            >
              {t("login")}
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "default" : "ghost"}
              className="flex-1"
              onClick={() => setIsLogin(false)}
              data-testid="button-register-tab"
            >
              {t("register")}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">{t("username")}</Label>
                    <Input
                      id="login-username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                      data-testid="input-login-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t("password")}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      data-testid="input-login-password"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-login-submit"
                >
                  {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("login")}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">{t("username")}</Label>
                      <Input
                        id="reg-username"
                        type="text"
                        value={regData.username}
                        onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                        required
                        data-testid="input-register-username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">{t("password")}</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        required
                        data-testid="input-register-password"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-fullname">{t("fullName")}</Label>
                    <Input
                      id="reg-fullname"
                      type="text"
                      value={regData.fullName}
                      onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                      required
                      data-testid="input-register-fullname"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-state">{t("state")}</Label>
                      <Select
                        value={regData.state}
                        onValueChange={(value) => {
                          setRegData({ ...regData, state: value, district: "" });
                          setSelectedState(value);
                        }}
                        required
                      >
                        <SelectTrigger id="reg-state" data-testid="select-register-state">
                          <SelectValue placeholder={t("selectState")} />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-district">{t("district")}</Label>
                      <Select
                        value={regData.district}
                        onValueChange={(value) => setRegData({ ...regData, district: value })}
                        disabled={!selectedState}
                        required
                      >
                        <SelectTrigger id="reg-district" data-testid="select-register-district">
                          <SelectValue placeholder={t("selectDistrict")} />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-village">{t("village")}</Label>
                      <Input
                        id="reg-village"
                        type="text"
                        value={regData.village}
                        onChange={(e) => setRegData({ ...regData, village: e.target.value })}
                        data-testid="input-register-village"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone">{t("phoneNumber")}</Label>
                      <Input
                        id="reg-phone"
                        type="tel"
                        value={regData.phoneNumber}
                        onChange={(e) => setRegData({ ...regData, phoneNumber: e.target.value })}
                        data-testid="input-register-phone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-farmsize">{t("farmSize")}</Label>
                      <Input
                        id="reg-farmsize"
                        type="text"
                        value={regData.farmSize}
                        onChange={(e) => setRegData({ ...regData, farmSize: e.target.value })}
                        data-testid="input-register-farmsize"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-soil">{t("soilType")}</Label>
                      <Select
                        value={regData.soilType}
                        onValueChange={(value) => setRegData({ ...regData, soilType: value })}
                      >
                        <SelectTrigger id="reg-soil" data-testid="select-register-soiltype">
                          <SelectValue placeholder="Select" />
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-crop">{t("primaryCrop")}</Label>
                    <Input
                      id="reg-crop"
                      type="text"
                      value={regData.primaryCrop}
                      onChange={(e) => setRegData({ ...regData, primaryCrop: e.target.value })}
                      data-testid="input-register-primarycrop"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                  data-testid="button-register-submit"
                >
                  {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("register")}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right side - Hero */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 text-center text-primary-foreground space-y-6 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-4xl font-display font-bold mb-4">Smart Farming with AI</h2>
            <p className="text-lg text-primary-foreground/90">
              Get AI-powered crop recommendations, disease detection, multilingual support, and
              real-time agricultural insights tailored to your location.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col gap-4 text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold">Location-Based News</h3>
                <p className="text-sm text-primary-foreground/80">
                  Get agricultural news and schemes specific to your state
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold">AI Disease Detection</h3>
                <p className="text-sm text-primary-foreground/80">
                  Upload crop images for instant disease diagnosis
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold">Multilingual Voice Support</h3>
                <p className="text-sm text-primary-foreground/80">
                  Use the app in Hindi, English, Telugu, Tamil, or Kannada
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
