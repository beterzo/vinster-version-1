
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


// Norwegian translations
import noNavigation from './no/navigation.json';
import noLanding from './no/landing.json';
import noAuth from './no/auth.json';
import noDashboard from './no/dashboard.json';
import noJourney from './no/journey.json';
import noProfessionals from './no/professionals.json';
import noCommon from './no/common.json';
import noAbout from './no/about.json';
import noForWhom from './no/for-whom.json';
import noFaq from './no/faq.json';
import noExperiences from './no/experiences.json';
import noContact from './no/contact.json';

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
    professionals: enProfessionals.professionals,
    common: enCommon,
    about: enAbout.about,
    for_whom: enForWhom.for_whom,
    faq: enFaq.faq,
    experiences: enExperiences.experiences,
    contact: enContact.contact,
    // Make privacy, terms and cookies keys available at top level
    privacy: enLanding.privacy,
    terms: enLanding.terms,
    cookies: enLanding.cookies
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
    professionals: nlProfessionals.professionals,
    common: nlCommon,
    about: nlAbout.about,
    for_whom: nlForWhom.for_whom,
    faq: nlFaq.faq,
    experiences: nlExperiences.experiences,
    contact: nlContact.contact,
    // Make privacy, terms and cookies keys available at top level
    privacy: nlLanding.privacy,
    terms: nlLanding.terms,
    cookies: nlLanding.cookies
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
    professionals: (deProfessionals as any).professionals || deProfessionals,
    common: deCommon,
    about: (deAbout as any).about || deAbout,
    for_whom: (deForWhom as any).for_whom || deForWhom,
    faq: (deFaq as any).faq || deFaq,
    experiences: (deExperiences as any).experiences || deExperiences,
    contact: (deContact as any).contact || deContact,
    // Make privacy, terms and cookies keys available at top level
    privacy: (deLanding as any).privacy || deLanding,
    terms: (deLanding as any).terms || deLanding,
    cookies: (deLanding as any).cookies || deLanding
  },


  no: {
    navigation: noNavigation,
    landing: (noLanding as any).landing || noLanding,
    auth: noAuth,
    // Make auth keys available at top level
    login: noAuth.login,
    signup: noAuth.signup,
    forgot_password: noAuth.forgot_password,
    reset_password: noAuth.reset_password,
    password_reset_success: (noAuth as any).password_reset_success || noAuth.reset_password,
    email_verification: (noAuth as any).email_verification || noAuth.forgot_password,
    email_confirmed: (noAuth as any).email_confirmed || noAuth.forgot_password,
    // Make mobile_menu available at top level
    mobile_menu: noNavigation.mobile_menu,
    // Make dashboard keys available at top level
    dashboard: (noDashboard as any).dashboard || noDashboard,
    payment: (noDashboard as any).payment || noDashboard,
    journey: noJourney,
    // Make journey keys available at top level
    enthousiasme: (noJourney as any).enthousiasme || noJourney,
    zoekprofiel: (noJourney as any).zoekprofiel || noJourney,
    profiel_voltooien: (noJourney as any).profiel_voltooien || noJourney,
    wensberoepen: (noJourney as any).wensberoepen || noJourney,
    professionals: (noProfessionals as any).professionals || noProfessionals,
    common: noCommon,
    about: (noAbout as any).about || noAbout,
    for_whom: (noForWhom as any).for_whom || noForWhom,
    faq: (noFaq as any).faq || noFaq,
    experiences: (noExperiences as any).experiences || noExperiences,
    contact: (noContact as any).contact || noContact,
    // Make privacy, terms and cookies keys available at top level
    privacy: (noLanding as any).privacy || noLanding,
    terms: (noLanding as any).terms || noLanding,
    cookies: (noLanding as any).cookies || noLanding
  }
};
