import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Loader2, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

interface OrgType {
  id: string;
  name: string;
  parent_type_id: string | null;
}

const AdminVacatures = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orgTypes, setOrgTypes] = useState<OrgType[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    title: "", department: "", description: "", year: "",
  });
  const [importing, setImporting] = useState(false);
  const [replaceMode, setReplaceMode] = useState(true);
  const [stats, setStats] = useState<{ count: number; lastImport: string | null }>({ count: 0, lastImport: null });

  useEffect(() => {
    const fetchOrgTypes = async () => {
      const { data } = await supabase.functions.invoke("admin-organisation-stats");
      setOrgTypes(data?.org_types || []);
      setLoading(false);
    };
    fetchOrgTypes();
  }, []);

  const branches = orgTypes.filter((o) => !o.parent_type_id);
  const children = orgTypes.filter((o) => o.parent_type_id);

  const fetchStats = async (orgId: string) => {
    const { count } = await supabase
      .from("organisation_vacancies")
      .select("id", { count: "exact", head: true })
      .eq("organisation_type_id", orgId);

    const { data: latest } = await supabase
      .from("organisation_vacancies")
      .select("created_at")
      .eq("organisation_type_id", orgId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setStats({ count: count || 0, lastImport: latest?.created_at || null });
  };

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    setFile(null);
    setParsedData([]);
    setHeaders([]);
    setColumnMapping({ title: "", department: "", description: "", year: "" });
    fetchStats(orgId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    Papa.parse(f, {
      preview: 11,
      complete: (result) => {
        if (result.data.length > 0) {
          const h = result.data[0] as string[];
          setHeaders(h);
          setParsedData(result.data.slice(1) as string[][]);
          const mapping: Record<string, string> = { title: "", department: "", description: "", year: "" };
          h.forEach((col) => {
            const lc = col.toLowerCase();
            if (lc.includes("title") || lc.includes("titel") || lc.includes("functie")) mapping.title = col;
            else if (lc.includes("department") || lc.includes("afdeling")) mapping.department = col;
            else if (lc.includes("description") || lc.includes("beschrijving") || lc.includes("omschrijving")) mapping.description = col;
            else if (lc.includes("year") || lc.includes("jaar")) mapping.year = col;
          });
          setColumnMapping(mapping);
        }
      },
    });
  };

  const handleImport = async () => {
    if (!file || !selectedOrgId || !columnMapping.title) {
      toast({ title: "Selecteer minstens de kolom 'Titel'", variant: "destructive" });
      return;
    }

    setImporting(true);
    try {
      const fullResult = await new Promise<Papa.ParseResult<string[]>>((resolve) => {
        Papa.parse(file, { complete: resolve });
      });

      const allHeaders = fullResult.data[0] as string[];
      const rows = fullResult.data.slice(1).filter((r: any) => r.length > 1 && r.some((c: string) => c?.trim()));

      const titleIdx = allHeaders.indexOf(columnMapping.title);
      const deptIdx = columnMapping.department ? allHeaders.indexOf(columnMapping.department) : -1;
      const descIdx = columnMapping.description ? allHeaders.indexOf(columnMapping.description) : -1;
      const yearIdx = columnMapping.year ? allHeaders.indexOf(columnMapping.year) : -1;

      const vacancies = rows.map((row: any) => ({
        title: row[titleIdx]?.trim() || "Onbekend",
        department: deptIdx >= 0 ? row[deptIdx]?.trim() || null : null,
        description: descIdx >= 0 ? row[descIdx]?.trim() || null : null,
        year: yearIdx >= 0 ? parseInt(row[yearIdx]) || null : null,
      }));

      const { error } = await supabase.functions.invoke("import-organisation-vacancies", {
        body: { organisation_type_id: selectedOrgId, vacancies, replace: replaceMode },
      });

      if (error) throw error;

      toast({ title: `${vacancies.length} vacatures geïmporteerd` });
      await fetchStats(selectedOrgId);
      setFile(null);
      setParsedData([]);
      setHeaders([]);
    } catch (err) {
      console.error(err);
      toast({ title: "Import mislukt", description: String(err), variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  const selectedOrgName = orgTypes.find((o) => o.id === selectedOrgId)?.name || "";

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
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Vacatures Beheren</h1>
        <p className="text-gray-600 mb-8">Selecteer een branche of organisatie om vacatures te importeren.</p>

        {/* Org selector */}
        <Card className="p-6 mb-8 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Organisatie selecteren</label>
          <Select value={selectedOrgId} onValueChange={handleOrgChange}>
            <SelectTrigger className="bg-white max-w-md">
              <SelectValue placeholder="Selecteer een organisatie..." />
            </SelectTrigger>
            <SelectContent>
              {branches.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Branches</SelectLabel>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectGroup>
              )}
              {children.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Specifieke Organisaties</SelectLabel>
                  {children.map((c) => {
                    const parentName = branches.find((b) => b.id === c.parent_type_id)?.name;
                    return (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}{parentName ? ` (${parentName})` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </Card>

        {selectedOrgId && (
          <>
            {/* Stats */}
            <Card className="p-6 mb-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">{selectedOrgName}</h2>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-gray-500">Vacatures in database</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Laatste import</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {stats.lastImport
                      ? new Date(stats.lastImport).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })
                      : "Nog geen import"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Upload */}
            <Card className="p-8 mb-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" /> CSV Importeren
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selecteer CSV-bestand</label>
                  <Input type="file" accept=".csv" onChange={handleFileChange} className="bg-white" />
                </div>

                {headers.length > 0 && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(["title", "department", "description", "year"] as const).map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field === "title" ? "Titel *" : field === "department" ? "Afdeling" : field === "description" ? "Beschrijving" : "Jaar"}
                          </label>
                          <Select value={columnMapping[field]} onValueChange={(v) => setColumnMapping((m) => ({ ...m, [field]: v }))}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Selecteer kolom" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__none__">— Geen —</SelectItem>
                              {headers.map((h) => (
                                <SelectItem key={h} value={h}>{h}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-blue-50">
                          <tr>
                            {headers.map((h) => (
                              <th key={h} className="px-4 py-2 text-left font-semibold text-blue-900">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.slice(0, 10).map((row, i) => (
                            <tr key={i} className="border-t border-gray-100">
                              {row.map((cell, j) => (
                                <td key={j} className="px-4 py-2 text-gray-700 max-w-xs truncate">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={replaceMode} onChange={() => setReplaceMode(true)} />
                        <span className="text-sm text-gray-700">Vervang alle bestaande vacatures</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={!replaceMode} onChange={() => setReplaceMode(false)} />
                        <span className="text-sm text-gray-700">Voeg toe aan bestaande</span>
                      </label>
                    </div>

                    <Button
                      onClick={handleImport}
                      disabled={importing || !columnMapping.title}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 px-8"
                    >
                      {importing ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importeren...</>
                      ) : (
                        <><Upload className="w-4 h-4 mr-2" /> Importeer vacatures</>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminVacatures;
