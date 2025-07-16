-- Create function to handle journey reset
CREATE OR REPLACE FUNCTION public.handle_journey_reset()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if reset_completed changed from false to true
  IF OLD.reset_completed = false AND NEW.reset_completed = true THEN
    -- Delete all user responses
    DELETE FROM public.enthousiasme_responses WHERE user_id = NEW.user_id;
    DELETE FROM public.wensberoepen_responses WHERE user_id = NEW.user_id;
    DELETE FROM public.prioriteiten_responses WHERE user_id = NEW.user_id;
    DELETE FROM public.extra_informatie_responses WHERE user_id = NEW.user_id;
    DELETE FROM public.zoekprofiel_antwoorden WHERE user_id = NEW.user_id;
    DELETE FROM public.user_reports WHERE user_id = NEW.user_id;
    DELETE FROM public.user_zoekprofielen WHERE user_id = NEW.user_id;
    
    -- Reset AI generated fields in profiles but keep has_paid as true
    UPDATE public.profiles 
    SET 
      ai_interesses = NULL,
      ai_lievelings_activiteiten = NULL,
      ai_werkomstandigheden = NULL,
      updated_at = now()
    WHERE id = NEW.user_id;
    
    -- Update webhook_processed to true as well
    NEW.webhook_processed = true;
    
    -- Log the reset action
    RAISE LOG 'Journey reset completed for user: %', NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic journey reset
CREATE TRIGGER trigger_journey_reset
  BEFORE UPDATE ON public.journey_resets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_journey_reset();