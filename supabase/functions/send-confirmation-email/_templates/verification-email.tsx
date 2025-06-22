
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
  Img,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface VerificationEmailProps {
  firstName: string;
  lastName: string;
  verificationUrl: string;
  email: string;
}

export const VerificationEmail = ({
  firstName,
  lastName,
  verificationUrl,
  email,
}: VerificationEmailProps) => (
  <Html dir="ltr" lang="nl">
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
    <Preview>Bevestig je Vinster account om te beginnen</Preview>
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        <Section style={imageSection}>
          <Img
            alt="Vinster Logo"
            height="120"
            src="https://vinster-version-1.lovable.app/lovable-uploads/vinster-new-logo.png"
            style={logoStyle}
          />
          <Section style={contentSection}>
            <Text style={subtitleStyle}>
              Account Verificatie
            </Text>
            <Heading style={headingStyle}>
              Bevestig je Vinster account
            </Heading>
            <Text style={descriptionStyle}>
              Welkom bij Vinster, {firstName} {lastName}! We zijn blij dat je je hebt aangemeld. 
              Om je account te activeren en te beginnen met het ontdekken van je loopbaanmogelijkheden, 
              klik je op onderstaande knop om je e-mailadres te bevestigen.
            </Text>
            <Button style={buttonStyle} href={verificationUrl}>
              Activeer mijn account
            </Button>
          </Section>
        </Section>
        
        <Hr style={hrStyle} />
        
        <Text style={footerStyle}>
          Als je dit account niet hebt aangemaakt, kun je deze email negeren.
        </Text>
        
        <Text style={footerStyle}>
          Met vriendelijke groet,<br />
          Het Vinster Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const bodyStyle = {
  margin: '0',
  marginLeft: '12px',
  marginRight: '12px',
  fontFamily: "'Inter', Helvetica",
};

const containerStyle = {
  maxWidth: '37.5em',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box' as const,
  paddingTop: '1rem',
  paddingBottom: '1rem',
  height: '100vh',
};

const imageSection = {
  marginTop: '16px',
  marginBottom: '16px',
};

const logoStyle = {
  display: 'block',
  outline: 'none',
  border: 'none',
  textDecoration: 'none',
  width: '120px',
  height: '120px',
  borderRadius: '12px',
  objectFit: 'contain' as const,
  margin: '0 auto',
};

const contentSection = {
  marginTop: '32px',
  textAlign: 'center' as const,
};

const subtitleStyle = {
  fontSize: '18px',
  lineHeight: '28px',
  marginTop: '16px',
  marginBottom: '16px',
  fontWeight: '600',
  color: '#FFCD3E',
  margin: '0',
};

const headingStyle = {
  margin: '0px',
  marginTop: '8px',
  fontSize: '36px',
  lineHeight: '36px',
  fontWeight: '600',
  color: '#111827',
};

const descriptionStyle = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#6B7280',
  marginTop: '16px',
  marginBottom: '16px',
};

const buttonStyle = {
  lineHeight: '100%',
  textDecoration: 'none',
  display: 'inline-block',
  maxWidth: '100%',
  marginTop: '16px',
  borderRadius: '8px',
  backgroundColor: '#FFCD3E',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '12px',
  paddingBottom: '12px',
  fontWeight: '600',
  color: '#1F2937',
  border: 'none',
};

const hrStyle = {
  borderColor: '#E5E7EB',
  margin: '32px 0',
};

const footerStyle = {
  color: '#6B7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
  textAlign: 'center' as const,
};
