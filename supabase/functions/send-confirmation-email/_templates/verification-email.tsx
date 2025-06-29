import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface VerificationEmailProps {
  firstName: string;
  lastName: string;
  verificationUrl: string;
  email: string;
  language?: string;
}

// Translation object for email content
const translations = {
  nl: {
    preview: "Activeer je account en log direct in",
    tagline: "Jouw venster op de toekomst",
    heading: "Bevestig je email adres",
    description: "Bedankt voor je aanmelding! Klik op de knop hieronder om je account te activeren en direct in te loggen.",
    buttonText: "Activeer mijn account",
    footerDisclaimer: "Als je dit account niet hebt aangemaakt, kun je deze email negeren.",
    footerGreeting: "Met vriendelijke groet,",
    footerSignature: "Team Vinster"
  },
  en: {
    preview: "Activate your account and log in directly",
    tagline: "Your window to the future",
    heading: "Confirm your email address",
    description: "Thanks for signing up! Click the button below to activate your account and log in directly.",
    buttonText: "Activate my account",
    footerDisclaimer: "If you didn't create this account, you can safely ignore this email.",
    footerGreeting: "Best regards,",
    footerSignature: "Team Vinster"
  }
};

export const VerificationEmail = ({
  firstName,
  lastName,
  verificationUrl,
  email,
  language = 'nl',
}: VerificationEmailProps) => {
  const t = translations[language as keyof typeof translations] || translations.nl;
  
  return (
    <Html dir="ltr" lang={language}>
      <Head>
        <style>
          {`
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              mso-font-alt: 'Helvetica';
              src: url(https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2) format('woff2');
            }
            
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 600;
              mso-font-alt: 'Helvetica';
              src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fjbvMwCp50PDca1ZL7.woff2) format('woff2');
            }
            
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 700;
              mso-font-alt: 'Helvetica';
              src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fjbvMwCp50BTca1ZL7.woff2) format('woff2');
            }
            
            * {
              font-family: 'Inter', Helvetica;
            }
          `}
        </style>
      </Head>
      <Preview>{t.preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={contentSection}>
            <Heading style={vinsterTitleStyle}>
              Vinster
            </Heading>
            <Text style={taglineStyle}>
              {t.tagline}
            </Text>
            <Heading style={headingStyle}>
              {t.heading}
            </Heading>
            <Text style={descriptionStyle}>
              {t.description}
            </Text>
            <Button style={buttonStyle} href={verificationUrl}>
              {t.buttonText}
            </Button>
          </Section>
          
          <Hr style={hrStyle} />
          
          <Text style={footerStyle}>
            {t.footerDisclaimer}
          </Text>
          
          <Text style={footerStyle}>
            {t.footerGreeting}<br />
            {t.footerSignature}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

const bodyStyle = {
  margin: '0',
  marginLeft: '12px',
  marginRight: '12px',
  fontFamily: "'Inter', Helvetica",
  backgroundColor: '#F8F9FA',
};

const containerStyle = {
  maxWidth: '37.5em',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box' as const,
  paddingTop: '2rem',
  paddingBottom: '2rem',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  marginTop: '2rem',
  marginBottom: '2rem',
};

const contentSection = {
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center' as const,
  paddingLeft: '24px',
  paddingRight: '24px',
};

const vinsterTitleStyle = {
  margin: '0px',
  marginBottom: '8px',
  fontSize: '32px',
  lineHeight: '36px',
  fontWeight: '700',
  color: '#E4C05B',
  textAlign: 'center' as const,
};

const taglineStyle = {
  margin: '0px',
  marginBottom: '24px',
  fontSize: '14px',
  lineHeight: '18px',
  color: '#232D4B',
  textAlign: 'center' as const,
};

const headingStyle = {
  margin: '0px',
  marginTop: '24px',
  marginBottom: '16px',
  fontSize: '28px',
  lineHeight: '32px',
  fontWeight: '600',
  color: '#111827',
};

const descriptionStyle = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#6B7280',
  marginTop: '16px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const buttonStyle = {
  lineHeight: '100%',
  textDecoration: 'none',
  display: 'inline-block',
  maxWidth: '100%',
  marginTop: '16px',
  marginBottom: '24px',
  borderRadius: '8px',
  backgroundColor: '#FFCD3E',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '16px',
  paddingBottom: '16px',
  fontWeight: '600',
  fontSize: '16px',
  color: '#1F2937',
  border: 'none',
};

const hrStyle = {
  borderColor: '#E5E7EB',
  margin: '32px 24px',
};

const footerStyle = {
  color: '#6B7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 24px',
  textAlign: 'center' as const,
};
