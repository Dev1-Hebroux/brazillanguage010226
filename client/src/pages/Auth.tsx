import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    let success: boolean;
    if (isLogin) {
      success = await login(username, password);
    } else {
      success = await register(username, password);
    }
    setSubmitting(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md rounded-2xl shadow-2xl border-none">
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-green-500 to-yellow-400 rounded-t-2xl" />
          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-3xl font-heading font-bold" data-testid="auth-title">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {isLogin
                ? "Sign in to access your cohort and track your progress"
                : "Join Horizonte Café to start your English journey"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-bold text-sm">Username</Label>
                <Input
                  id="username"
                  data-testid="input-username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-sm">Password</Label>
                <Input
                  id="password"
                  data-testid="input-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 rounded-xl"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-bold text-sm">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    data-testid="input-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl"
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg" data-testid="text-error">{error}</p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                data-testid="button-submit"
                className="w-full h-14 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  data-testid="button-toggle-auth"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="ml-2 text-primary font-bold hover:underline"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
