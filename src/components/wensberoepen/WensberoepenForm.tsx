
import { WensberoepenFormSection, WensberoepenField } from "./WensberoepenFormSection";

interface WensberoepenFormProps {
  prefix: string;
  formData: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
}

export const WensberoepenForm = ({ prefix, formData, onFieldChange }: WensberoepenFormProps) => {
  const getFieldValue = (suffix: string) => formData[`${prefix}_${suffix}`] || '';
  const handleFieldChange = (suffix: string, value: string) => onFieldChange(`${prefix}_${suffix}`, value);

  return (
    <div className="space-y-6">
      {/* Basis informatie */}
      <WensberoepenFormSection title="Basis informatie">
        <WensberoepenField
          id={`${prefix}_titel`}
          label="Titel van het beroep"
          value={getFieldValue('titel')}
          onChange={(value) => handleFieldChange('titel', value)}
          placeholder="Bijv. Marketing Manager"
        />
      </WensberoepenFormSection>

      {/* Werkinhoud */}
      <WensberoepenFormSection title="Werkinhoud">
        <WensberoepenField
          id={`${prefix}_werkweek_activiteiten`}
          label="Werkweek activiteiten"
          value={getFieldValue('werkweek_activiteiten')}
          onChange={(value) => handleFieldChange('werkweek_activiteiten', value)}
          placeholder="Beschrijf de dagelijkse activiteiten..."
          type="textarea"
          rows={3}
        />

        <WensberoepenField
          id={`${prefix}_leukste_onderdelen`}
          label="Leukste onderdelen"
          value={getFieldValue('leukste_onderdelen')}
          onChange={(value) => handleFieldChange('leukste_onderdelen', value)}
          placeholder="Wat vind je het leukst aan dit werk..."
          type="textarea"
        />

        <WensberoepenField
          id={`${prefix}_werk_doel`}
          label="Werk doel"
          value={getFieldValue('werk_doel')}
          onChange={(value) => handleFieldChange('werk_doel', value)}
          placeholder="Wat wil je bereiken in dit werk..."
          type="textarea"
        />
      </WensberoepenFormSection>

      {/* Werkomgeving */}
      <WensberoepenFormSection title="Werkomgeving">
        <WensberoepenField
          id={`${prefix}_werklocatie_omgeving`}
          label="Werklocatie en omgeving"
          value={getFieldValue('werklocatie_omgeving')}
          onChange={(value) => handleFieldChange('werklocatie_omgeving', value)}
          placeholder="Beschrijf de werklocatie..."
          type="textarea"
        />

        <WensberoepenField
          id={`${prefix}_binnen_buiten_verhouding`}
          label="Binnen/buiten verhouding"
          value={getFieldValue('binnen_buiten_verhouding')}
          onChange={(value) => handleFieldChange('binnen_buiten_verhouding', value)}
          placeholder="Bijv. 80% binnen, 20% buiten"
        />

        <WensberoepenField
          id={`${prefix}_werksfeer`}
          label="Werksfeer"
          value={getFieldValue('werksfeer')}
          onChange={(value) => handleFieldChange('werksfeer', value)}
          placeholder="Beschrijf de gewenste werksfeer..."
          type="textarea"
        />
      </WensberoepenFormSection>

      {/* Samenwerking */}
      <WensberoepenFormSection title="Samenwerking">
        <WensberoepenField
          id={`${prefix}_samenwerking_contacten`}
          label="Samenwerking en contacten"
          value={getFieldValue('samenwerking_contacten')}
          onChange={(value) => handleFieldChange('samenwerking_contacten', value)}
          placeholder="Met wie werk je samen..."
          type="textarea"
        />
      </WensberoepenFormSection>

      {/* Praktische zaken */}
      <WensberoepenFormSection title="Praktische zaken">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WensberoepenField
            id={`${prefix}_werkuren`}
            label="Werkuren"
            value={getFieldValue('werkuren')}
            onChange={(value) => handleFieldChange('werkuren', value)}
            placeholder="Bijv. 40 uur per week"
          />

          <WensberoepenField
            id={`${prefix}_reistijd`}
            label="Reistijd"
            value={getFieldValue('reistijd')}
            onChange={(value) => handleFieldChange('reistijd', value)}
            placeholder="Bijv. 30 minuten enkele reis"
          />
        </div>
      </WensberoepenFormSection>

      {/* Motivatie & Focus */}
      <WensberoepenFormSection title="Motivatie & Focus">
        <WensberoepenField
          id={`${prefix}_fluitend_thuiskomen_dag`}
          label="Fluitend thuiskomen dag"
          value={getFieldValue('fluitend_thuiskomen_dag')}
          onChange={(value) => handleFieldChange('fluitend_thuiskomen_dag', value)}
          placeholder="Beschrijf een perfecte werkdag..."
          type="textarea"
          rows={3}
        />

        <WensberoepenField
          id={`${prefix}_belangrijke_aspecten`}
          label="Belangrijke aspecten"
          value={getFieldValue('belangrijke_aspecten')}
          onChange={(value) => handleFieldChange('belangrijke_aspecten', value)}
          placeholder="Wat vind je belangrijk in dit werk..."
          type="textarea"
        />

        <WensberoepenField
          id={`${prefix}_kennis_focus`}
          label="Kennis focus"
          value={getFieldValue('kennis_focus')}
          onChange={(value) => handleFieldChange('kennis_focus', value)}
          placeholder="Op welke kennis wil je je focussen..."
          type="textarea"
        />
      </WensberoepenFormSection>
    </div>
  );
};
