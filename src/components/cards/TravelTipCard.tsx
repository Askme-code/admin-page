import type { TravelTip } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Luggage, Users, Utensils, HeartHandshake, icons as lucideIcons } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TravelTipCardProps {
  tip: TravelTip;
}

const iconMap: { [key: string]: LucideIcon } = {
  safety: ShieldCheck,
  packing: Luggage,
  culture: Users,
  food: Utensils,
  etiquette: HeartHandshake,
  default: Info, // A generic icon from lucide-react, you might need to import Info if you use this
};

export default function TravelTipCard({ tip }: TravelTipCardProps) {
  // Attempt to find a specific icon, or use a default.
  // The tip.icon field should ideally store a key from iconMap or a valid Lucide icon name.
  const IconComponent = iconMap[tip.icon.toLowerCase()] || (lucideIcons[tip.icon as keyof typeof lucideIcons] as LucideIcon | undefined) || iconMap.default;


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        {IconComponent && <IconComponent className="h-10 w-10 text-primary" />}
        <CardTitle className="font-headline text-xl leading-tight">{tip.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm">{tip.content}</CardDescription>
        <div className="mt-3">
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{tip.category}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component to render Lucide icons dynamically by name (if needed elsewhere)
// For this card, we use a direct mapping or a default.
// const DynamicIcon = ({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) => {
//   const Icon = icons[name as keyof typeof icons] as LucideIcon | undefined;
//   if (!Icon) return null; // Or return a default icon
//   return <Icon {...props} />;
// };

// You need to import `Info` if you use it as a default
import { Info } from 'lucide-react'; 
