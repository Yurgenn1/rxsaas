"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/contexts/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function CartBar() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  if (totalItems === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-black/10 to-transparent">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full max-w-3xl mx-auto flex items-center justify-between gap-3 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-xl px-4 py-3 shadow-lg transition"
        >
          <span className="flex items-center gap-2 font-semibold text-sm">
            <ShoppingBag className="size-4" />
            {totalItems} {totalItems === 1 ? "item" : "itens"}
          </span>
          <span className="font-bold">{formatCurrency(totalPrice)}</span>
          <span className="text-sm font-medium underline">Ver carrinho</span>
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Seu carrinho</SheetTitle>
          </SheetHeader>
          <div className="px-4 space-y-3">
            {items.map((item) => (
              <div key={item.cartLineId} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  {item.optionName && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.optionName}</p>
                  )}
                  <p className="text-sm font-bold text-[#E85D5D]">{formatCurrency(item.unitPrice)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => updateQuantity(item.cartLineId, item.quantity - 1)}
                  >
                    <Minus />
                  </Button>
                  <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => updateQuantity(item.cartLineId, item.quantity + 1)}
                  >
                    <Plus />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(item.cartLineId)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <SheetFooter>
            <div className="w-full flex items-center justify-between mb-2 px-1">
              <span className="font-medium text-sm">Total</span>
              <span className="font-bold text-lg text-[#E85D5D]">{formatCurrency(totalPrice)}</span>
            </div>
            <Button render={<Link href="/cardapio/checkout" />} nativeButton={false} className="w-full">
              Finalizar Pedido
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
