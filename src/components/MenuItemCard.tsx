import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
    item: {
        id: string;
        name: string;
        description: string;
        price: number;
        image_url: string;
        dietary_tags: string[];
    };
    onAdd: (item: any) => void;
    onClick: (id: string) => void;
}

export function MenuItemCard({ item, onAdd, onClick }: MenuItemCardProps) {
    const [isAdded, setIsAdded] = useState(false);

    // Cleanup timeout if component unmounts
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isAdded) {
            timeout = setTimeout(() => setIsAdded(false), 800);
        }
        return () => clearTimeout(timeout);
    }, [isAdded]);

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAdd(item);
        setIsAdded(true);
    };

    return (
        <div
            className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800 cursor-pointer transform hover:-translate-y-1"
            onClick={() => onClick(item.id)}
        >
            <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    {item.dietary_tags.map((tag) => (
                        <span
                            key={tag}
                            className={cn(
                                "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm",
                                tag === "Veg" ? "bg-green-500/90 text-white" : "",
                                tag === "Non-Veg" ? "bg-red-500/90 text-white" : "",
                                tag !== "Veg" && tag !== "Non-Veg" ? "bg-white/90 text-zinc-900 dark:bg-black/80 dark:text-white" : ""
                            )}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-semibold text-xl leading-tight line-clamp-2 title-font">
                        {item.name}
                    </h3>
                    <span className="font-bold text-lg text-primary whitespace-nowrap">
                        ₹{item.price}
                    </span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-6 flex-grow">
                    {item.description}
                </p>
                <div className="mt-auto relative">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        onClick={handleAddClick}
                        className={cn(
                            "w-full py-3 px-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-colors duration-300 relative overflow-hidden",
                            isAdded
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-zinc-100 hover:bg-primary hover:text-white dark:bg-zinc-800 dark:hover:bg-primary text-zinc-900 dark:text-zinc-100"
                        )}
                    >
                        {isAdded ? (
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Check className="w-5 h-5" /> Added!
                            </motion.div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Plus className="w-5 h-5" /> Add to Cart
                            </div>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
