import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { format } from "date-fns";
import { BsTruck, BsCreditCard2Front } from "react-icons/bs";
import { FaBoxOpen, FaMapMarkerAlt } from "react-icons/fa";
import { fetchOrderById } from "@/features/checkout/api/checkoutApi";
import { useCart } from "@/shared/context/CartContext";
import { Skeleton } from "@/shared/components/ui/skeleton";

const AUTO_REDIRECT_MS = 6000;

const formatINR = (value) =>
  Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const safeFormat = (date, pattern) => {
  if (!date) return "—";
  try {
    return format(new Date(date), pattern);
  } catch {
    return "—";
  }
};

const Success = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState(null);

  const checkmarkRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCart?.();

    if (!orderId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetchOrderById(orderId);
        if (cancelled) return;
        setOrder(res?.data?.data ?? null);
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ||
            "We couldn't load your order details right now."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  useEffect(() => {
    gsap.fromTo(
      ".success-hero",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );

    gsap.fromTo(
      ".success-icon",
      { scale: 0, rotationX: 180 },
      {
        scale: 1,
        rotationX: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.55)",
        delay: 0.15,
        onComplete: () => {
          const path = checkmarkRef.current;
          if (!path) return;
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.inOut",
          });
        },
      }
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/user/order-history");
    }, AUTO_REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  const address = order?.address;
  const customerName = order?.customer
    ? `${order.customer.firstName ?? ""} ${order.customer.lastName ?? ""}`.trim()
    : "";
  const placedOnLabel = safeFormat(
    order?.paidAt || order?.createdAt,
    "dd MMM yyyy, hh:mm a"
  );
  const expectedLabel = safeFormat(
    order?.expectedDeliveryDate,
    "dd MMM yyyy"
  );
  const itemCount =
    order?.orderItems?.reduce((n, i) => n + (i.quantity ?? 1), 0) ?? 0;

  return (
    <section className="w-full bg-white">
      <div className="success-hero bg-gradient-to-br from-green-50 via-white to-[#fff5f5] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <div className="success-icon w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-[inset_0_-3px_6px_rgba(0,0,0,0.08)]">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                ref={checkmarkRef}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">
            Payment Successful
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-1">
            Thank you{customerName ? `, ${customerName}` : ""}! Your order has
            been confirmed.
          </p>
          {order?.orderNumber && (
            <p className="text-sm text-gray-700">
              Order ID{" "}
              <span className="font-semibold text-[#8B0000]">
                #{order.orderNumber}
              </span>{" "}
              • Placed on {placedOnLabel}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-3">
            Redirecting to your order history in a few seconds…
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-[380px] space-y-3">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>
            <Skeleton className="flex-1 h-72 rounded-md" />
          </div>
        ) : error ? (
          <div className="border border-gray-200 rounded-md p-6 text-center text-sm text-gray-600">
            Your payment was successful. We're still fetching your order
            details — you'll be redirected to your order history shortly.
          </div>
        ) : order ? (
          <div className="flex flex-col lg:flex-row gap-5">
            <aside className="w-full lg:w-[380px] flex flex-col gap-4">
              <div className="border border-gray-200 rounded-md bg-white overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#8B0000] text-white flex items-center justify-center border-2 border-[#F0DFD8] shadow-sm">
                    <BsTruck />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wide">
                      Order ID
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {order.orderNumber}
                    </div>
                  </div>
                </div>

                <dl className="p-4 text-xs space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Placed on</dt>
                    <dd className="text-gray-800 font-medium">
                      {placedOnLabel}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Expected delivery</dt>
                    <dd className="text-gray-800 font-medium">
                      {expectedLabel}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Items</dt>
                    <dd className="text-gray-800 font-medium">
                      {itemCount} item{itemCount === 1 ? "" : "s"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 flex items-center gap-1">
                      <BsCreditCard2Front /> Payment
                    </dt>
                    <dd className="text-gray-800 font-medium">
                      {order.paymentMethod || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Status</dt>
                    <dd>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold uppercase tracking-wide">
                        {order.paymentStatus || "SUCCESS"}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-gray-100 p-4 text-xs space-y-2 bg-gray-50">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Subtotal</dt>
                    <dd className="text-gray-800 font-medium">
                      ₹{formatINR(order.totalAmount)}
                    </dd>
                  </div>
                  {order.gstAmount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">GST</dt>
                      <dd className="text-gray-800 font-medium">
                        ₹{formatINR(order.gstAmount)}
                      </dd>
                    </div>
                  )}
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Discount</dt>
                      <dd className="text-green-700 font-medium">
                        − ₹{formatINR(order.discountAmount)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <dt className="text-gray-800 font-semibold">Total paid</dt>
                    <dd className="text-[#8B0000] font-bold text-sm">
                      ₹{formatINR(order.finalAmount)}
                    </dd>
                  </div>
                </div>
              </div>

              {address && (
                <div className="border border-gray-200 rounded-md bg-white p-4">
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 uppercase tracking-wide">
                    <FaMapMarkerAlt className="text-[#8B0000]" />
                    Shipping to
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {customerName || "—"}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {[address.houseNo, address.landMark, address.street]
                      .filter(Boolean)
                      .join(", ")}
                    <br />
                    {[address.city, address.state, address.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                    <br />
                    {address.country}
                  </div>
                  {address.phone && (
                    <div className="text-xs text-gray-600 mt-2">
                      Phone: <span className="text-gray-800">{address.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </aside>

            <div className="flex-1 flex flex-col gap-4">
              <div className="border border-gray-200 rounded-md bg-white">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 text-sm font-semibold text-gray-800">
                  <FaBoxOpen className="text-[#8B0000]" />
                  Items in this order
                </div>

                <ul className="divide-y divide-gray-100">
                  {order.orderItems?.map((item) => {
                    const lineTotal =
                      item.total ??
                      (item.priceAtPurchase ?? 0) * (item.quantity ?? 1);
                    const subtitleParts = [
                      item.metalType,
                      item.purityLabel,
                      item.size && `Size ${item.size}`,
                      item.styleName,
                    ].filter(Boolean);

                    return (
                      <li
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-4 p-4"
                      >
                        <img
                          src={item.imageUrl || "/tracking.png"}
                          alt={item.productName || "Product"}
                          loading="lazy"
                          className="w-20 h-20 rounded-md object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {item.productName || "Product"}
                          </h3>
                          {subtitleParts.length > 0 && (
                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                              {subtitleParts.join(" • ")}
                            </p>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity ?? 1} × ₹
                            {formatINR(item.priceAtPurchase)}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-[#8B0000] sm:text-right">
                          ₹{formatINR(lineTotal)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/user/order-history/${order.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#8B0000] hover:bg-[#6e0000] text-white text-sm font-semibold py-3 px-5 rounded-md transition-colors"
                >
                  <BsTruck /> Track Order
                </Link>
                <Link
                  to="/user/order-history"
                  className="flex-1 inline-flex items-center justify-center bg-white border border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000]/5 text-sm font-semibold py-3 px-5 rounded-md transition-colors"
                >
                  View Order History
                </Link>
                <Link
                  to="/shop-all"
                  className="flex-1 inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-3 px-5 rounded-md transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-md p-6 text-center text-sm text-gray-600">
            Your payment was successful. Redirecting you to your order
            history…
          </div>
        )}
      </div>
    </section>
  );
};

export default Success;
