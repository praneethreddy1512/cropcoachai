import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { Send, Mic, MicOff, Loader2, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  language: string;
  timestamp: Date;
}

export default function AIChat() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang =
        i18n.language === "en"
          ? "en-US"
          : i18n.language === "hi"
            ? "hi-IN"
            : i18n.language === "te"
              ? "te-IN"
              : i18n.language === "ta"
                ? "ta-IN"
                : i18n.language === "kn"
                  ? "kn-IN"
                  : "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice input failed",
          description: "Please try again",
          variant: "destructive",
        });
      };
    }
  }, [i18n.language, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; language: string }) => {
      const res = await apiRequest("POST", "/api/chat", data);
      return await res.json();
    },
    onSuccess: (data) => {
      const aiMessage: ChatMessage = {
        role: "ai",
        content: data.response,
        language: i18n.language,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // ✅ Fixed Text-to-Speech for AI response
      if ("speechSynthesis" in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(data.response);

        utterance.lang =
          i18n.language === "en"
            ? "en-US"
            : i18n.language === "hi"
              ? "hi-IN"
              : i18n.language === "te"
                ? "te-IN"
                : i18n.language === "ta"
                  ? "ta-IN"
                  : i18n.language === "kn"
                    ? "kn-IN"
                    : "en-US";

        // Stop any ongoing mic and speech
        recognitionRef.current?.stop();
        setIsListening(false);
        synth.cancel();

        // Wait until voices are loaded before speaking
        const speak = () => {
          const voices = synth.getVoices();
          if (voices.length) {
            utterance.voice =
              voices.find((v) => v.lang === utterance.lang) || voices[0];
            setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            synth.speak(utterance);
          } else {
            synth.onvoiceschanged = speak;
          }
        };
        speak();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Chat failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
      language: i18n.language,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate({
      message: inputMessage,
      language: i18n.language,
    });
    setInputMessage("");
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl h-[calc(100vh-8rem)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h1
          className="text-3xl font-display font-bold text-foreground flex items-center gap-2"
          data-testid="text-chat-title"
        >
          <Bot className="h-8 w-8 text-primary" />
          {t("aiAssistant")}
        </h1>
        <p className="text-muted-foreground mt-1">
          Ask questions in your native language with voice support
        </p>
      </motion.div>

      <Card
        className="h-[calc(100%-5rem)] flex flex-col"
        data-testid="card-chat"
      >
        <CardHeader className="border-b">
          <CardTitle className="text-sm text-muted-foreground">
            Language: {i18n.language.toUpperCase()} | Voice:{" "}
            {isListening
              ? "Listening..."
              : isSpeaking
                ? "Speaking..."
                : "Ready"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground max-w-md">
                  {t("askQuestion")} Ask about crops, weather, schemes, or
                  farming techniques in your language.
                </p>
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  data-testid={`message-${index}`}
                >
                  {message.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-accent-foreground" />
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {chatMutation.isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="border-t p-4">
          <div className="flex gap-2 w-full">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={t("askQuestion")}
              disabled={chatMutation.isPending || isListening}
              data-testid="input-chat-message"
            />
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleVoiceInput}
              disabled={chatMutation.isPending}
              data-testid="button-voice-input"
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
