
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

// German translations
import deNavigation from './de/navigation.json';
import deLanding from './de/landing.json';
import deAuth from './de/auth.json';
import deDashboard from './de/dashboard.json';
import deJourney from './de/journey.json';
import deProfessionals from './de/professionals.json';
import deCommon from './de/common.json';
import deAbout from './de/about.json';
import deForWhom from './de/for-whom.json';
import deFaq from './de/faq.json';
import deExperiences from './de/experiences.json';
import deContact from './de/contact.json';

// Danish translations
import daNavigation from './da/navigation.json';
import daLanding from './da/landing.json';
import daAuth from './da/auth.json';
import daDashboard from './da/dashboard.json';
import daJourney from './da/journey.json';
import daProfessionals from './da/professionals.json';
import daCommon from './da/common.json';
import daAbout from './da/about.json';
import daForWhom from './da/for-whom.json';
import daFaq from './da/faq.json';
import daExperiences from './da/experiences.json';
import daContact from './da/contact.json';

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
    // Make mobile_menu available at top level
    mobile_menu: enNavigation.mobile_menu,
    // Make dashboard keys available at top level
    dashboard: enDashboard.dashboard,
    payment: enDashboard.payment,
    journey: enJourney,
    // Make journey keys available at top level
    enthousiasme: enJourney.enthousiasme,
    zoekprofiel: enJourney.zoekprofiel,
    profiel_voltooien: enJourney.profiel_voltooien,
    wensberoepen: enJourney.wensberoepen,
    onderzoeksplan: enJourney.onderzoeksplan,
    professionals: enProfessionals.professionals,
    common: enCommon,
    about: enAbout.about,
    for_whom: enForWhom.for_whom,
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
    // Make mobile_menu available at top level
    mobile_menu: nlNavigation.mobile_menu,
    // Make dashboard keys available at top level
    dashboard: nlDashboard.dashboard,
    payment: nlDashboard.payment,
    journey: nlJourney,
    // Make journey keys available at top level
    enthousiasme: nlJourney.enthousiasme,
    zoekprofiel: nlJourney.zoekprofiel,
    profiel_voltooien: nlJourney.profiel_voltooien,
    wensberoepen: nlJourney.wensberoepen,
    onderzoeksplan: nlJourney.onderzoeksplan,
    professionals: nlProfessionals.professionals,
    common: nlCommon,
    about: nlAbout.about,
    for_whom: nlForWhom.for_whom,
    faq: nlFaq.faq,
    experiences: nlExperiences.experiences,
    contact: nlContact.contact
  },
  de: {
    navigation: deNavigation,
    landing: deLanding.landing,
    auth: deAuth,
    // Make auth keys available at top level
    login: deAuth.login,
    signup: deAuth.signup,
    forgot_password: deAuth.forgot_password,
    reset_password: deAuth.reset_password,
    password_reset_success: (deAuth as any).password_reset_success || deAuth.reset_password,
    email_verification: deAuth.email_verification,
    email_confirmed: (deAuth as any).email_confirmed || deAuth.email_verification,
    // Make mobile_menu available at top level
    mobile_menu: deNavigation.mobile_menu,
    // Make dashboard keys available at top level
    dashboard: (deDashboard as any).dashboard || deDashboard,
    payment: (deDashboard as any).payment || deDashboard,
    journey: deJourney,
    // Make journey keys available at top level
    enthousiasme: deJourney.enthousiasme,
    zoekprofiel: deJourney.zoekprofiel,
    profiel_voltooien: deJourney.profiel_voltooien,
    wensberoepen: deJourney.wensberoepen,
    onderzoeksplan: deJourney.onderzoeksplan,
    professionals: (deProfessionals as any).professionals || deProfessionals,
    common: deCommon,
    about: (deAbout as any).about || deAbout,
    for_whom: (deForWhom as any).for_whom || deForWhom,
    faq: (deFaq as any).faq || deFaq,
    experiences: (deExperiences as any).experiences || deExperiences,
    contact: (deContact as any).contact || deContact
  },
  da: {
    navigation: daNavigation,
    landing: daLanding.landing,
    auth: daAuth,
    // Make auth keys available at top level
    login: daAuth.login,
    signup: daAuth.signup,
    forgot_password: daAuth.forgot_password,
    reset_password: daAuth.reset_password,
    password_reset_success: daAuth.password_reset_success,
    email_verification: daAuth.email_verification,
    email_confirmed: daAuth.email_confirmed,
    // Make mobile_menu available at top level
    mobile_menu: daNavigation.mobile_menu,
    // Make dashboard keys available at top level
    dashboard: daDashboard.dashboard,
    payment: daDashboard.payment,
    journey: daJourney,
    // Make journey keys available at top level
    enthousiasme: daJourney.enthousiasme,
    zoekprofiel: daJourney.zoekprofiel,
    profiel_voltooien: daJourney.profiel_voltooien,
    wensberoepen: daJourney.wensberoepen,
    onderzoeksplan: daJourney.onderzoeksplan,
    professionals: daProfessionals.professionals,
    common: daCommon,
    about: daAbout.about,
    for_whom: daForWhom.for_whom,
    faq: daFaq.faq,
    experiences: daExperiences.experiences,
    "contact": daContact.contact
  }
};
