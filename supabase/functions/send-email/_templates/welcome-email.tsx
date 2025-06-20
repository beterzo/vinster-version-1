
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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  firstName?: string
  loginUrl?: string
}

export const WelcomeEmail = ({
  firstName = "daar",
  loginUrl = "https://vinster.nl/login",
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welkom bij Vinster - Jouw venster op de toekomst</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <img
            src="https://aqajxxevifmhdjlvqhkz.supabase.co/storage/v1/object/public/images/vinster-logo.png"
            width="40"
            height="40"
            alt="Vinster Logo"
            style={logo}
          />
          <Text style={logoText}>Vinster</Text>
        </Section>
        
        <Heading style={h1}>Welkom bij Vinster, {firstName}!</Heading>
        
        <Text style={text}>
          Wat fijn dat je je hebt aangemeld voor <strong>Vinster</strong> - jouw venster op de toekomst. 
          Je bent nu klaar om te ontdekken waar jouw passie en talent samenkomen.
        </Text>
        
        <Text style={text}>
          Met Vinster krijg je:
        </Text>
        
        <ul style={list}>
          <li style={listItem}>Een persoonlijke enthousiasmescan</li>
          <li style={listItem}>Inzicht in jouw ideale wensberoepen</li>
          <li style={listItem}>Een op maat gemaakt loopbaanrapport</li>
          <li style={listItem}>Concrete stappen voor jouw carrière</li>
        </ul>
        
        <Section style={buttonSection}>
          <Button style={button} href={loginUrl}>
            Start je reis naar je ideale baan
          </Button>
        </Section>
        
        <Text style={text}>
          Heb je vragen? Neem gerust contact met ons op via hello@vinster.nl
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          Met vriendelijke groet,<br />
          Het Vinster team
        </Text>
        
        <Text style={footerSmall}>
          Deze email is verstuurd omdat je je hebt aangemeld voor Vinster. 
          Als je deze email ten onrechte hebt ontvangen, kun je deze negeren.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

// Styling die past bij Vinster's huisstijl
const main = {
  backgroundColor: '#f8f9fa',
  fontFamily: '"urw-form", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

const logoSection = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '32px',
  justifyContent: 'center',
}

const logo = {
  marginRight: '12px',
}

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#253857',
  margin: '0',
}

const h1 = {
  color: '#21324E',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
  lineHeight: '1.3',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const list = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
  paddingLeft: '20px',
}

const listItem = {
  margin: '8px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#FFCD3E',
  color: '#21324E',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  border: 'none',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '16px 0',
}

const footerSmall = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '1.4',
  textAlign: 'center' as const,
  margin: '16px 0 0 0',
}
