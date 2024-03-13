import { Container } from "@/app/components/Container";
import PanelContainer from "./PanelContainer";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="flex flex-row divide-x divide-gray-300 border md:w-10/12">
      <div className="flex h-full w-1/3 flex-row">
        <PanelContainer />
      </div>
      {children}
    </Container>
  );
}
