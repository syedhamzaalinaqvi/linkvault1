import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GroupCard } from "@/components/group-card";
import { GroupListItem } from "@/components/group-list-item";
import { GroupSubmissionModal } from "@/components/group-submission-modal";
import { Search, ArrowRight, Plus, Grid3X3, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch groups with filters
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['/api/groups', { search: searchQuery, category: selectedCategory, country: selectedCountry, sort: sortBy }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedCountry && selectedCountry !== 'all') params.append('country', selectedCountry);
      if (sortBy) params.append('sort', sortBy);
      
      const response = await fetch(`/api/groups?${params}`);
      if (!response.ok) throw new Error('Failed to fetch groups');
      return response.json();
    }
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSubmitClick={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-whatsapp-50 to-green-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Discover Amazing{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-whatsapp-500 to-whatsapp-600">
                WhatsApp Groups
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in">
              Join thousands of communities worldwide. Share your groups and discover new ones across different categories and countries.
            </p>
            
            {/* Quick Stats */}
            {stats && (
              <div className="flex justify-center items-center space-x-8 mb-12 animate-slide-up">
                <div className="text-center">
                  <div className="text-2xl font-bold text-whatsapp-600">{stats.totalGroups.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Active Groups</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-whatsapp-600">{stats.totalCountries}</div>
                  <div className="text-sm text-gray-500">Countries</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-whatsapp-600">{stats.totalCategories}</div>
                  <div className="text-sm text-gray-500">Categories</div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Button 
                size="lg"
                className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center space-x-2"
                onClick={() => document.getElementById('groups-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span>Browse Groups</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-whatsapp-500 text-whatsapp-600 hover:bg-whatsapp-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg"
                onClick={() => setIsModalOpen(true)}
              >
                Submit Your Group
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white py-8 border-b border-gray-100" id="groups-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* View Toggle & Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* View Toggle */}
              <div className="flex rounded-lg border border-gray-200 p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-whatsapp-500 hover:bg-whatsapp-600" : ""}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-whatsapp-500 hover:bg-whatsapp-600" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="min-w-[140px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="news">News & Politics</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                </SelectContent>
              </Select>

              {/* Country Filter */}
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="min-w-[120px]">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="BR">Brazil</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="min-w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Groups Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Groups</h2>
            <p className="text-gray-600">Discover trending WhatsApp groups from around the world</p>
          </div>

          {isLoading ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 space-y-4">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-20" />
                  </div>
                ))}
              </div>
            )
          ) : groups.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groups.map((group: any) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map((group: any) => (
                  <GroupListItem key={group.id} group={group} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No groups found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedCountry("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Floating Action Button */}
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-whatsapp-500 hover:bg-whatsapp-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-40"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Submission Modal */}
      <GroupSubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
