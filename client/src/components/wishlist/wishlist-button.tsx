import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WishlistButtonProps {
  listingId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function WishlistButton({ 
  listingId, 
  className = "", 
  size = "md",
  showText = false 
}: WishlistButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if listing is in wishlist
  const { data: wishlistIds = [] } = useQuery<string[]>({
    queryKey: ["/api/wishlist/ids"],
    retry: false,
  });

  const isInWishlist = wishlistIds.includes(listingId);

  // Add to wishlist mutation
  const addToWishlist = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/wishlist/${listingId}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist/ids"] });
      
      toast({
        title: "Added to wishlist",
        description: "Property saved to your wishlist successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: error?.message || "Could not add to wishlist. Please try again.",
      });
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/wishlist/${listingId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist/ids"] });
      
      toast({
        title: "Removed from wishlist",
        description: "Property removed from your wishlist.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to remove",
        description: error?.message || "Could not remove from wishlist. Please try again.",
      });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      removeFromWishlist.mutate();
    } else {
      addToWishlist.mutate();
    }
  };

  const isPending = addToWishlist.isPending || removeFromWishlist.isPending;

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg"
  };

  const heartSize = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`
        ${sizeClasses[size]} 
        ${className}
        relative group rounded-full 
        bg-white/90 hover:bg-white/95 
        shadow-md hover:shadow-lg
        border border-gray-200/50
        transition-all duration-200
        ${isPending ? "animate-pulse" : ""}
        ${isInWishlist 
          ? "text-red-500 hover:text-red-600" 
          : "text-gray-600 hover:text-red-500"
        }
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isPending}
      data-testid={`wishlist-button-${listingId}`}
    >
      <Heart 
        size={heartSize[size]} 
        className={`
          transition-all duration-200
          ${isInWishlist || (isHovered && !isPending)
            ? "fill-current scale-110" 
            : "fill-none scale-100"
          }
        `}
      />
      
      {/* Ripple effect on click */}
      {isPending && (
        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
      )}
      
      {/* Tooltip text */}
      {showText && (
        <span className="sr-only">
          {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        </span>
      )}
    </Button>
  );
}