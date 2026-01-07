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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cohorts" component={Cohorts} />
      <Route path="/resources" component={Resources} />
      <Route path="/community" component={Community} />
      <Route path="/events" component={Events} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
