import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface OrganisationContextData {
  organisationTypeId: string | null;
  accessCodeId: string | null;
  slug: string | null;
  name: string | null;
}

interface OrganisationContextValue extends OrganisationContextData {
  isOrganisationMode: boolean;
  setOrganisation: (data: OrganisationContextData) => void;
  clearOrganisation: () => void;
}

const STORAGE_KEY = "vinster_organisation_context";

const OrganisationContext = createContext<OrganisationContextValue | undefined>(undefined);

export const OrganisationProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<OrganisationContextData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { organisationTypeId: null, accessCodeId: null, slug: null, name: null };
  });

  useEffect(() => {
    if (data.organisationTypeId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [data]);

  const setOrganisation = useCallback((newData: OrganisationContextData) => {
    setData(newData);
  }, []);

  const clearOrganisation = useCallback(() => {
    setData({ organisationTypeId: null, accessCodeId: null, slug: null, name: null });
  }, []);

  return (
    <OrganisationContext.Provider
      value={{
        ...data,
        isOrganisationMode: !!data.organisationTypeId,
        setOrganisation,
        clearOrganisation,
      }}
    >
      {children}
    </OrganisationContext.Provider>
  );
};

export const useOrganisation = () => {
  const context = useContext(OrganisationContext);
  if (!context) {
    throw new Error("useOrganisation must be used within an OrganisationProvider");
  }
  return context;
};
