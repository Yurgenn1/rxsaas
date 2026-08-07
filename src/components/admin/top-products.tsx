import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopProductsProps {
  data: { productId: string; name: string; quantity: number }[];
}

export function TopProducts({ data }: TopProductsProps) {
  const max = Math.max(...data.map((d) => d.quantity), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma venda registrada nos últimos 30 dias.
          </p>
        ) : (
          data.map((item) => (
            <div key={item.productId} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate pr-2">{item.name}</span>
                <span className="text-muted-foreground shrink-0">{item.quantity} un.</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(item.quantity / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
