import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid email or password");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(248,250%,98%)] from-background via-background to-primary/5 p-4">
      <Card className="w-full bg-white border-[hsl(214,20%,88%)] max-w-md shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-[hsl(216,32%,17%)]">
              Employee Portal
            </CardTitle>
            <CardDescription className="text-[hsl(216,20%,45%)]">
              Sign in with your employee credentials
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className=" text-[hsl(216,32%,17%)]">Email Address</Label>
              <Input
                className="shadow-none text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)]"
                id="email"
                type="email"
                placeholder="your.email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[hsl(216,32%,17%)]">Password</Label>
              <div className="relative">
                <Input
                  className="shadow-none text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)]"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute  right-0 top-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="cursor-pointer w-full rounded-[10px] bg-gradient-to-r from-[hsl(214,84%,56%)] to-[hsl(214,100%,70%)] text-white shadow-elegant"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
           <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-[hsl(216,20%,45%)]">Demo Credentials:</p>
              <div className="space-y-1 text-[hsl(216,20%,45%)] text-xs">
                <p>
                  <strong>Admin:</strong> admin@company.com / admin123
                </p>
                <p>
                  <strong>Sales:</strong> sales@company.com / sales123
                </p>
                <p>
                  <strong>Inventory:</strong> inventory@company.com /
                  inventory123
                </p>
              </div>
            </div>
          </div> 

           <div className="mt-4 text-center">
            <p className="text-sm text-[hsl(216,20%,45%)] mb-2">
              Customer? Access your account:
            </p>
            <Button
              variant="outline"
              className="cursor-pointer bg-[hsl(248,250%,98%)] text-[hsl(216,32%,17%)] border-[hsl(214,20%,88%)] rounded-[10px] w-full hover:bg-[hsl(248,250%,96%)] "
              onClick={() => (window.location.href = "/customer")}
            >
              Customer Login
            </Button>
          </div> 
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
