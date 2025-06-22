
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
  <Html>
    <Head />
    <Preview>Bevestig je Vinster account om te beginnen</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welkom bij Vinster!</Heading>
        
        <Text style={text}>
          Hallo {firstName} {lastName},
        </Text>
        
        <Text style={text}>
          Bedankt voor het aanmaken van je account bij Vinster. Om je account te activeren en te beginnen met het ontdekken van je loopbaanmogelijkheden, klik je op onderstaande knop:
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={verificationUrl}>
            Activeer mijn account
          </Button>
        </Section>

        <Text style={text}>
          Of kopieer en plak deze link in je browser:
        </Text>
        
        <Text style={link}>
          {verificationUrl}
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          Als je dit account niet hebt aangemaakt, kun je deze email negeren.
        </Text>

        <Text style={footer}>
          Met vriendelijke groet,<br />
          Het Vinster Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#1e3a8a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#1e3a8a',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const link = {
  color: '#2563eb',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
};
