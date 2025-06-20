
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEmailService } from '@/hooks/useEmailService'

const EmailTestComponent = () => {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const { sendWelcomeEmail, sendConfirmationEmail, isSending } = useEmailService()

  const handleSendWelcome = async () => {
    if (!email) return
    await sendWelcomeEmail(email, firstName || undefined)
  }

  const handleSendConfirmation = async () => {
    if (!email) return
    const confirmationUrl = `${window.location.origin}/confirm-email?token=demo123`
    await sendConfirmationEmail(email, confirmationUrl, firstName || undefined)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle style={{ color: '#21324E' }}>Email Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="email"
          placeholder="Email adres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Voornaam (optioneel)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleSendWelcome}
            disabled={!email || isSending}
            style={{ backgroundColor: '#FFCD3E', color: '#21324E' }}
          >
            {isSending ? 'Versturen...' : 'Verstuur Welkom Email'}
          </Button>
          <Button 
            onClick={handleSendConfirmation}
            disabled={!email || isSending}
            variant="outline"
            style={{ borderColor: '#21324E', color: '#21324E' }}
          >
            {isSending ? 'Versturen...' : 'Verstuur Bevestiging Email'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmailTestComponent
