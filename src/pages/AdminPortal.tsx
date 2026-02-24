import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileSpreadsheet, ArrowRight } from "lucide-react";

const adminCards = [
  {
    title: "Organisatie Gebruik",
    description: "Bekijk statistieken per branche en organisatie, en beheer toegangscodes.",
    icon: BarChart3,
    path: "/admin/gebruik",
  },
  {
    title: "Vacatures Beheren",
    description: "Upload en beheer vacatures per branche of specifieke organisatie via CSV.",
    icon: FileSpreadsheet,
    path: "/admin/vacatures",
  },
];

const AdminPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <img
            src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png"
            alt="Vinster Logo"
            className="h-16 w-auto cursor-pointer hover:opacity-80"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Portal</h1>
        <p className="text-gray-600 mb-10">Beheer Vinster organisatie-instellingen en data.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminCards.map((card) => (
            <Card
              key={card.path}
              className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => navigate(card.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <card.icon className="h-6 w-6 text-blue-900" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-900 transition-colors mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
