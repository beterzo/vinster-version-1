
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Img
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PasswordResetEmailProps {
  resetUrl: string;
  userEmail: string;
}

export const PasswordResetEmailEN = ({
  resetUrl,
  userEmail,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Vinster password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src="https://vinster.ai/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png"
            width="120"
            height="48"
            alt="Vinster Logo"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Password Reset</Heading>
        
        <Text style={text}>
          Hello,
        </Text>
        
        <Text style={text}>
          You have requested to reset your password for your Vinster account ({userEmail}).
        </Text>
        
        <Text style={text}>
          Click the button below to set a new password:
        </Text>
        
        <Section style={buttonContainer}>
          <Link href={resetUrl} style={button}>
            Reset Password
          </Link>
        </Section>
        
        <Text style={text}>
          This link is valid for 24 hours. If you didn't request this, you can safely ignore this email.
        </Text>
        
        <Text style={footer}>
          Best regards,<br />
          The Vinster Team<br />
          <Link href="https://vinster.ai" style={footerLink}>vinster.ai</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logoSection = {
  padding: '0 0 20px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1e3a8a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
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
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  fontWeight: 'bold',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 0 0',
  textAlign: 'center' as const,
};

const footerLink = {
  color: '#1e3a8a',
  textDecoration: 'underline',
};
