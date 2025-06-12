
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <div className="mb-2">
          <Link href="/#feedback-section" className="hover:text-primary hover:underline">
            Leave Feedback
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
