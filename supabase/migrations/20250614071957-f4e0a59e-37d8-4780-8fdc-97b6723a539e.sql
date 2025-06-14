
-- Rename columns in enthousiasme_responses table to more descriptive names
ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step1_q1 TO kindertijd_liefste_activiteiten;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step1_q2 TO kindertijd_favoriete_plekken;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step1_q3 TO kindertijd_interesses;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step2_q1 TO school_interessantste_vakken;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step2_q2 TO school_thuiskomst_activiteiten;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step2_q3 TO school_naschoolse_activiteiten;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step3_q1 TO eerste_werk_leukste_aspecten;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step3_q2 TO werkomgeving_aantrekkelijke_elementen;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step3_q3 TO samenwerking_prettige_aspecten;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step4_q1 TO plezierige_werkperiode_beschrijving;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step4_q2 TO leuk_project_en_rol;

ALTER TABLE public.enthousiasme_responses 
  RENAME COLUMN step4_q3 TO fluitend_thuiskomen_dag;
