import { useState } from 'react';
import { Plus, Search, Tag, Gift, Briefcase, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CreateListingModal } from '@/components/marketplace/CreateListingModal';
import { ListingDetailModal } from '@/components/marketplace/ListingDetailModal';
import { mockMarketplaceListings } from '@/data/mockData';
import type { MarketplaceListing } from '@/data/mockData';

const categories = [
  { id: 'all', label: 'همه', icon: Tag },
  { id: 'sale', label: 'فروشی', icon: Tag },
  { id: 'free', label: 'رایگان', icon: Gift },
  { id: 'services', label: 'خدمات', icon: Briefcase },
  { id: 'lending', label: 'امانت', icon: HandHeart },
];

export function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Filter listings
  const filteredListings = mockMarketplaceListings.filter(listing => {
    const matchesCategory = activeCategory === 'all' || listing.category === activeCategory;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && listing.status === 'active';
  });

  const handleListingClick = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">بازارچه همسایگی</h1>
          <p className="text-muted-foreground mt-1">
            خرید، فروش و به اشتراک‌گذاری اقلام با همسایگان
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          ثبت آگهی جدید
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="جستجو در آگهی‌ها..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-5" dir="rtl">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id}>
                <Icon className="ml-2 h-4 w-4" />
                {category.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6" dir="rtl">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onClick={() => handleListingClick(listing)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery ? 'آگهی‌ای یافت نشد' : 'هنوز آگهی‌ای ثبت نشده است'}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <Plus className="ml-2 h-4 w-4" />
                  اولین آگهی را ثبت کنید
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateListingModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />
      )}
    </div>
  );
}
