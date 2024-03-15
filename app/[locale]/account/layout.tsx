import { Container } from "@/app/components/Container";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="flex items-center justify-center md:w-4/12">
      {children}
    </Container>
  );
}
