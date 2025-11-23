/**
 * App Component
 * 
 * Root application component that sets up routing and global providers.
 * Configures React Query for data fetching and Wouter for client-side routing.
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

/**
 * Router Component
 * Defines all application routes
 */
function Router() {
  return (
    <Switch>
      {/* Home page route */}
      <Route path="/" component={Home} />
      
      {/* 404 fallback for unknown routes */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Main App Component
 * Wraps the application with necessary providers
 */
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
