import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Check, ChevronDown, User2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganisation } from "@/contexts/OrganisationContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrganisationType {
  id: string;
  slug: string;
  name: string;
  is_unique: boolean;
  parent_type_id: string | null;
}

const OrganisationSwitcher = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isOrganisationMode,
    name: currentName,
    organisationTypeId,
    accessCodeId,
    setOrganisation,
    clearOrganisation,
  } = useOrganisation();
  const [types, setTypes] = useState<OrganisationType[]>([]);
  const [loading, setLoading] = useState(true);

  // Users who entered via a specific organisation access code (e.g. ErasmusMC)
  // are contractually tied to that organisation. They should not be able to
  // switch ingang — their seat is paid for by the org.
  const isLockedToOrganisation = isOrganisationMode && !!accessCodeId;

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("organisation_types")
        .select("id, slug, name, is_unique, parent_type_id")
        .eq("is_active", true)
        .is("parent_type_id", null)
        .order("name");
      if (!error && data) setTypes(data as OrganisationType[]);
      setLoading(false);
    };
    load();
  }, []);

  const switchTo = (t: OrganisationType) => {
    if (t.id === organisationTypeId) return;
    setOrganisation({
      organisationTypeId: t.id,
      accessCodeId: null,
      slug: t.slug,
      name: t.name,
      code: null,
    });
    toast({
      title: "Ingang gewisseld",
      description: `Je nieuwe rondes zijn gekoppeld aan ${t.name}.`,
    });
    navigate("/home");
  };

  const switchToParticulier = () => {
    if (!isOrganisationMode) return;
    clearOrganisation();
    toast({
      title: "Ingang gewisseld",
      description: "Je nieuwe rondes zijn gekoppeld aan de algemene versie (geen organisatie).",
    });
    navigate("/home");
  };

  const buttonLabel = isOrganisationMode && currentName ? currentName : "Algemeen";

  // Locked-in users: show a static badge, no dropdown.
  if (isLockedToOrganisation) {
    return (
      <div
        className="inline-flex items-center gap-2 text-sm font-medium bg-[#FEF9E6] text-[#232D4B] px-3 py-1.5 rounded-full border border-[#f0e6b8]"
        title="Je bent ingelogd via een organisatiecode"
      >
        <Building2 className="w-3.5 h-3.5" />
        <span className="max-w-[200px] truncate">{buttonLabel}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center gap-2 text-sm font-medium bg-[#FEF9E6] text-[#232D4B] px-3 py-1.5 rounded-full border border-[#f0e6b8] hover:bg-[#fcf3d0] transition-colors"
          aria-label="Wissel van ingang"
        >
          {isOrganisationMode ? (
            <Building2 className="w-3.5 h-3.5" />
          ) : (
            <User2 className="w-3.5 h-3.5" />
          )}
          <span className="max-w-[160px] truncate">{buttonLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white">
        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
          Wissel van ingang
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={switchToParticulier}
          className="cursor-pointer"
        >
          <User2 className="w-4 h-4 mr-2" />
          <span className="flex-1">Algemeen (geen organisatie)</span>
          {!isOrganisationMode && <Check className="w-4 h-4 text-[#232D4B]" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="px-2 py-1.5 text-xs text-gray-400">Laden...</div>
        ) : (
          types.map((t) => (
            <DropdownMenuItem
              key={t.id}
              onClick={() => switchTo(t)}
              className="cursor-pointer"
            >
              <Building2 className="w-4 h-4 mr-2" />
              <span className="flex-1">{t.name}</span>
              {organisationTypeId === t.id && (
                <Check className="w-4 h-4 text-[#232D4B]" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganisationSwitcher;
