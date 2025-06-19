
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

    // Check enthousiasme completion - page-based approach
    const enthousiasmeComplete = (() => {
      if (!enthousiasmeResponses) return false;
      
      // Define pages and their required fields
      const page1Fields = ['kindertijd_activiteiten', 'kindertijd_plekken', 'kindertijd_interesses_nieuw'];
      const page2Fields = ['eerste_werk_leukste_taken', 'eerste_werk_werkomstandigheden', 'eerste_werk_onderwerpen'];
      const page3Fields = ['plezierige_werkperiode_beschrijving', 'leuk_project_en_rol', 'fluitend_thuiskomen_dag'];
      
      const allPages = [page1Fields, page2Fields, page3Fields];
      
      // Check if all pages are complete
      return allPages.every(pageFields => 
        pageFields.every(field => {
          const value = enthousiasmeResponses[field as keyof typeof enthousiasmeResponses];
          return value && String(value).trim() !== '';
        })
      );
    })();

    // Check wensberoepen completion - wensberoep-based approach
    const wensberoepenComplete = (() => {
      if (!wensberoepenResponses) return false;
      
      // Define fields for each wensberoep
      const fieldSuffixes = [
        'titel',
        'werkweek_activiteiten',
        'werklocatie_omgeving',
        'samenwerking_contacten',
        'fluitend_thuiskomen_dag',
        'werk_doel',
        'leukste_onderdelen',
        'belangrijke_aspecten',
        'kennis_focus'
      ];
      
      const wensberoepPrefixes = ['wensberoep_1', 'wensberoep_2', 'wensberoep_3'];
      
      // Check if all wensberoepen are complete
      return wensberoepPrefixes.every(prefix =>
        fieldSuffixes.every(suffix => {
          const fieldName = `${prefix}_${suffix}`;
          const value = wensberoepenResponses[fieldName as keyof typeof wensberoepenResponses];
          return value && String(value).trim() !== '';
        })
      );
    })();

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
      missingEnthousiasmeCount: enthousiasmeComplete ? 0 : 1,
      missingWensberoepenCount: wensberoepenComplete ? 0 : 1
    };
  }, [enthousiasmeResponses, wensberoepenResponses, enthousiasmeLoading, wensberoepenLoading]);

  return validationResults;
};
