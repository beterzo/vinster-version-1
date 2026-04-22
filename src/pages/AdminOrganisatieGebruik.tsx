import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrgRow {
  org_id: string;
  org_name: string;
  monthly: Record<string, number>;
  total: number;
}

interface StatsResponse {
  monthly_columns: string[];
  total_usage: { monthly: Record<string, number>; total: number };
  branch_stats: OrgRow[];
  unique_org_stats: OrgRow[];
}

const AdminOrganisatieGebruik = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("admin-organisation-stats");
        if (error) throw error;
        setStats(data as StatsResponse);
      } catch (err) {
        console.error(err);
        toast({ title: "Fout bij laden data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const exportCSV = () => {
    if (!stats) return;
    const header = ["Categorie", ...stats.monthly_columns, "Totaal"].join(",");
    const lines: string[] = [header];
    lines.push(
      ["Totaal gebruikers", ...stats.monthly_columns.map(m => stats.total_usage.monthly[m] || 0), stats.total_usage.total].join(",")
    );
    lines.push("");
    lines.push("Per organisatietype");
    for (const r of stats.branch_stats) {
      lines.push([`"${r.org_name}"`, ...stats.monthly_columns.map(m => r.monthly[m] || 0), r.total].join(","));
    }
    lines.push("");
    lines.push("Per bedrijf met eigen versie");
    for (const r of stats.unique_org_stats) {
      lines.push([`"${r.org_name}"`, ...stats.monthly_columns.map(m => r.monthly[m] || 0), r.total].join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vinster-gebruik-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a2e5a]" />
      </div>
    );
  }

  const { monthly_columns, total_usage, branch_stats, unique_org_stats } = stats;

  const renderTable = (
    firstColLabel: string,
    rows: { label: string; monthly: Record<string, number>; total: number; bold?: boolean }[]
  ) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-3 text-left font-semibold text-gray-700 min-w-[220px]">{firstColLabel}</th>
            {monthly_columns.map(m => (
              <th key={m} className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{m}</th>
            ))}
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Totaal</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={monthly_columns.length + 2} className="px-6 py-6 text-center text-gray-400">
                Geen data
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className={`px-6 py-3 ${r.bold ? "font-semibold text-gray-900" : "text-gray-700"}`}>{r.label}</td>
                {monthly_columns.map(m => (
                  <td key={m} className={`px-4 py-3 ${r.bold ? "font-medium text-gray-800" : "text-gray-600"}`}>
                    {r.monthly[m] || 0}
                  </td>
                ))}
                <td className={`px-6 py-3 ${r.bold ? "font-bold text-[#1a2e5a]" : "font-semibold text-[#1a2e5a]"}`}>
                  {r.total}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <img
            src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png"
            alt="Vinster Logo"
            className="h-14 w-auto cursor-pointer hover:opacity-80"
            onClick={() => navigate("/")}
          />
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="border-[#1a2e5a] text-[#1a2e5a] hover:bg-[rgba(26,46,90,0.05)] font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Terug naar Admin
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1a2e5a] mb-1">Gebruik</h1>
            <p className="text-gray-600 text-sm">Unieke gebruikers per maand. Testaccounts zijn al uitgefilterd.</p>
          </div>
          <Button
            onClick={exportCSV}
            variant="outline"
            className="border-[#1a2e5a] text-[#1a2e5a] hover:bg-[rgba(26,46,90,0.05)] font-semibold"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <Card className="mb-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
            <h2 className="text-lg font-semibold text-[#1a2e5a]">Totaal gebruikers per maand</h2>
          </div>
          {renderTable("Totaal", [
            { label: "Alle gebruikers", monthly: total_usage.monthly, total: total_usage.total, bold: true },
          ])}
        </Card>

        <Card className="mb-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <h2 className="text-lg font-semibold text-[#1a2e5a]">Per organisatietype</h2>
            <p className="text-sm text-gray-500 mt-0.5">Branches zoals mbo-instelling, hogeschool, zorgorganisatie.</p>
          </div>
          {renderTable(
            "Organisatietype",
            branch_stats.map(r => ({ label: r.org_name, monthly: r.monthly, total: r.total }))
          )}
        </Card>

        <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
            <h2 className="text-lg font-semibold text-[#1a2e5a]">Per bedrijf met eigen versie</h2>
            <p className="text-sm text-gray-500 mt-0.5">Maatwerk-klanten met een eigen Vinster (facturatiebasis).</p>
          </div>
          {renderTable(
            "Bedrijf",
            unique_org_stats.map(r => ({ label: r.org_name, monthly: r.monthly, total: r.total }))
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminOrganisatieGebruik;
