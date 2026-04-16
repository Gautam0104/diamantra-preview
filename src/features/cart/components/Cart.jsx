import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/shared/context/CartContext";
import { Link } from "react-router-dom";
import ProductPriceDisplay from "@/shared/components/ProductPriceDisplay";

export default function Cart({ onClose }) {
  const { guestCart, removeFromCart, updateItemQuantity } = useCart();
  const { items, total, count } = guestCart;

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <header className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="font-heading text-xl">Your Cart ({count})</h2>
        <button onClick={onClose} aria-label="Close cart" className="text-gray-500 hover:text-maroon">
          <X size={22} />
        </button>
      </header>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-6">
          <ShoppingBag size={48} className="text-gray-300" />
          <p className="text-gray-500">Your cart is empty</p>
          <Link
            to="/shop-all"
            onClick={onClose}
            className="mt-2 inline-block px-5 py-2 rounded-full bg-maroon text-white text-sm hover:bg-maroon-hover transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto divide-y">
            {items.map((item) => (
              <li key={item.id} className="p-4 flex gap-3">
                <img
                  src={item.productVariant?.productVariantImage?.[0]?.imageUrl || "/logo.png"}
                  alt={item.productVariant?.productVariantTitle}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-2">
                    {item.productVariant?.productVariantTitle}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</div>
                  <div className="mt-1">
                    <ProductPriceDisplay
                      pricing={item.productVariant?.pricing}
                      priceClassName="text-sm font-semibold"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateItemQuantity(item.id, "decrement")}
                      className="w-7 h-7 border border-gray-300 rounded text-sm hover:border-maroon"
                    >
                      −
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.id, "increment")}
                      className="w-7 h-7 border border-gray-300 rounded text-sm hover:border-maroon"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-gray-400 hover:text-red-500"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <footer className="border-t p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button className="w-full py-3 rounded-full bg-maroon text-white font-medium hover:bg-maroon-hover transition-colors">
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-400 text-center">
              Checkout is disabled in preview mode
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
