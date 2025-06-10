import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, icons as lucideIcons } from 'lucide-react';
import type { TravelTip } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';


// Dummy data
const dummyAdminTravelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Stay Hydrated',
    slug: 'stay-hydrated',
    content: 'Drink plenty of water.',
    icon: 'Droplet', // Lucide icon name
    category: 'Health',
    status: 'published',
    created_at: '2023-05-01T10:00:00Z',
    updated_at: '2023-05-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Pack Light Layers',
    slug: 'pack-light-layers',
    content: 'Temperatures vary.',
    icon: 'Layers',
    category: 'Packing',
    status: 'draft',
    created_at: '2023-05-05T11:00:00Z',
    updated_at: '2023-05-05T11:00:00Z',
  },
];

const DynamicIcon = ({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) => {
  const Icon = lucideIcons[name as keyof typeof lucideIcons] as LucideIcon | undefined;
  if (!Icon) return <lucideIcons.HelpCircle {...props} />; // Default icon if not found
  return <Icon {...props} />;
};


export default async function AdminTravelTipsPage() {
  const travelTips = dummyAdminTravelTips;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">Manage Travel Tips</h1>
        <Button asChild>
          <Link href="/admin/travel-tips/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Travel Tip
          </Link>
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {travelTips.length > 0 ? (
              travelTips.map((tip) => (
                <TableRow key={tip.id}>
                  <TableCell>
                    <DynamicIcon name={tip.icon} className="h-5 w-5 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">{tip.title}</TableCell>
                  <TableCell>{tip.category}</TableCell>
                  <TableCell>
                    <Badge variant={tip.status === 'published' ? 'default' : 'secondary'}>
                      {tip.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="mr-2 hover:text-primary">
                      <Link href={`/admin/travel-tips/${tip.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No travel tips found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
