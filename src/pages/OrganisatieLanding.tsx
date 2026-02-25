import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useOrganisation } from "@/contexts/OrganisationContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Loader2, ArrowRight, Building2, KeyRound } from "lucide-react";

interface OrgType {
  id: string;
  slug: string;
  name: string;
  intro_text: string | null;
  is_unique: boolean;
}

interface ChildOrg {
  id: string;
  slug: string;
  name: string;
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
  const [childOrgs, setChildOrgs] = useState<ChildOrg[]>([]);

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

      // If this is a category (not unique), fetch child organisations
      if (data && !data.is_unique) {
        const { data: children } = await supabase
          .from("organisation_types")
          .select("id, slug, name, parent_type_id")
          .eq("is_active", true);
        // Filter client-side since parent_type_id is not yet in generated types
        const filtered = (children || []).filter(
          (c: any) => c.parent_type_id === data.id
        );
        setChildOrgs(filtered);
      }

      setLoading(false);
    };
    fetchOrgType();
  }, [slug]);

  // --- Code submission for specific orgs (is_unique = true) ---
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
      navigate(`/organisaties/${slug}/intro`);
    } catch {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setValidating(false);
    }
  };

  // --- Free start for category orgs (is_unique = false) ---
  const handleFreeStart = () => {
    if (!orgType) return;
    setOrganisation({
      organisationTypeId: orgType.id,
      accessCodeId: null,
      slug: slug || null,
      name: orgType.name,
    });
    navigate(`/organisaties/${slug}/intro`);
  };

  // --- Header (shared) ---
  const Header = () => (
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
  );

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
        <Header />
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

  // =============================================
  // CATEGORY VIEW (is_unique = false)
  // =============================================
  if (!orgType.is_unique) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full space-y-8">
          {/* Section 1: Intro + Start */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {orgType.name}
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {orgType.intro_text ||
                `Ontdek welke functies binnen een ${orgType.name.toLowerCase()} bij jou passen. Vinster helpt je om inzicht te krijgen in jouw mogelijkheden.`}
            </p>

            <Button
              onClick={handleFreeStart}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 px-8 text-base"
            >
              Start het traject
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Section 2: Specific organisations */}
          {childOrgs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-6 w-6 text-blue-900" />
                <h2 className="text-xl font-semibold text-blue-900">
                  Hoor je bij een specifieke organisatie?
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Als je van jouw organisatie een toegangscode hebt ontvangen, kun je die hier gebruiken voor een traject op maat.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {childOrgs.map((child) => (
                  <div
                    key={child.id}
                    className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <KeyRound className="h-5 w-5 text-blue-900/60" />
                      <span className="font-medium text-blue-900">{child.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/organisaties/${child.slug}`)}
                      className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
                    >
                      Vul code in
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    );
  }

  // =============================================
  // SPECIFIC ORG VIEW (is_unique = true) — existing code form
  // =============================================
  const isErasmusMC = orgType.slug === "erasmus-mc";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className={`bg-white rounded-2xl shadow-sm border p-8 md:p-12 ${isErasmusMC ? "border-[#00205B]/20" : "border-gray-100"}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{orgType.name}</h1>

          {orgType.intro_text && (
            <p className="text-lg text-gray-700 leading-relaxed mb-8 whitespace-pre-line">{orgType.intro_text}</p>
          )}

          {!orgType.intro_text && isErasmusMC && (
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Welkom bij Vinster voor ErasmusMC. Ontdek welke functies bij jou passen binnen het Erasmus MC.
            </p>
          )}

          {!orgType.intro_text && !isErasmusMC && (
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
