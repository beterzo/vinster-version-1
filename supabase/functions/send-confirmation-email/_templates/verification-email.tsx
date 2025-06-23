
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
    <Preview>Activeer je account en log direct in</Preview>
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        <Section style={contentSection}>
          <Heading style={vinsterTitleStyle}>
            Vinster
          </Heading>
          <Text style={taglineStyle}>
            Jouw venster op de toekomst
          </Text>
          <Heading style={headingStyle}>
            Bevestig je email adres
          </Heading>
          <Text style={descriptionStyle}>
            Bedankt voor je aanmelding! Klik op de knop hieronder om je account te activeren en direct in te loggen.
          </Text>
          <Button style={buttonStyle} href={verificationUrl}>
            Activeer mijn account
          </Button>
        </Section>
        
        <Hr style={hrStyle} />
        
        <Text style={footerStyle}>
          Als je dit account niet hebt aangemaakt, kun je deze email negeren.
        </Text>
        
        <Text style={footerStyle}>
          Met vriendelijke groet,<br />
          Team Vinster
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
