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

      setOrganisation({
        organisationTypeId: data.organisation_type_id,
        accessCodeId: data.access_code_id,
        slug: data.organisation?.slug || slug || null,
        name: data.organisation?.name || null,
      });

      navigate(`/signup?org=${slug}`);
    } catch {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!orgType) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <img
                src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png"
                alt="Vinster Logo"
                className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                onClick={() => navigate("/")}
              />
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
              >
                Terug naar home
              </Button>
            </div>
          </div>
        </div>
        <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h1 className="text-2xl font-bold text-blue-900 mb-4">Organisatie niet gevonden</h1>
            <p className="text-gray-700 mb-6">
              Dit organisatietype bestaat niet of is niet actief.
            </p>
            <Button
              onClick={() => navigate("/organisaties")}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 px-8"
            >
              Bekijk alle organisaties
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isErasmusMC = orgType.is_unique && orgType.slug === "erasmus-mc";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <img
              src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png"
              alt="Vinster Logo"
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => navigate("/")}
            />
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
            >
              Terug naar home
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className={`bg-white rounded-2xl shadow-sm border p-8 md:p-12 ${isErasmusMC ? "border-[#00205B]/20" : "border-gray-100"}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{orgType.name}</h1>

          {orgType.intro_text && (
            <p className="text-lg text-gray-700 leading-relaxed mb-8 whitespace-pre-line">{orgType.intro_text}</p>
          )}

          {!orgType.intro_text && (
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Welkom bij het Vinster loopbaantraject voor medewerkers van {orgType.name}.
              Vul hieronder je toegangscode in om te starten.
            </p>
          )}

          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-1">Jouw toegangscode</h2>
            <p className="text-sm text-gray-600 mb-4">Vul de code in die je van je organisatie hebt ontvangen.</p>
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
                  className="text-base h-12 bg-white"
                  maxLength={50}
                />
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </div>
              <Button
                type="submit"
                disabled={validating}
                className="bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 w-full"
              >
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrganisatieLanding;
