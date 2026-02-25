import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Plus, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrgStats {
  org_name: string;
  org_id: string;
  parent_type_id: string | null;
  this_month: number;
  last_month: number;
  total: number;
}

interface AccessCode {
  id: string;
  code: string;
  org_name: string;
  uses_count: number;
  max_uses: number | null;
  is_active: boolean;
  last_used_at: string | null;
}

const AdminOrganisatieGebruik = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState<OrgStats[]>([]);
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgTypes, setOrgTypes] = useState<{ id: string; name: string }[]>([]);
  const [newCodeOrgId, setNewCodeOrgId] = useState("");
  const [newCodeMaxUses, setNewCodeMaxUses] = useState("");
  const [generating, setGenerating] = useState(false);
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-organisation-stats");
      if (error) throw error;
      setStats(data?.stats || []);
      setCodes(data?.codes || []);
      setOrgTypes(data?.org_types || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Fout bij laden data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateCode = async () => {
    if (!newCodeOrgId) {
      toast({ title: "Selecteer een organisatie type", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-organisation-code", {
        body: {
          organisation_type_id: newCodeOrgId,
          max_uses: newCodeMaxUses ? parseInt(newCodeMaxUses) : null,
        },
      });
      if (error) throw error;
      toast({ title: `Code aangemaakt: ${data?.code}` });
      setNewCodeOrgId("");
      setNewCodeMaxUses("");
      await fetchData();
    } catch (err) {
      console.error(err);
      toast({ title: "Fout bij genereren code", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const exportCSV = () => {
    const header = "Organisatie,Deze maand,Vorige maand,Totaal";
    const rows = stats.map((s) => `"${s.org_name}",${s.this_month},${s.last_month},${s.total}`);
    const codesHeader = "\n\nCode,Organisatie,Gebruik,Max,Actief,Laatst gebruikt";
    const codeRows = codes.map(
      (c) => `"${c.code}","${c.org_name}",${c.uses_count},${c.max_uses ?? "∞"},${c.is_active ? "Ja" : "Nee"},${c.last_used_at ? new Date(c.last_used_at).toLocaleDateString("nl-NL") : "-"}`
    );
    const csv = [header, ...rows, codesHeader, ...codeRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `organisatie-gebruik-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleBranch = (branchId: string) => {
    setExpandedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(branchId)) next.delete(branchId);
      else next.add(branchId);
      return next;
    });
  };

  // Group stats: branches (parent_type_id === null) and their children
  const branches = stats.filter((s) => !s.parent_type_id);
  const childrenMap = new Map<string, OrgStats[]>();
  stats.filter((s) => s.parent_type_id).forEach((s) => {
    const arr = childrenMap.get(s.parent_type_id!) || [];
    arr.push(s);
    childrenMap.set(s.parent_type_id!, arr);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <img
              src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png"
              alt="Vinster Logo"
              className="h-16 w-auto cursor-pointer hover:opacity-80"
              onClick={() => navigate("/")}
            />
            <Button onClick={() => navigate("/admin")} variant="outline" className="border-[#1a2e5a] text-[#1a2e5a] hover:bg-[rgba(26,46,90,0.05)] font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Terug naar Admin
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Organisatie Gebruik</h1>
            <p className="text-gray-600">Overzicht van organisatie-sessies per branche en organisatie.</p>
          </div>
          <Button onClick={exportCSV} variant="outline" className="border-[#1a2e5a] text-[#1a2e5a] hover:bg-[rgba(26,46,90,0.05)] font-semibold">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        {/* Usage stats with branch grouping */}
        <Card className="mb-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <h2 className="text-lg font-semibold text-blue-900">Gebruik per branche / organisatie</h2>
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Organisatie</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Deze maand</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Vorige maand</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Totaal</th>
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 && stats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Nog geen data</td>
                </tr>
              ) : (
                branches.map((branch) => {
                  const kids = childrenMap.get(branch.org_id) || [];
                  const hasChildren = kids.length > 0;
                  const isExpanded = expandedBranches.has(branch.org_id);

                  // Branch totals = own + children
                  const totalThisMonth = branch.this_month + kids.reduce((s, k) => s + k.this_month, 0);
                  const totalLastMonth = branch.last_month + kids.reduce((s, k) => s + k.last_month, 0);
                  const totalAll = branch.total + kids.reduce((s, k) => s + k.total, 0);

                  return (
                    <React.Fragment key={branch.org_id}>
                      <tr
                        className={`border-b border-gray-50 hover:bg-gray-50 ${hasChildren ? "cursor-pointer" : ""}`}
                        onClick={() => hasChildren && toggleBranch(branch.org_id)}
                      >
                        <td className="px-6 py-3 font-semibold text-gray-900 flex items-center gap-2">
                          {hasChildren && (
                            isExpanded
                              ? <ChevronDown className="w-4 h-4 text-gray-500" />
                              : <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          {branch.org_name}
                          {hasChildren && (
                            <span className="text-xs text-gray-400 ml-1">({kids.length} org{kids.length > 1 ? "s" : ""})</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-gray-700 font-medium">{totalThisMonth}</td>
                        <td className="px-6 py-3 text-gray-700 font-medium">{totalLastMonth}</td>
                        <td className="px-6 py-3 font-bold text-blue-900">{totalAll}</td>
                      </tr>
                      {isExpanded && kids.map((child) => (
                        <tr key={child.org_id} className="border-b border-gray-50 bg-gray-50/50">
                          <td className="px-6 py-2 pl-14 text-gray-700">{child.org_name}</td>
                          <td className="px-6 py-2 text-gray-600">{child.this_month}</td>
                          <td className="px-6 py-2 text-gray-600">{child.last_month}</td>
                          <td className="px-6 py-2 font-semibold text-blue-800">{child.total}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </Card>

        {/* Access codes */}
        <Card className="mb-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <h2 className="text-lg font-semibold text-blue-900">Toegangscodes</h2>
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Code</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Organisatie</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Gebruik</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Max</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actief</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Laatst gebruikt</th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Geen codes gevonden</td>
                </tr>
              ) : (
                codes.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-gray-900">{c.code}</td>
                    <td className="px-6 py-3 text-gray-700">{c.org_name}</td>
                    <td className="px-6 py-3 text-gray-700">{c.uses_count}</td>
                    <td className="px-6 py-3 text-gray-700">{c.max_uses ?? "∞"}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {c.is_active ? "Ja" : "Nee"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {c.last_used_at ? new Date(c.last_used_at).toLocaleDateString("nl-NL") : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

        {/* Generate new code */}
        <Card className="rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Nieuwe toegangscode genereren</h2>
          <div className="flex items-end gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organisatie type</label>
              <Select value={newCodeOrgId} onValueChange={setNewCodeOrgId}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecteer..." />
                </SelectTrigger>
                <SelectContent>
                  {orgTypes.map((ot) => (
                    <SelectItem key={ot.id} value={ot.id}>{ot.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max gebruik</label>
              <Input
                type="number"
                placeholder="∞"
                value={newCodeMaxUses}
                onChange={(e) => setNewCodeMaxUses(e.target.value)}
                className="bg-white"
              />
            </div>
            <Button
              onClick={handleGenerateCode}
              disabled={generating}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold h-10 px-6"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Genereer code
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrganisatieGebruik;
