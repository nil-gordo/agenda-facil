
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link, Copy, ExternalLink } from "lucide-react";
import { api } from "@/services/api";
import { getPublicBookingUrl, copyToClipboard, isValidUrl } from "@/utils/urlUtils";

interface PublicBookingLinkProps {
  userId: string;
  showFullUrl?: boolean;
  showCopyButton?: boolean;
  showVisitButton?: boolean;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
}

const PublicBookingLink = ({
  userId,
  showFullUrl = true,
  showCopyButton = true,
  showVisitButton = true,
  className = "",
  variant = "outline"
}: PublicBookingLinkProps) => {
  const [publicUrl, setPublicUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadPublicUrl();
    }
  }, [userId]);

  const loadPublicUrl = async () => {
    setLoading(true);
    try {
      const response = await api.getPublicUrl(userId);
      if (response.success && response.data) {
        console.log("Public URL response:", response.data);
        setPublicUrl(response.data);
      } else {
        console.error("Error loading public URL:", response.error);
      }
    } catch (error) {
      console.error("Error loading public URL:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (publicUrl) {
      const fullUrl = getPublicBookingUrl(publicUrl);
      const success = await copyToClipboard(fullUrl);
      
      if (success) {
        toast.success("URL copiada al portapapeles");
      } else {
        toast.error("Error al copiar la URL");
      }
    }
  };

  // Ensure we have a valid URL for display and navigation
  const displayUrl = publicUrl ? getPublicBookingUrl(publicUrl) : "";
  const isUrlValid = displayUrl && isValidUrl(displayUrl);
  
  if (loading) {
    return <Skeleton className="h-9 w-full" />;
  }

  if (!publicUrl) {
    return <div className="text-sm text-muted-foreground">No se pudo cargar el enlace público</div>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background flex-1 overflow-hidden">
        <Link className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <span className="text-sm truncate">
          {showFullUrl ? displayUrl : "Enlace para reservas"}
        </span>
      </div>
      
      {showCopyButton && (
        <Button 
          variant={variant} 
          size="icon" 
          onClick={handleCopy}
          title="Copiar enlace"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
      
      {showVisitButton && isUrlValid && (
        <Button
          variant={variant}
          size="icon"
          asChild
          title="Visitar página de reservas"
        >
          <a href={displayUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
};

export default PublicBookingLink;
