import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Loader2, FileSpreadsheet, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

const AdminErasmusMCVacatures = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    title: "",
    department: "",
    description: "",
    year: "",
  });
  const [importing, setImporting] = useState(false);
  const [replaceMode, setReplaceMode] = useState(true);
  const [stats, setStats] = useState<{ count: number; lastImport: string | null }>({ count: 0, lastImport: null });
  const [erasmusMCTypeId, setErasmusMCTypeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Get ErasmusMC org type id
      const { data: orgType } = await supabase
        .from("organisation_types")
        .select("id")
        .eq("slug", "erasmus-mc")
        .single();

      if (orgType) {
        setErasmusMCTypeId(orgType.id);

        const { count } = await supabase
          .from("organisation_vacancies")
          .select("id", { count: "exact", head: true })
          .eq("organisation_type_id", orgType.id);

        const { data: latest } = await supabase
          .from("organisation_vacancies")
          .select("created_at")
          .eq("organisation_type_id", orgType.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        setStats({
          count: count || 0,
          lastImport: latest?.created_at || null,
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    Papa.parse(f, {
      preview: 11, // 1 header + 10 rows
      complete: (result) => {
        if (result.data.length > 0) {
          const h = result.data[0] as string[];
          setHeaders(h);
          setParsedData(result.data.slice(1) as string[][]);
          // Auto-map by name
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
    if (!file || !erasmusMCTypeId || !columnMapping.title) {
      toast({ title: "Selecteer minstens de kolom 'Titel'", variant: "destructive" });
      return;
    }

    setImporting(true);
    try {
      // Parse full file
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
        organisation_type_id: erasmusMCTypeId,
      }));

      const { data, error } = await supabase.functions.invoke("import-organisation-vacancies", {
        body: {
          organisation_type_id: erasmusMCTypeId,
          vacancies,
          replace: replaceMode,
        },
      });

      if (error) throw error;

      toast({ title: `${vacancies.length} vacatures geïmporteerd` });

      // Refresh stats
      const { count } = await supabase
        .from("organisation_vacancies")
        .select("id", { count: "exact", head: true })
        .eq("organisation_type_id", erasmusMCTypeId);

      setStats({ count: count || 0, lastImport: new Date().toISOString() });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <img
              src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png"
              alt="Vinster Logo"
              className="h-16 w-auto cursor-pointer hover:opacity-80"
              onClick={() => navigate("/")}
            />
            <Button onClick={() => navigate("/home")} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Terug
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">ErasmusMC Vacatures</h1>
        <p className="text-gray-600 mb-8">Importeer en beheer de vacaturedatabase voor ErasmusMC loopbaanrapporten.</p>

        {/* Stats */}
        <Card className="p-6 mb-8 rounded-2xl border border-gray-100 shadow-sm">
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

        {/* Upload area */}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
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

                {/* Preview table */}
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

                {/* Import options */}
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
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importeren...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" /> Importeer vacatures
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminErasmusMCVacatures;
