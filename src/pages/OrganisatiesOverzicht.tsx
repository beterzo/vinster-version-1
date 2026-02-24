import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-vinster-blue py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <img
            src="/lovable-uploads/vinster-new-logo.png"
            alt="Vinster Logo"
            className="h-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-vinster-blue mb-2">Organisaties</h1>
        <p className="text-muted-foreground mb-8">
          Kies het type organisatie waarvoor je een toegangscode hebt ontvangen.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Laden...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orgTypes.map((org) => (
              <button
                key={org.id}
                onClick={() => navigate(`/organisaties/${org.slug}`)}
                className="rounded-xl border bg-card p-6 text-left shadow-sm hover:shadow-md hover:border-vinster-blue/40 transition-all"
              >
                <h2 className="text-xl font-semibold text-vinster-blue mb-2">{org.name}</h2>
                {org.intro_text && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{org.intro_text}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrganisatiesOverzicht;
