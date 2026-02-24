import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { CheckCircle2, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useOrganisation } from "@/contexts/OrganisationContext";

const OrganisatieIntro = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { name, accessCodeId } = useOrganisation();

  // Determine labels based on category vs specific org
  const isCategory = !accessCodeId;
  const contextLabel = isCategory
    ? name ? `een ${name.toLowerCase()}` : "jouw organisatie"
    : name || "jouw organisatie";
  const brancheLabel = isCategory
    ? "deze branche"
    : name || "jouw organisatie";
  const binnenLabel = isCategory
    ? `in ${brancheLabel}`
    : `binnen ${name}`;

  const steps = [
    {
      number: 1,
      title: "Enthousiasmescan",
      description:
        "Je beantwoordt vragen over drie periodes waarin je energie kreeg van je werk. Wat deed je precies? In welke context? Schrijf zo concreet mogelijk, in je eigen woorden.",
    },
    {
      number: 2,
      title: "Wensberoepen",
      description:
        `Daarna noem je drie wensberoepen waarbij je gaat beschrijven wat je er in aanspreekt. Je mag zo vrij mogelijk schrijven. Deze wensberoepen mogen binnen of buiten ${contextLabel} liggen. Jouw antwoorden worden gebruikt om te bedenken bij welke functies ${binnenLabel} jouw wensen passen.`,
    },
    {
      number: 3,
      title: "Resultaat",
      description:
        `Vinster leest jouw antwoorden en vertaalt jouw woorden naar passende functierichtingen en concrete functie-ideeën binnen ${contextLabel}.`,
    },
  ];

  const resultItems = [
    "overzicht wat jij zoekt in werk",
    `drie mogelijke functierichtingen ${binnenLabel}`,
    "een actieplan om mee verder te gaan",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
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
              onClick={() => navigate(`/organisaties/${slug}`)}
              variant="outline"
              className="border-[#232D4B] text-[#232D4B] hover:bg-blue-50 font-semibold"
            >
              Terug
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#232D4B] mb-3">
              Welkom bij Vinster
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Je gaat onderzoeken welke functies en rollen binnen {contextLabel} bij jou kunnen passen.
            </p>
          </div>

          {/* Hoe werkt het? */}
          <div>
            <h2 className="text-xl font-bold text-[#232D4B] mb-4">Hoe werkt het?</h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-xl p-5 border border-gray-100 bg-gray-50 flex gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#232D4B] text-white flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#232D4B] text-base mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wat krijg je? */}
          <div>
            <h2 className="text-xl font-bold text-[#232D4B] mb-4">Wat krijg je?</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Je ontvangt een persoonlijk rapport met:
            </p>
            <ul className="space-y-2 mb-5">
              {resultItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-[#232D4B] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mb-3">
              Het doel is om ideeën te krijgen over welk werk er nog meer bij jou zou kunnen passen. Deze ideeën bespreek je met je loopbaanadviseur.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Je kunt het proces meerdere keren doorlopen. Kies het rapport waar jij tevreden over bent en neem dat mee of stuur het door naar jouw adviseur.
            </p>
          </div>

          {/* Vertrouwelijk & flexibel */}
          <div className="bg-[#E8F4FD] rounded-xl p-5 flex gap-4">
            <Shield className="h-6 w-6 text-[#232D4B] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#232D4B] mb-1">Vertrouwelijk & flexibel</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-2">
                Alles is volledig vertrouwelijk. Niemand kan in jouw account kijken.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                Je antwoorden worden automatisch opgeslagen. Je kunt op elk moment stoppen en later verdergaan. Neem de tijd. Hoe zorgvuldiger je schrijft, hoe persoonlijker het resultaat.
              </p>
            </div>
          </div>

          {/* Verder kijken */}
          <div className="text-sm text-gray-500 leading-relaxed">
            <span className="font-medium text-gray-600">Verder kijken dan {brancheLabel}?</span>{" "}
            Je kunt Vinster ook zelf doen door via{" "}
            <a
              href="/"
              className="text-[#232D4B] underline hover:text-blue-800 transition-colors"
            >
              de algemene knop
            </a>{" "}
            in te loggen. Je krijgt dan zicht op functies die bij je zouden kunnen passen buiten {brancheLabel}. Je betaalt daarvoor €29,-.
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Button
              onClick={() => navigate("/home")}
              className="bg-[#232D4B] hover:bg-blue-800 text-white font-semibold h-12 px-8 w-full sm:w-auto"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Vinster
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrganisatieIntro;
