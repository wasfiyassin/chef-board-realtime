import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSelector from "@/components/LanguageSelector";
import { ArrowLeft, LogOut } from "lucide-react";

interface Order {
  id: number;
  table_no: string;
  status: string;
  created_at: string;
  notes?: string;
}

export default function History() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const groupByDate = (orders: Order[]) => {
    const grouped: { [key: string]: Order[] } = {};
    
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(order);
    });
    
    return grouped;
  };

  const groupedOrders = groupByDate(orders);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("dashboard")}
            </Button>
            <h1 className="text-3xl font-bold">{t("history")}</h1>
          </div>
          <div className="flex gap-2">
            <LanguageSelector />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedOrders).map(([date, dateOrders]) => (
            <div key={date}>
              <h2 className="text-xl font-semibold mb-3">{date}</h2>
              <div className="space-y-3">
                {dateOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between">
                        <span>{t("table")}: {order.table_no}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {t(order.status)}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                      {order.notes && (
                        <p className="mt-2 text-sm">
                          {t("notes")}: {order.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
