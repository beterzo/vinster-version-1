
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
    navigation: enNavigation,
    landing: enLanding.landing,
    auth: enAuth,
    // Make auth keys available at top level
    login: enAuth.login,
    signup: enAuth.signup,
    forgot_password: enAuth.forgot_password,
    reset_password: enAuth.reset_password,
    password_reset_success: enAuth.password_reset_success,
    email_verification: enAuth.email_verification,
    email_confirmed: enAuth.email_confirmed,
    dashboard: enDashboard,
    journey: enJourney,
    professionals: enProfessionals.professionals,
    common: enCommon,
    about: enAbout.about,
    forWhom: enForWhom.for_whom,
    faq: enFaq.faq,
    experiences: enExperiences.experiences,
    contact: enContact.contact
  },
  nl: {
    navigation: nlNavigation,
    landing: nlLanding.landing,
    auth: nlAuth,
    // Make auth keys available at top level
    login: nlAuth.login,
    signup: nlAuth.signup,
    forgot_password: nlAuth.forgot_password,
    reset_password: nlAuth.reset_password,
    password_reset_success: nlAuth.password_reset_success,
    email_verification: nlAuth.email_verification,
    email_confirmed: nlAuth.email_confirmed,
    dashboard: nlDashboard,
    journey: nlJourney,
    professionals: nlProfessionals.professionals,
    common: nlCommon,
    about: nlAbout.about,
    forWhom: nlForWhom.for_whom,
    faq: nlFaq.faq,
    experiences: nlExperiences.experiences,
    contact: nlContact.contact
  }
};
