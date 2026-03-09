/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Hr } from 'npm:@react-email/components@0.0.22';

interface ReauthenticationEmailProps {
  token: string;
  siteName?: string;
  siteUrl?: string;
  recipient?: string;
}

export default function ReauthenticationEmail({ token, siteName = 'PostaFácil', siteUrl = 'https://coconudi.com', recipient }: ReauthenticationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>📅 PostaFácil</Text>
          </Section>
          <Text style={heading}>Código de verificação</Text>
          <Text style={paragraph}>
            Use o código abaixo para confirmar sua identidade:
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{token}</Text>
          </Section>
          <Text style={paragraph}>
            Este código é válido por tempo limitado. Se você não solicitou, pode ignorar este email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>PostaFácil — Agendamento de postagens para redes sociais</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px' };
const header = { textAlign: 'center' as const, marginBottom: '24px' };
const logo = { fontSize: '28px', fontWeight: 'bold' as const, color: 'hsl(222.2, 47.4%, 11.2%)', margin: '0' };
const heading = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(222.2, 47.4%, 11.2%)', textAlign: 'center' as const, margin: '0 0 16px' };
const paragraph = { fontSize: '15px', lineHeight: '1.6', color: 'hsl(215.4, 16.3%, 46.9%)', margin: '0 0 16px' };
const codeContainer = { textAlign: 'center' as const, margin: '24px 0', backgroundColor: 'hsl(210, 40%, 96.1%)', borderRadius: '8px', padding: '16px' };
const code = { fontSize: '32px', fontWeight: 'bold' as const, color: 'hsl(222.2, 47.4%, 11.2%)', letterSpacing: '4px', margin: '0' };
const hr = { borderColor: 'hsl(214.3, 31.8%, 91.4%)', margin: '24px 0' };
const footer = { fontSize: '12px', color: 'hsl(215.4, 16.3%, 46.9%)', textAlign: 'center' as const };
