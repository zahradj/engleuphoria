
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  return (
    <footer className="bg-white py-4 border-t">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Engleuphoria. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
