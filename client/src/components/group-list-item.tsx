import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { WhatsappGroup } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GroupListItemProps {
  group: WhatsappGroup;
}

const countryFlags: Record<string, string> = {
  US: "🇺🇸",
  IN: "🇮🇳",
  UK: "🇬🇧",
  CA: "🇨🇦",
  AU: "🇦🇺",
  DE: "🇩🇪",
  FR: "🇫🇷",
  BR: "🇧🇷",
  JP: "🇯🇵",
  KR: "🇰🇷",
  MX: "🇲🇽",
  IT: "🇮🇹",
  ES: "🇪🇸",
  NL: "🇳🇱",
  SG: "🇸🇬",
  AE: "🇦🇪"
};

const categoryColors: Record<string, string> = {
  technology: "bg-blue-500",
  business: "bg-purple-500",
  education: "bg-green-500",
  gaming: "bg-red-500",
  entertainment: "bg-pink-500",
  lifestyle: "bg-yellow-500",
  news: "bg-orange-500",
  sports: "bg-teal-500",
  health: "bg-emerald-500",
  travel: "bg-cyan-500",
  food: "bg-amber-500",
  music: "bg-violet-500"
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

function formatViewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export function GroupListItem({ group }: GroupListItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const incrementViewMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/groups/${group.id}/view`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
    }
  });

  const handleJoinGroup = () => {
    if (!group.whatsappLink) {
      toast({
        title: "Error",
        description: "Invalid group link",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    incrementViewMutation.mutate();
    
    // Open WhatsApp link in new tab
    window.open(group.whatsappLink, '_blank');
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-100">
      <div className="flex items-center space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img 
            src={group.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
            alt={group.title} 
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" 
          />
        </div>
        
        {/* Group Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg truncate mb-1">
                {group.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {group.description}
              </p>
              
              {/* Badges and Meta */}
              <div className="flex items-center space-x-3 text-xs">
                <Badge className={`${categoryColors[group.category] || 'bg-gray-500'} text-white px-2 py-1 rounded-full`}>
                  {group.category.charAt(0).toUpperCase() + group.category.slice(1)}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {countryFlags[group.country]} {group.country}
                </Badge>
                <span className="flex items-center text-gray-500">
                  <Eye className="w-3 h-3 mr-1" />
                  {formatViewCount(group.viewCount || 0)}
                </span>
                <span className="text-gray-500">
                  {formatTimeAgo(new Date(group.createdAt || Date.now()))}
                </span>
              </div>
            </div>
            
            {/* Join Button */}
            <div className="flex-shrink-0 ml-4">
              <Button 
                onClick={handleJoinGroup}
                disabled={isLoading}
                className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.786"/>
                </svg>
                <span>{isLoading ? 'Joining...' : 'Join'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}