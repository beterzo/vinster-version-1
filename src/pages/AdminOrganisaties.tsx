import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, ChevronDown, ChevronRight, Plus, ArrowLeft } from "lucide-react";

interface OrgType {
  id: string;
  name: string;
  slug: string;
  is_unique: boolean | null;
  parent_type_id: string | null;
  is_active: boolean | null;
}

interface AccessCode {
  id: string;
  code: string;
  organisation_type_id: string | null;
  uses_count: number | null;
  max_uses: number | null;
  is_active: boolean | null;
  last_used_at: string | null;
}

interface StatsRow {
  org_id: string;
  org_name: string;
  total: number;
  monthly: Record<string, number>;
}

interface StatsResponse {
  monthly_columns: string[];
  branch_stats: StatsRow[];
  unique_org_stats: StatsRow[];
}

const AdminOrganisaties = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orgTypes, setOrgTypes] = useState<OrgType[]>([]);
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [statsById, setStatsById] = useState<Record<string, StatsRow>>({});
  const [currentMonthKey, setCurrentMonthKey] = useState<string>("");
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);

  const [showNewOrgDialog, setShowNewOrgDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgType, setNewOrgType] = useState<"custom" | "general">("general");
  const [newOrgBranch, setNewOrgBranch] = useState("");
  const [newOrgCode, setNewOrgCode] = useState("");
  const [saving, setSaving] = useState(false);

  const [addingCodeForOrg, setAddingCodeForOrg] = useState<string | null>(null);
  const [newCodeValue, setNewCodeValue] = useState("");
  const [savingCode, setSavingCode] = useState(false);

  const branches = orgTypes.filter((ot) => !ot.parent_type_id && !ot.is_unique);
  const uniqueOrgs = orgTypes.filter((ot) => ot.is_unique);
  const childOrgs = orgTypes.filter((ot) => ot.parent_type_id && !ot.is_unique);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [statsRes, orgRes, codesRes] = await Promise.all([
      supabase.functions.invoke("admin-organisation-stats"),
      supabase
        .from("organisation_types")
        .select("id, name, slug, is_unique, parent_type_id, is_active")
        .order("name"),
      supabase
        .from("organisation_access_codes")
        .select("id, code, organisation_type_id, uses_count, max_uses, is_active, last_used_at")
        .order("created_at", { ascending: false }),
    ]);

    if (statsRes.data) {
      const s = statsRes.data as StatsResponse;
      const map: Record<string, StatsRow> = {};
      [...(s.branch_stats || []), ...(s.unique_org_stats || [])].forEach((row) => {
        map[row.org_id] = row;
      });
      setStatsById(map);
      const cols = s.monthly_columns || [];
      setCurrentMonthKey(cols.length > 0 ? cols[cols.length - 1] : "");
    }
    setOrgTypes((orgRes.data as OrgType[]) || []);
    setCodes((codesRes.data as AccessCode[]) || []);
    setLoading(false);
  };

  const getBranchName = (parentId: string | null) => {
    if (!parentId) return "—";
    const branch = orgTypes.find((ot) => ot.id === parentId);
    return branch?.name || "—";
  };

  const getOrgCodes = (orgId: string) => codes.filter((c) => c.organisation_type_id === orgId);

  const getStatsRow = (org: OrgType): StatsRow | null => {
    const direct = statsById[org.id];
    if (direct) return direct;

    // Branches aggregate their own + children in the edge function already.
    return null;
  };

  const getCurrentMonthUsage = (org: OrgType) => {
    const row = getStatsRow(org);
    if (!row || !currentMonthKey) return 0;
    return row.monthly[currentMonthKey] || 0;
  };

  const getTotalUsage = (org: OrgType) => getStatsRow(org)?.total || 0;

  const getOrgTypeLabel = (org: OrgType) => {
    if (org.is_unique) return "Custom";
    if (!org.parent_type_id) return "Branche";
    return "Sub-organisatie";
  };

  const getOrgTypeVariant = (org: OrgType): "default" | "secondary" | "outline" => {
    if (org.is_unique) return "default";
    if (!org.parent_type_id) return "secondary";
    return "outline";
  };

  const handleCreateOrg = async () => {
    if (!newOrgName.trim() || !newOrgBranch) return;
    setSaving(true);

    const slug = newOrgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { error } = await supabase.from("organisation_types").insert({
      name: newOrgName.trim(),
      slug,
      is_unique: newOrgType === "custom",
      parent_type_id: newOrgBranch,
      is_active: true,
    } as any);

    if (error) {
      console.error("Failed to create org:", error);
      setSaving(false);
      return;
    }

    if (newOrgCode.trim()) {
      const { data: newOrg } = await supabase
        .from("organisation_types")
        .select("id")
        .eq("slug", slug)
        .single();

      if (newOrg) {
        await supabase.functions.invoke("generate-organisation-code", {
          body: { organisation_type_id: newOrg.id, code: newOrgCode.trim() },
        });
      }
    }

    setShowNewOrgDialog(false);
    setNewOrgName("");
    setNewOrgType("general");
    setNewOrgBranch("");
    setNewOrgCode("");
    setSaving(false);
    fetchData();
  };

  const handleAddCode = async (orgId: string) => {
    if (!newCodeValue.trim()) return;
    setSavingCode(true);

    await supabase.functions.invoke("generate-organisation-code", {
      body: { organisation_type_id: orgId, code: newCodeValue.trim() },
    });

    setAddingCodeForOrg(null);
    setNewCodeValue("");
    setSavingCode(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  // Present all organisations in a logical order:
  // 1. Branches (is_unique=false, no parent)
  // 2. Their child sub-organisations indented under them
  // 3. Custom unique orgs at the bottom
  const displayRows: { org: OrgType; indent: boolean }[] = [];
  for (const branch of branches) {
    displayRows.push({ org: branch, indent: false });
    const kids = childOrgs.filter((c) => c.parent_type_id === branch.id);
    for (const kid of kids) {
      displayRows.push({ org: kid, indent: true });
    }
  }
  for (const uo of uniqueOrgs) {
    displayRows.push({ org: uo, indent: false });
  }

  const renderCodeDetail = (org: OrgType) => {
    const orgCodes = getOrgCodes(org.id);
    return (
      <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Toegangscodes voor {org.name}
          </h3>
          {addingCodeForOrg === org.id ? (
            <div className="flex items-center gap-2">
              <Input
                value={newCodeValue}
                onChange={(e) => setNewCodeValue(e.target.value)}
                placeholder="Nieuwe code"
                className="h-8 text-sm w-48"
              />
              <Button
                size="sm"
                onClick={() => handleAddCode(org.id)}
                disabled={savingCode || !newCodeValue.trim()}
                className="h-8 bg-blue-900 hover:bg-blue-800 text-white"
              >
                {savingCode ? <Loader2 className="h-3 w-3 animate-spin" /> : "Toevoegen"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAddingCodeForOrg(null);
                  setNewCodeValue("");
                }}
                className="h-8"
              >
                Annuleer
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddingCodeForOrg(org.id)}
              className="h-8"
            >
              <Plus className="h-3 w-3 mr-1" />
              Code toevoegen
            </Button>
          )}
        </div>
        {orgCodes.length === 0 ? (
          <p className="text-sm text-gray-500">Nog geen codes voor deze organisatie.</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Gebruik totaal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Laatst gebruikt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgCodes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm">{c.code}</TableCell>
                    <TableCell className="text-right">
                      {c.uses_count || 0}
                      {c.max_uses ? ` / ${c.max_uses}` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.is_active ? "default" : "destructive"}>
                        {c.is_active ? "Actief" : "Inactief"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {c.last_used_at
                        ? new Date(c.last_used_at).toLocaleDateString("nl-NL")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Terug
          </Button>
          <img
            src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png"
            alt="Vinster Logo"
            className="h-12 w-auto cursor-pointer hover:opacity-80"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Organisaties & Codes</h1>
            <p className="text-gray-600 text-sm mt-1">
              Beheer organisaties en hun toegangscodes.
            </p>
          </div>

          <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Nieuwe organisatie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nieuwe organisatie toevoegen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Organisatienaam</label>
                  <Input
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="bijv. Erasmus MC"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <Select
                    value={newOrgType}
                    onValueChange={(v) => setNewOrgType(v as "custom" | "general")}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom organisatie</SelectItem>
                      <SelectItem value="general">Algemeen abonnement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Branche</label>
                  <Select value={newOrgBranch} onValueChange={setNewOrgBranch}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecteer een branche" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Eerste code (optioneel)
                  </label>
                  <Input
                    value={newOrgCode}
                    onChange={(e) => setNewOrgCode(e.target.value)}
                    placeholder="bijv. molewaterplein"
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleCreateOrg}
                  disabled={saving || !newOrgName.trim() || !newOrgBranch}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    "Organisatie toevoegen"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Organisatienaam</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Branche</TableHead>
                <TableHead className="text-right">Codes</TableHead>
                <TableHead className="text-right">Deze maand</TableHead>
                <TableHead className="text-right">Totaal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    Nog geen organisaties aangemaakt.
                  </TableCell>
                </TableRow>
              )}
              {displayRows.map(({ org, indent }) => {
                const orgCodes = getOrgCodes(org.id);
                const isExpanded = expandedOrg === org.id;
                const canExpand = orgCodes.length > 0 || org.is_unique || !!org.parent_type_id;

                return (
                  <Fragment key={org.id}>
                    <TableRow
                      className={`${canExpand ? "cursor-pointer" : ""} hover:bg-gray-50`}
                      onClick={() => canExpand && setExpandedOrg(isExpanded ? null : org.id)}
                    >
                      <TableCell>
                        {canExpand && (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )
                        )}
                      </TableCell>
                      <TableCell className={`font-medium ${indent ? "pl-10 text-gray-700" : "text-gray-900"}`}>
                        {org.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getOrgTypeVariant(org)}>
                          {getOrgTypeLabel(org)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {getBranchName(org.parent_type_id)}
                      </TableCell>
                      <TableCell className="text-right">{orgCodes.length}</TableCell>
                      <TableCell className="text-right font-medium">{getCurrentMonthUsage(org)}</TableCell>
                      <TableCell className="text-right font-semibold text-blue-900">{getTotalUsage(org)}</TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={7} className="p-0">
                          {renderCodeDetail(org)}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrganisaties;
