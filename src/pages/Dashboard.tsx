import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSelector from "@/components/LanguageSelector";
import { LogOut, History } from "lucide-react";

interface Order {
  id: number;
  table_no: string;
  status: string;
  created_at: string;
  notes?: string;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
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

  const filterByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/history")}>
              <History className="h-4 w-4 mr-2" />
              {t("history")}
            </Button>
            <LanguageSelector />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="placed" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="placed">
              {t("placed")} <span dir="ltr">({filterByStatus("placed").length})</span>
            </TabsTrigger>
            <TabsTrigger value="ack">
              {t("ack")} <span dir="ltr">({filterByStatus("ack").length})</span>
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              {t("in_progress")} <span dir="ltr">({filterByStatus("in_progress").length})</span>
            </TabsTrigger>
            <TabsTrigger value="ready">
              {t("ready")} <span dir="ltr">({filterByStatus("ready").length})</span>
            </TabsTrigger>
            <TabsTrigger value="delivered">
              {t("delivered")} <span dir="ltr">({filterByStatus("delivered").length})</span>
            </TabsTrigger>
          </TabsList>

          {["placed", "ack", "in_progress", "ready", "delivered"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filterByStatus(status).map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle>
                      {t("table")}: {order.table_no}
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
