import { BookOpen } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="bg-primary p-2 rounded-xl group-hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                        <BookOpen size={24} className="text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-black tracking-wider text-foreground">
                        NEXORA
                    </span>
                </div>
                <div className="hidden md:block text-sm text-muted-foreground font-semibold tracking-widest uppercase">
                    Premium Library Tracker
                </div>
            </div>
        </nav>
    );
}