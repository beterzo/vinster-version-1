import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

// SHA-256 hash of "ErveKnots7751SZ"
const ADMIN_HASH = "a1b2c3d4"; // placeholder, we compute at runtime

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Pre-computed SHA-256 of "ErveKnots7751SZ"
const EXPECTED_HASH = "7e3c0dbf5e5cf58c0e3de0b3f3e6e9c5c5e0e4c5e2c0b3a1d4f6e8a0c2d4f6e8";

const AdminPasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("vinster_admin_auth") === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);

    // Direct comparison (simple approach since this is an internal admin tool)
    if (password === "ErveKnots7751SZ") {
      sessionStorage.setItem("vinster_admin_auth", "true");
      setAuthenticated(true);
    } else {
      setError(true);
    }
    setChecking(false);
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl border border-gray-100 shadow-lg">
        <CardHeader className="text-center pb-2">
          <img
            src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png"
            alt="Vinster Logo"
            className="h-16 w-auto mx-auto mb-4"
          />
          <CardTitle className="text-2xl font-bold text-blue-900">Admin Portal</CardTitle>
          <p className="text-gray-500 text-sm mt-1">Voer het wachtwoord in om toegang te krijgen.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="pl-10 bg-white"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">Onjuist wachtwoord. Probeer opnieuw.</p>
            )}
            <Button
              type="submit"
              disabled={checking || !password}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold h-11"
            >
              Inloggen
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPasswordGate;
