
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface SendEmailOptions {
  type: 'welcome' | 'confirmation'
  to: string
  firstName?: string
  confirmationUrl?: string
  loginUrl?: string
}

export const useEmailService = () => {
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const sendEmail = async (options: SendEmailOptions) => {
    setIsSending(true)
    console.log('📧 Sending email via edge function:', options)

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: options
      })

      if (error) {
        console.error('❌ Email service error:', error)
        throw error
      }

      console.log('✅ Email sent successfully:', data)
      
      toast({
        title: "Email verstuurd",
        description: "De email is succesvol verzonden.",
      })

      return { success: true, data }
    } catch (error: any) {
      console.error('❌ Failed to send email:', error)
      
      toast({
        title: "Email fout",
        description: "Er ging iets mis bij het versturen van de email.",
        variant: "destructive",
      })

      return { success: false, error: error.message }
    } finally {
      setIsSending(false)
    }
  }

  const sendWelcomeEmail = async (to: string, firstName?: string, loginUrl?: string) => {
    return sendEmail({
      type: 'welcome',
      to,
      firstName,
      loginUrl
    })
  }

  const sendConfirmationEmail = async (to: string, confirmationUrl: string, firstName?: string) => {
    return sendEmail({
      type: 'confirmation',
      to,
      confirmationUrl,
      firstName
    })
  }

  return {
    sendEmail,
    sendWelcomeEmail,
    sendConfirmationEmail,
    isSending
  }
}
