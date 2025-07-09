
// English translations
import enNavigation from './en/navigation.json';
import enLanding from './en/landing.json';
import enAuth from './en/auth.json';
import enDashboard from './en/dashboard.json';
import enJourney from './en/journey.json';
import enProfessionals from './en/professionals.json';
import enCommon from './en/common.json';
import enAbout from './en/about.json';
import enForWhom from './en/for-whom.json';
import enFaq from './en/faq.json';
import enExperiences from './en/experiences.json';
import enContact from './en/contact.json';

// Dutch translations
import nlNavigation from './nl/navigation.json';
import nlLanding from './nl/landing.json';
import nlAuth from './nl/auth.json';
import nlDashboard from './nl/dashboard.json';
import nlJourney from './nl/journey.json';
import nlProfessionals from './nl/professionals.json';
import nlCommon from './nl/common.json';
import nlAbout from './nl/about.json';
import nlForWhom from './nl/for-whom.json';
import nlFaq from './nl/faq.json';
import nlExperiences from './nl/experiences.json';
import nlContact from './nl/contact.json';

export const translations = {
  en: {
    ...enNavigation,
    ...enLanding,
    ...enAuth,
    ...enDashboard,
    ...enJourney,
    ...enProfessionals,
    ...enCommon,
    ...enAbout,
    ...enForWhom,
    ...enFaq,
    ...enExperiences,
    ...enContact
  },
  nl: {
    ...nlNavigation,
    ...nlLanding,
    ...nlAuth,
    ...nlDashboard,
    ...nlJourney,
    ...nlProfessionals,
    ...nlCommon,
    ...nlAbout,
    ...nlForWhom,
    ...nlFaq,
    ...nlExperiences,
    ...nlContact
  }
};
