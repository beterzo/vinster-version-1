import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const VoorbeeldrapportPagina = () => {
  const { language } = useTranslation();

  // Language-specific PDF URLs
  const getPdfUrl = () => {
    switch (language) {
      case 'en':
        return '/Voorbeeld loopbaanrapport engels.pdf';
      case 'de':
        return '/Voorbeeld loopbaanrapport Duits.pdf';
      case 'no':
        return '/Voorbeeld loopbaanrapport Noors.pdf';
      default:
        return '/Voorbeeldrapport_Vinster_V2.pdf';
    }
  };

  useEffect(() => {
    // Set custom title
    document.title = "Voorbeeldrapport";
    
    // Set custom favicon
    const existingFavicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    const originalFavicon = existingFavicon?.href;
    
    if (existingFavicon) {
      existingFavicon.href = "/images/voorbeeldrapport-favicon.png";
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = "/images/voorbeeldrapport-favicon.png";
      document.head.appendChild(newFavicon);
    }

    // Cleanup: restore original favicon when leaving page
    return () => {
      if (existingFavicon && originalFavicon) {
        existingFavicon.href = originalFavicon;
      }
      document.title = "Vinster";
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <iframe
        src={getPdfUrl()}
        className="w-full h-full border-0"
        title="Voorbeeldrapport"
      />
    </div>
  );
};

export default VoorbeeldrapportPagina;
