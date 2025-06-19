
import { useEnthousiasmeResponses } from "./useEnthousiasmeResponses";
import { useWensberoepenResponses } from "./useWensberoepenResponses";
import { useMemo } from "react";

export const useFormValidation = () => {
  const { responses: enthousiasmeResponses, loading: enthousiasmeLoading } = useEnthousiasmeResponses();
  const { responses: wensberoepenResponses, isLoading: wensberoepenLoading } = useWensberoepenResponses();

  const validationResults = useMemo(() => {
    if (enthousiasmeLoading || wensberoepenLoading) {
      return {
        isLoading: true,
        isFormComplete: false,
        missingFields: [],
        enthousiasmeComplete: false,
        wensberoepenComplete: false
      };
    }

    // Check enthousiasme fields (9 required fields - updated with correct field names)
    const enthousiasmeFields = [
      'kindertijd_activiteiten',
      'kindertijd_plekken', 
      'kindertijd_interesses_nieuw',
      'eerste_werk_leukste_taken',
      'eerste_werk_werkomstandigheden',
      'eerste_werk_onderwerpen',
      'plezierige_werkperiode_beschrijving',
      'leuk_project_en_rol',
      'fluitend_thuiskomen_dag'
    ];

    const missingEnthousiasme = enthousiasmeFields.filter(field => 
      !enthousiasmeResponses?.[field as keyof typeof enthousiasmeResponses] || 
      enthousiasmeResponses[field as keyof typeof enthousiasmeResponses]?.trim() === ''
    );

    // Check wensberoepen fields (27 required fields: 3 titles + 24 questions - updated to remove deleted fields)
    const wensberoepenFields = [
      // Wensberoep 1 (9 fields: 1 title + 8 questions)
      'wensberoep_1_titel',
      'wensberoep_1_werkweek_activiteiten',
      'wensberoep_1_werklocatie_omgeving',
      'wensberoep_1_samenwerking_contacten',
      'wensberoep_1_fluitend_thuiskomen_dag',
      'wensberoep_1_werk_doel',
      'wensberoep_1_leukste_onderdelen',
      'wensberoep_1_belangrijke_aspecten',
      'wensberoep_1_kennis_focus',
      
      // Wensberoep 2 (9 fields: 1 title + 8 questions)
      'wensberoep_2_titel',
      'wensberoep_2_werkweek_activiteiten',
      'wensberoep_2_werklocatie_omgeving',
      'wensberoep_2_samenwerking_contacten',
      'wensberoep_2_fluitend_thuiskomen_dag',
      'wensberoep_2_werk_doel',
      'wensberoep_2_leukste_onderdelen',
      'wensberoep_2_belangrijke_aspecten',
      'wensberoep_2_kennis_focus',
      
      // Wensberoep 3 (9 fields: 1 title + 8 questions)
      'wensberoep_3_titel',
      'wensberoep_3_werkweek_activiteiten',
      'wensberoep_3_werklocatie_omgeving',
      'wensberoep_3_samenwerking_contacten',
      'wensberoep_3_fluitend_thuiskomen_dag',
      'wensberoep_3_werk_doel',
      'wensberoep_3_leukste_onderdelen',
      'wensberoep_3_belangrijke_aspecten',
      'wensberoep_3_kennis_focus'
    ];

    const missingWensberoepen = wensberoepenFields.filter(field => 
      !wensberoepenResponses?.[field as keyof typeof wensberoepenResponses] || 
      wensberoepenResponses[field as keyof typeof wensberoepenResponses]?.trim() === ''
    );

    const enthousiasmeComplete = missingEnthousiasme.length === 0;
    const wensberoepenComplete = missingWensberoepen.length === 0;
    const isFormComplete = enthousiasmeComplete && wensberoepenComplete;

    const missingFields = [];
    if (!enthousiasmeComplete) {
      missingFields.push('Enthousiasme scan');
    }
    if (!wensberoepenComplete) {
      missingFields.push('Wensberoepen scan');
    }

    return {
      isLoading: false,
      isFormComplete,
      missingFields,
      enthousiasmeComplete,
      wensberoepenComplete,
      missingEnthousiasmeCount: missingEnthousiasme.length,
      missingWensberoepenCount: missingWensberoepen.length
    };
  }, [enthousiasmeResponses, wensberoepenResponses, enthousiasmeLoading, wensberoepenLoading]);

  return validationResults;
};
