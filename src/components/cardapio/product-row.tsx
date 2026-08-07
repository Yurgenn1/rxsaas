"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

import { useCart } from "@/contexts/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

interface ProductOption {
  id: string;
  name: string;
  price: number;
}

interface ProductRowProps {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  basePrice: number;
  sizeOptions: ProductOption[];
}

export function ProductRow({ id, name, description, image, basePrice, sizeOptions }: ProductRowProps) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(sizeOptions[0]?.id);
  const [quantity, setQuantity] = useState(1);

  const selectedOption = sizeOptions.find((o) => o.id === selectedOptionId);
  const unitPrice = basePrice + (selectedOption?.price ?? 0);
  const minAdjustment = Math.min(0, ...sizeOptions.map((o) => o.price), 0);
  const displayPrice = basePrice + minAdjustment;

  function handleAdd() {
    addItem({
      productId: id,
      name,
      image,
      unitPrice,
      quantity,
      optionId: selectedOption?.id,
      optionName: selectedOption?.name,
    });
    setOpen(false);
    setQuantity(1);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col text-left w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition"
      >
        <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 shrink-0">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 text-xs">
              Sem foto
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-50 line-clamp-1">{name}</h3>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 flex-1">
              {description}
            </p>
          )}
          <p className="text-sm font-bold text-[#E85D5D] mt-1.5">
            {sizeOptions.length > 0 ? "a partir de " : ""}
            {formatCurrency(displayPrice)}
          </p>
        </div>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{name}</SheetTitle>
          </SheetHeader>
          <div className="px-4 space-y-4">
            {image && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden">
                <Image src={image} alt={name} fill className="object-cover" sizes="400px" />
              </div>
            )}
            {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}

            {sizeOptions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Tamanho</p>
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition ${
                      selectedOptionId === opt.id
                        ? "border-[#E85D5D] bg-[#E85D5D]/5 text-slate-900 dark:text-slate-50"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span>{opt.name}</span>
                    <span className="font-semibold">{formatCurrency(basePrice + opt.price)}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantidade</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus />
                </Button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <Button variant="outline" size="icon-sm" onClick={() => setQuantity((q) => q + 1)}>
                  <Plus />
                </Button>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleAdd} className="w-full">
              Adicionar · {formatCurrency(unitPrice * quantity)}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
