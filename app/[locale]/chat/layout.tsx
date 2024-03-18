import { Container } from "@/app/components/Container";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="flex flex-row divide-x divide-gray-300 border md:w-10/12">
      {children}
    </Container>
  );
}
