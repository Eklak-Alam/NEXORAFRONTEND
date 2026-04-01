export default function Footer() {
    return (
        <footer className="bg-card border-t border-border py-8 text-center mt-auto transition-colors">
            <p className="text-sm text-muted-foreground font-medium tracking-wide">
                &copy; {new Date().getFullYear()} Nexora Systems. Engineered with Next.js & Node.
            </p>
        </footer>
    );
}