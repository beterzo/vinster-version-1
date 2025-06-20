
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

interface ConfirmationEmailProps {
  confirmationUrl: string
  firstName?: string
}

export const ConfirmationEmail = ({
  confirmationUrl,
  firstName = "daar",
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Bevestig je email voor Vinster</Preview>
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
        
        <Heading style={h1}>Bevestig je emailadres</Heading>
        
        <Text style={text}>
          Hoi {firstName},
        </Text>
        
        <Text style={text}>
          Bedankt voor je aanmelding bij <strong>Vinster</strong>! Om je account te activeren, 
          hebben we je emailadres nodig voor bevestiging.
        </Text>
        
        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            Bevestig mijn emailadres
          </Button>
        </Section>
        
        <Text style={smallText}>
          Of kopieer en plak deze link in je browser:
        </Text>
        <Link href={confirmationUrl} style={link}>
          {confirmationUrl}
        </Link>
        
        <Text style={text}>
          Deze link is 24 uur geldig. Daarna kun je een nieuwe aanvragen.
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          Met vriendelijke groet,<br />
          Het Vinster team
        </Text>
        
        <Text style={footerSmall}>
          Als je dit account niet hebt aangemaakt, kun je deze email veilig negeren.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

// Styling consistent met Vinster's huisstijl
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

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '16px 0 8px 0',
}

const link = {
  color: '#FFCD3E',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
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
