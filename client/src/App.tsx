import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Cohorts from "@/pages/Cohorts";
import Resources from "@/pages/Resources";
import Community from "@/pages/Community";
import Events from "@/pages/Events";
import CohortDashboard from "@/pages/CohortDashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cohorts" component={Cohorts} />
      <Route path="/resources" component={Resources} />
      <Route path="/community" component={Community} />
      <Route path="/events" component={Events} />
      <Route path="/dashboard" component={CohortDashboard} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
