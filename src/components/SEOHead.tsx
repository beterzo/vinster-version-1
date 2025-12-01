import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
}

const seoConfigs: Record<string, Record<string, SEOConfig>> = {
  nl: {
    "/": {
      title: "Vinster | Werk dat bij je past vinden met AI loopbaanadvies",
      description: "Ontdek welk werk bij je past met de Loopbaantrechter methode van Heidi Jansen. Online loopbaanadvies met AI - persoonlijk, slim en effectief.",
      keywords: "loopbaantrechter, de loopbaantrechter, heidi jansen, online loopbaanadvies, ai loopbaanadvies, werk dat bij je past, welk werk past bij mij, weten wat je wilt"
    },
    "/over-vinster": {
      title: "De Loopbaantrechter van Heidi Jansen | Vinster",
      description: "Ontmoet Heidi Jansen, bedenker van de Loopbaantrechter methode. 25+ jaar ervaring in online loopbaanadvies en loopbaanbegeleiding.",
      keywords: "heidi jansen, loopbaantrechter, de loopbaantrechter, online loopbaanadvies, loopbaanadviseur, loopbaanbegeleiding"
    },
    "/voor-wie-is-het": {
      title: "Welk werk past bij mij? | Online loopbaanadvies | Vinster",
      description: "Weet je niet welk werk bij je past? Vinster helpt je ontdekken wat je wilt met online loopbaanadvies. Voor werkenden, coaches en ouders.",
      keywords: "welk werk past bij mij, weten wat je wilt, werk dat bij je past, online loopbaanadvies, loopbaanbegeleiding, carrière advies"
    },
    "/veelgestelde-vragen": {
      title: "Veelgestelde vragen over AI loopbaanadvies | Vinster",
      description: "Alles over Vinster en de Loopbaantrechter methode. Hoe werkt AI in loopbaanadvies? Lees de antwoorden op veelgestelde vragen.",
      keywords: "ai loopbaanadvies, loopbaantrechter, online loopbaanadvies, vinster, heidi jansen, veelgestelde vragen"
    },
    "/contact": {
      title: "Contact | Vinster",
      description: "Neem contact op met het Vinster team voor vragen over online loopbaanadvies met de Loopbaantrechter methode.",
      keywords: "contact vinster, online loopbaanadvies, loopbaantrechter"
    }
  },
  en: {
    "/": {
      title: "Vinster | Find work that fits you with AI career advice",
      description: "Discover which job suits you with the Career Funnel method by Heidi Jansen. Online career advice with AI - personal, smart and effective.",
      keywords: "career advice, career funnel, heidi jansen, online career guidance, ai career advice, work that fits you"
    },
    "/over-vinster": {
      title: "The Career Funnel by Heidi Jansen | Vinster",
      description: "Meet Heidi Jansen, creator of the Career Funnel method. 25+ years of experience in online career advice.",
      keywords: "heidi jansen, career funnel, online career advice, career counselor"
    },
    "/voor-wie-is-het": {
      title: "What job suits me? | Online career advice | Vinster",
      description: "Don't know what work fits you? Vinster helps you discover what you want with online career advice.",
      keywords: "what job suits me, work that fits you, online career advice, career guidance"
    },
    "/veelgestelde-vragen": {
      title: "FAQ about AI career advice | Vinster",
      description: "Everything about Vinster and the Career Funnel method. How does AI work in career advice?",
      keywords: "ai career advice, career funnel, online career advice, vinster, faq"
    },
    "/contact": {
      title: "Contact | Vinster",
      description: "Contact the Vinster team for questions about online career advice.",
      keywords: "contact vinster, online career advice"
    }
  },
  de: {
    "/": {
      title: "Vinster | Finde Arbeit die zu dir passt mit KI-Karriereberatung",
      description: "Entdecke welcher Job zu dir passt mit der Karrieretrichter-Methode von Heidi Jansen. Online Karriereberatung mit KI.",
      keywords: "karriereberatung, karrieretrichter, heidi jansen, online karriereberatung, ki karriereberatung"
    },
    "/over-vinster": {
      title: "Der Karrieretrichter von Heidi Jansen | Vinster",
      description: "Lerne Heidi Jansen kennen, Erfinderin der Karrieretrichter-Methode. 25+ Jahre Erfahrung in Karriereberatung.",
      keywords: "heidi jansen, karrieretrichter, online karriereberatung"
    },
    "/voor-wie-is-het": {
      title: "Welcher Job passt zu mir? | Online Karriereberatung | Vinster",
      description: "Weißt du nicht welche Arbeit zu dir passt? Vinster hilft dir zu entdecken was du willst.",
      keywords: "welcher job passt zu mir, arbeit die passt, online karriereberatung"
    },
    "/veelgestelde-vragen": {
      title: "FAQ über KI-Karriereberatung | Vinster",
      description: "Alles über Vinster und die Karrieretrichter-Methode. Wie funktioniert KI in der Karriereberatung?",
      keywords: "ki karriereberatung, karrieretrichter, online karriereberatung, vinster"
    },
    "/contact": {
      title: "Kontakt | Vinster",
      description: "Kontaktiere das Vinster-Team für Fragen zur Online-Karriereberatung.",
      keywords: "kontakt vinster, online karriereberatung"
    }
  },
  no: {
    "/": {
      title: "Vinster | Finn arbeid som passer deg med AI-karriererådgivning",
      description: "Oppdag hvilken jobb som passer deg med Karrieretrakten-metoden av Heidi Jansen. Online karriererådgivning med AI.",
      keywords: "karriererådgivning, karrieretrakten, heidi jansen, online karriererådgivning, ai karriererådgivning"
    },
    "/over-vinster": {
      title: "Karrieretrakten av Heidi Jansen | Vinster",
      description: "Møt Heidi Jansen, skaperen av Karrieretrakten-metoden. 25+ års erfaring innen karriererådgivning.",
      keywords: "heidi jansen, karrieretrakten, online karriererådgivning"
    },
    "/voor-wie-is-het": {
      title: "Hvilken jobb passer for meg? | Online karriererådgivning | Vinster",
      description: "Vet du ikke hvilket arbeid som passer deg? Vinster hjelper deg å oppdage hva du vil.",
      keywords: "hvilken jobb passer for meg, arbeid som passer, online karriererådgivning"
    },
    "/veelgestelde-vragen": {
      title: "FAQ om AI-karriererådgivning | Vinster",
      description: "Alt om Vinster og Karrieretrakten-metoden. Hvordan fungerer AI i karriererådgivning?",
      keywords: "ai karriererådgivning, karrieretrakten, online karriererådgivning, vinster"
    },
    "/contact": {
      title: "Kontakt | Vinster",
      description: "Kontakt Vinster-teamet for spørsmål om online karriererådgivning.",
      keywords: "kontakt vinster, online karriererådgivning"
    }
  }
};

const SEOHead = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const langConfigs = seoConfigs[language] || seoConfigs.nl;
    const config = langConfigs[location.pathname] || langConfigs["/"];

    // Update title
    document.title = config.title;

    // Update meta description
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", config.description);
    }

    // Update meta keywords if available
    if (config.keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) {
        keywordsMeta.setAttribute("content", config.keywords);
      }
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", config.title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", config.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", `https://vinster.ai${location.pathname}`);

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", config.title);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute("content", config.description);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", `https://vinster.ai${location.pathname}`);
    }

    // Update html lang attribute
    document.documentElement.lang = language;

  }, [location.pathname, language]);

  return null;
};

export default SEOHead;
