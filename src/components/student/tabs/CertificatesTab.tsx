import { CertificatesList } from '@/components/certificates/CertificatesList';

export function CertificatesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Certificates</h2>
        <p className="text-muted-foreground">
          View and download your earned certificates
        </p>
      </div>
      <CertificatesList />
    </div>
  );
}