
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Euro, Pencil, Trash2 } from "lucide-react";

interface ServiceCardProps {
  id: string;
  name: string;
  duration: number;
  price: number;
  isEditable?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ServiceCard = ({
  id,
  name,
  duration,
  price,
  isEditable = false,
  onEdit,
  onDelete
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <Card 
        className="h-full overflow-hidden border border-border shadow-sm transition-shadow hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium">{name}</CardTitle>
            {isEditable && isHovered && (
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit && onEdit(id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete && onDelete(id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <CardDescription className="text-muted-foreground line-clamp-2">
            Servicio configurable con diferentes opciones disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {duration} min
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Euro className="h-3 w-3" />
              {price}€
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          {!isEditable && (
            <Button className="w-full" variant="outline">
              Reservar
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
