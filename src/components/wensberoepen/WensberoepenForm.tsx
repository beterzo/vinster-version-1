
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WensberoepenFormSection } from "./WensberoepenFormSection";

interface WensberoepenFormProps {
  prefix: string;
  formData: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  onSave?: () => Promise<void>;
  onNext?: () => void;
  nextLabel?: string;
  isLastStep?: boolean;
  currentStep?: number;
  totalSteps?: number;
  isSaving?: boolean;
}

export const WensberoepenForm = ({ 
  prefix, 
  formData, 
  onFieldChange, 
  onSave, 
  onNext, 
  nextLabel = "Volgende", 
  isLastStep = false,
  currentStep,
  totalSteps,
  isSaving = false 
}: WensberoepenFormProps) => {
  const titelField = `${prefix}_titel`;
  const werkweekActiviteitenField = `${prefix}_werkweek_activiteiten`;
  const werklocatieOmgevingField = `${prefix}_werklocatie_omgeving`;
  const samenwerkingContactenField = `${prefix}_samenwerking_contacten`;
  const fluitendThuiskoemenDagField = `${prefix}_fluitend_thuiskomen_dag`;
  const werkDoelField = `${prefix}_werk_doel`;
  const leuksteOnderdelenField = `${prefix}_leukste_onderdelen`;
  const belangrijkeAspectenField = `${prefix}_belangrijke_aspecten`;
  const kennisFocusField = `${prefix}_kennis_focus`;

  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      {currentStep && totalSteps && (
        <div className="text-center mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Stap {currentStep} van {totalSteps}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Wensberoep titel */}
      <WensberoepenFormSection>
        <Label htmlFor={titelField} className="text-base font-medium text-gray-700">
          Titel van dit beroep
        </Label>
        <Textarea
          id={titelField}
          placeholder="Bijvoorbeeld: Marketing Manager, Leraar, Grafisch ontwerper..."
          value={formData[titelField] || ""}
          onChange={(e) => onFieldChange(titelField, e.target.value)}
          className="min-h-[60px] resize-none"
        />
      </WensberoepenFormSection>

      {/* Werkweek activiteiten */}
      <WensberoepenFormSection>
        <Label htmlFor={werkweekActiviteitenField} className="text-base font-medium text-gray-700">
          Beschrijf een typische werkweek. Welke activiteiten doe je?
        </Label>
        <Textarea
          id={werkweekActiviteitenField}
          placeholder="Bijvoorbeeld: Vergaderingen voorbereiden, klanten spreken, creatieve concepten ontwikkelen..."
          value={formData[werkweekActiviteitenField] || ""}
          onChange={(e) => onFieldChange(werkweekActiviteitenField, e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </WensberoepenFormSection>

      {/* Werklocatie en omgeving */}
      <WensberoepenFormSection>
        <Label htmlFor={werklocatieOmgevingField} className="text-base font-medium text-gray-700">
          Waar werk je en hoe ziet je werkomgeving eruit?
        </Label>
        <Textarea
          id={werklocatieOmgevingField}
          placeholder="Bijvoorbeeld: In een creatieve studio, thuis, op kantoor, buiten, veel reizen..."
          value={formData[werklocatieOmgevingField] || ""}
          onChange={(e) => onFieldChange(werklocatieOmgevingField, e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </WensberoepenFormSection>

      {/* Samenwerking en contacten */}
      <WensberoepenFormSection>
        <Label htmlFor={samenwerkingContactenField} className="text-base font-medium text-gray-700">
          Met wie werk je samen en welke contacten heb je?
        </Label>
        <Textarea
          id={samenwerkingContactenField}
          placeholder="Bijvoorbeeld: Klein team, alleen, veel klantcontact, internationale samenwerking..."
          value={formData[samenwerkingContactenField] || ""}
          onChange={(e) => onFieldChange(samenwerkingContactenField, e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </WensberoepenFormSection>

      {/* Goede werkdag */}
      <WensberoepenFormSection>
        <Label htmlFor={fluitendThuiskoemenDagField} className="text-base font-medium text-gray-700">
          Beschrijf een goede werkdag waarbij je tevreden thuiskomt
        </Label>
        <Textarea
          id={fluitendThuiskoemenDagField}
          placeholder="Bijvoorbeeld: Alles ging soepel, veel bereikt, leuke gesprekken gehad..."
          value={formData[fluitendThuiskoemenDagField] || ""}
          onChange={(e) => onFieldChange(fluitendThuiskoemenDagField, e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </WensberoepenFormSection>

      {/* Werk doel */}
      <WensberoepenFormSection>
        <Label htmlFor={werkDoelField} className="text-base font-medium text-gray-700">
          Wat is het doel van jouw werk? Waar draag je aan bij?
        </Label>
        <Textarea
          id={werkDoelField}
          placeholder="Bijvoorbeeld: Mensen helpen, bedrijven laten groeien, mooie dingen maken..."
          value={formData[werkDoelField] || ""}
          onChange={(e) => onFieldChange(werkDoelField, e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </WensberoepenFormSection>

      {/* Leukste onderdelen */}
      <WensberoepenFormSection>
        <Label htmlFor={leuksteOnderdelenField} className="text-base font-medium text-gray-700">
          Wat zijn de leukste onderdelen van dit werk?
        </Label>
        <Textarea
          id={leuksteOnderdelenField}
          placeholder="Bijvoorbeeld: Creatief bezig zijn, problemen oplossen, mensen ontmoeten..."
          value={formData[leuksteOnderdelenField] || ""}
          onChange={(e) => onFieldChange(leuksteOnderdelenField, e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </WensberoepenFormSection>

      {/* Belangrijke aspecten */}
      <WensberoepenFormSection>
        <Label htmlFor={belangrijkeAspectenField} className="text-base font-medium text-gray-700">
          Welke aspecten van werk vind je het allerbelangrijkst?
        </Label>
        <Textarea
          id={belangrijkeAspectenField}
          placeholder="Bijvoorbeeld: Vrijheid, zekerheid, afwisseling, groei, impact maken..."
          value={formData[belangrijkeAspectenField] || ""}
          onChange={(e) => onFieldChange(belangrijkeAspectenField, e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </WensberoepenFormSection>

      {/* Kennis en focus */}
      <WensberoepenFormSection>
        <Label htmlFor={kennisFocusField} className="text-base font-medium text-gray-700">
          Waar ligt jouw kennis en focus op?
        </Label>
        <Textarea
          id={kennisFocusField}
          placeholder="Bijvoorbeeld: Technologie, mensen, cijfers, creativiteit, strategie..."
          value={formData[kennisFocusField] || ""}
          onChange={(e) => onFieldChange(kennisFocusField, e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </WensberoepenFormSection>

      {/* Save button */}
      <div className="text-center pt-8">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg"
        >
          {isSaving ? "Opslaan..." : nextLabel}
        </Button>
      </div>
    </div>
  );
};
