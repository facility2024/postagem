/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22';

interface MagicLinkEmailProps {
  confirmationUrl: string;
  siteName?: string;
  siteUrl?: string;
  recipient?: string;
}

export default function MagicLinkEmail({ confirmationUrl, siteName = 'PostaFácil', siteUrl = 'https://coconudi.com', recipient }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>📅 PostaFácil</Text>
          </Section>
          <Text style={heading}>Seu link de acesso</Text>
          <Text style={paragraph}>
            Clique no botão abaixo para entrar na sua conta do PostaFácil. Este link é válido por tempo limitado.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={confirmationUrl}>
              Entrar no PostaFácil
            </Button>
          </Section>
          <Text style={paragraph}>
            Se você não solicitou este link, pode ignorar este email.
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
const btnContainer = { textAlign: 'center' as const, margin: '24px 0' };
const button = { backgroundColor: 'hsl(222.2, 47.4%, 11.2%)', color: 'hsl(210, 40%, 98%)', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold' as const, textDecoration: 'none', textAlign: 'center' as const, display: 'inline-block', padding: '12px 32px' };
const hr = { borderColor: 'hsl(214.3, 31.8%, 91.4%)', margin: '24px 0' };
const footer = { fontSize: '12px', color: 'hsl(215.4, 16.3%, 46.9%)', textAlign: 'center' as const };
