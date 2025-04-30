import {
  Html,
  Head,
  Text,
  Hr,
  Section,
  Preview,
  Row,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email</Preview>
      <Section>
        <Text>
          Hello {username}, your verification code is {otp}
        </Text>
      </Section>
    </Html>
  );
}
