export default function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Tanzania Tourist Trails. All rights reserved.</p>
        <p>Discover the beauty of Tanzania.</p>
      </div>
    </footer>
  );
}
