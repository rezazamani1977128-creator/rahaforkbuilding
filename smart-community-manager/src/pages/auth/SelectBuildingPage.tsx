import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, ChevronLeft, Plus, LogOut } from 'lucide-react';
import { toPersianNumber } from '@/lib/persian';

const roleLabels: Record<string, string> = {
  manager: 'مدیر',
  board_member: 'عضو هیئت مدیره',
  owner: 'مالک',
  tenant: 'مستاجر',
};

const roleColors: Record<string, string> = {
  manager: 'bg-primary',
  board_member: 'bg-blue-500',
  owner: 'bg-green-500',
  tenant: 'bg-gray-500',
};

export default function SelectBuildingPage() {
  const navigate = useNavigate();
  const { buildings, selectBuilding, user, logout } = useAuth();

  const handleSelectBuilding = (buildingId: string) => {
    selectBuilding(buildingId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">سلام {user?.firstName}!</h1>
            <p className="text-muted-foreground">ساختمان مورد نظر را انتخاب کنید</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Buildings List */}
        <div className="space-y-4">
          {buildings.map((building) => (
            <Card 
              key={building.id}
              className="cursor-pointer hover:border-primary transition-colors group"
              onClick={() => handleSelectBuilding(building.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{building.name}</h3>
                        <Badge className={`${roleColors[building.role]} text-white`}>
                          {roleLabels[building.role]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4" />
                        {building.address}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Users className="h-4 w-4" />
                        {toPersianNumber(building.unitsCount)} واحد
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Building */}
          <Card 
            className="cursor-pointer border-dashed hover:border-primary transition-colors group"
            onClick={() => navigate('/register')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Plus className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold">افزودن ساختمان جدید</h3>
                  <p className="text-sm text-muted-foreground">
                    ساختمان جدید ثبت کنید یا به ساختمان دیگری بپیوندید
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
