import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/">
        <Button variant="ghost" className="mb-8 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад на главную
        </Button>
      </Link>
      {children}
    </div>
  );
}
