
import { useWensberoepenResponses } from "./useWensberoepenResponses";
import { useMemo } from "react";

export const useWensberoepenValidation = () => {
  const { responses: wensberoepenResponses, isLoading: wensberoepenLoading } = useWensberoepenResponses();

  const validationResults = useMemo(() => {
    if (wensberoepenLoading) {
      return {
        isLoading: true,
        isWensberoepenComplete: false,
        missingFields: [],
        missingWensberoepenCount: 0
      };
    }

    // Check wensberoepen fields (27 required fields: 3 titles + 24 questions)
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

    const isWensberoepenComplete = missingWensberoepen.length === 0;

    const missingFields = [];
    if (!isWensberoepenComplete) {
      missingFields.push('Wensberoepen scan');
    }

    return {
      isLoading: false,
      isWensberoepenComplete,
      missingFields,
      missingWensberoepenCount: missingWensberoepen.length
    };
  }, [wensberoepenResponses, wensberoepenLoading]);

  return validationResults;
};
