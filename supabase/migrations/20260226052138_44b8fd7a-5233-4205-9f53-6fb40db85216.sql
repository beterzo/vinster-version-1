
CREATE OR REPLACE FUNCTION public.protect_has_paid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.has_paid IS DISTINCT FROM OLD.has_paid THEN
    IF current_setting('role') != 'service_role' THEN
      NEW.has_paid := OLD.has_paid;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_has_paid_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_has_paid();
