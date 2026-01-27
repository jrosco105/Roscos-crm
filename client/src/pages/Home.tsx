import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BarChart3, LogIn, Settings } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated && user?.role === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Rosco's Moving CRM</h1>
            <p className="text-lg text-muted-foreground">Streamline your moving business operations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Dashboard
                </CardTitle>
                <CardDescription>View business metrics and manage operations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Go to Dashboard</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/quote")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Quote Calculator
                </CardTitle>
                <CardDescription>Generate instant quotes for customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Open Calculator</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/settings")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
                <CardDescription>Configure pricing, crew, and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Go to Settings</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-foreground mb-4">Rosco's Moving CRM</h1>
        <p className="text-lg text-muted-foreground mb-8">Professional moving company management platform</p>
        <a href={getLoginUrl()}>
          <Button size="lg" className="w-full gap-2">
            <LogIn className="h-5 w-5" />
            Sign In to Continue
          </Button>
        </a>
      </div>
    </div>
  );
}
