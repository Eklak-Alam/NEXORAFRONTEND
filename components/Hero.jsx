export default function Hero() {
    return (
        <div className="pt-10 pb-16 px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight drop-shadow-sm">
                Command Your <span className="text-primary">Library.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                Keep track of the books you've conquered and the ones waiting on your shelf. 
                Built for speed, designed for readers.
            </p>
        </div>
    );
}