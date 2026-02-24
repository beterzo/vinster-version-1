import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

interface OrgType {
  id: string;
  slug: string;
  name: string;
  intro_text: string | null;
}

const OrganisatiesOverzicht = () => {
  const navigate = useNavigate();
  const [orgTypes, setOrgTypes] = useState<OrgType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgTypes = async () => {
      const { data } = await supabase
        .from("organisation_types")
        .select("id, slug, name, intro_text")
        .eq("is_active", true)
        .order("name");
      setOrgTypes(data || []);
      setLoading(false);
    };
    fetchOrgTypes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
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

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">Organisaties</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Kies het type organisatie waarvoor je een toegangscode hebt ontvangen.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Laden...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orgTypes.map((org) => (
              <div
                key={org.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 flex flex-col"
              >
                <h2 className="text-xl font-semibold text-blue-900 mb-2">{org.name}</h2>
                {org.intro_text && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">{org.intro_text}</p>
                )}
                {!org.intro_text && <div className="flex-1 mb-6" />}
                <Button
                  onClick={() => navigate(`/organisaties/${org.slug}`)}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 w-full"
                >
                  Bekijk
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrganisatiesOverzicht;
