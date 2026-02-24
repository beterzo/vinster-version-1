import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useOrganisation } from "@/contexts/OrganisationContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

interface OrgType {
  id: string;
  slug: string;
  name: string;
  intro_text: string | null;
  is_unique: boolean;
}

const OrganisatieLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setOrganisation } = useOrganisation();

  const [orgType, setOrgType] = useState<OrgType | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const fetchOrgType = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("organisation_types")
        .select("id, slug, name, intro_text, is_unique")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      setOrgType(data);
      setLoading(false);
    };
    fetchOrgType();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Vul een toegangscode in.");
      return;
    }

    setValidating(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "validate-organisation-code",
        { body: { code: code.trim() } }
      );

      if (fnError || !data?.success) {
        setError(data?.error || "Deze code is niet geldig of niet meer actief.");
        setValidating(false);
        return;
      }

      // Store organisation context
      setOrganisation({
        organisationTypeId: data.organisation_type_id,
        accessCodeId: data.access_code_id,
        slug: data.organisation?.slug || slug || null,
        name: data.organisation?.name || null,
      });

      // Redirect to signup with org context
      navigate(`/signup?org=${slug}`);
    } catch {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vinster-blue" />
      </div>
    );
  }

  if (!orgType) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="bg-vinster-blue py-6">
          <div className="container mx-auto px-4">
            <img
              src="/lovable-uploads/vinster-new-logo.png"
              alt="Vinster Logo"
              className="h-10 cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-vinster-blue mb-4">Organisatie niet gevonden</h1>
          <p className="text-muted-foreground mb-6">
            Dit organisatietype bestaat niet of is niet actief.
          </p>
          <Button onClick={() => navigate("/organisaties")}>Bekijk alle organisaties</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isErasmusMC = orgType.is_unique && orgType.slug === "erasmus-mc";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className={`py-6 ${isErasmusMC ? "bg-[#00205B]" : "bg-vinster-blue"}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <img
            src="/lovable-uploads/vinster-new-logo.png"
            alt="Vinster Logo"
            className="h-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-vinster-blue mb-4">{orgType.name}</h1>

        {orgType.intro_text && (
          <p className="text-muted-foreground mb-8 whitespace-pre-line">{orgType.intro_text}</p>
        )}

        {!orgType.intro_text && (
          <p className="text-muted-foreground mb-8">
            Welkom bij het Vinster loopbaantraject voor medewerkers van {orgType.name}. 
            Vul hieronder je toegangscode in om te starten.
          </p>
        )}

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Toegangscode invoeren</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Voer je toegangscode in"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                className="text-base"
                maxLength={50}
              />
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
            <Button type="submit" disabled={validating} className="w-full">
              {validating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Controleren...
                </>
              ) : (
                "Toegang krijgen"
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrganisatieLanding;
