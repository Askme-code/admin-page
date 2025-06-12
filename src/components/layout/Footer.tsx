
import Link from 'next/link';
import { Mail, MessageSquare, Facebook, Instagram } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const socialLinks = [
  {
    href: 'mailto:kimumilangali@gmail.com',
    label: 'Email: kimumilangali@gmail.com',
    icon: Mail,
    name: "Email"
  },
  {
    href: 'https://wa.me/255678537803', // Links to the first WhatsApp number
    label: 'WhatsApp: +255678537803 / +255652810564',
    icon: MessageSquare, // Using MessageSquare for WhatsApp
    name: "WhatsApp"
  },
  {
    href: 'https://www.facebook.com/MilaKimuProfile', // Placeholder URL - UPDATE THIS
    label: 'Facebook: Mila Kimu (Update with actual profile URL)',
    icon: Facebook,
    name: "Facebook"
  },
  {
    href: 'https://www.instagram.com/milakimu/',
    label: 'Instagram: Mila Kimu',
    icon: Instagram,
    name: "Instagram"
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        
        <div className="mb-8">
          <p className="text-base font-semibold text-foreground mb-4">Connect with Milangali Kimu</p>
          <div className="flex justify-center items-center gap-x-3 sm:gap-x-4">
            <TooltipProvider>
              {socialLinks.map((link) => (
                <Tooltip key={link.name}>
                  <TooltipTrigger asChild>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Contact Milangali Kimu via ${link.name}`}
                      className="p-2.5 rounded-full text-foreground hover:bg-accent/10 hover:text-accent-foreground transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                      <link.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>

        <div className="mb-4">
          <Link href="/#feedback-section" className="hover:text-primary hover:underline">
            Leave Feedback
          </Link>
          <span className="mx-2">|</span>
          <Link href="/#submit-review-section" className="hover:text-primary hover:underline">
            Share Your Review
          </Link>
          <span className="mx-2">|</span>
          <Link href="/admin" className="hover:text-primary hover:underline">
            Admin Panel
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Tanzania Tourist Trails. All rights reserved.</p>
        <p>Discover the beauty of Tanzania.</p>
      </div>
    </footer>
  );
}
