
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
          label="1. Wat doe je in een werkweek? Antwoord in werkwoorden en activiteiten."
          value={getFieldValue('werkweek_activiteiten')}
          onChange={(value) => handleFieldChange('werkweek_activiteiten', value)}
          placeholder="Beschrijf de dagelijkse activiteiten..."
          type="textarea"
          rows={3}
        />

        <WensberoepenField
          id={`${prefix}_werklocatie_omgeving`}
          label="2. Waar doe je je werk? Beschrijf de omgeving, het gebouw, de ruimte ...."
          value={getFieldValue('werklocatie_omgeving')}
          onChange={(value) => handleFieldChange('werklocatie_omgeving', value)}
          placeholder="Beschrijf de werklocatie..."
          type="textarea"
        />

        <WensberoepenField
          id={`${prefix}_samenwerking_contacten`}
          label="3. Werk je meer samen of meer alleen? Met wat voor mensen heb je contact?"
          value={getFieldValue('samenwerking_contacten')}
          onChange={(value) => handleFieldChange('samenwerking_contacten', value)}
          placeholder="Met wie werk je samen..."
          type="textarea"
        />

        <WensberoepenField
          id={`${prefix}_fluitend_thuiskomen_dag`}
          label="4. Wat heb je gedaan op een dag dat je fluitend thuiskomt?"
          value={getFieldValue('fluitend_thuiskomen_dag')}
          onChange={(value) => handleFieldChange('fluitend_thuiskomen_dag', value)}
          placeholder="Beschrijf een perfecte werkdag..."
          type="textarea"
          rows={3}
        />

        <WensberoepenField
          id={`${prefix}_werk_doel`}
          label="5. Wat is je doel met dit werk?"
          value={getFieldValue('werk_doel')}
          onChange={(value) => handleFieldChange('werk_doel', value)}
          placeholder="Wat wil je bereiken in dit werk..."
          type="textarea"
        />

        <WensberoepenField
          id={`${prefix}_leukste_onderdelen`}
          label="6. Welke onderdelen uit je werk zijn het leukst?"
          value={getFieldValue('leukste_onderdelen')}
          onChange={(value) => handleFieldChange('leukste_onderdelen', value)}
          placeholder="Wat vind je het leukst aan dit werk..."
          type="textarea"
        />

        <WensberoepenField
          id={`${prefix}_belangrijke_aspecten`}
          label="7. Wat is voor jou belangrijk in dit werk?"
          value={getFieldValue('belangrijke_aspecten')}
          onChange={(value) => handleFieldChange('belangrijke_aspecten', value)}
          placeholder="Wat vind je belangrijk in dit werk..."
          type="textarea"
        />

        <WensberoepenField
          id={`${prefix}_kennis_focus`}
          label="8. Waar gaat het vooral over in jouw werk? Waar moet je veel van weten?"
          value={getFieldValue('kennis_focus')}
          onChange={(value) => handleFieldChange('kennis_focus', value)}
          placeholder="Op welke kennis wil je je focussen..."
          type="textarea"
        />
      </WensberoepenFormSection>
    </div>
  );
};
