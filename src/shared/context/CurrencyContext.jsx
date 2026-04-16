import React, { createContext, useState, useCallback, useEffect } from "react";

const CURRENCY_LIST = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", exchangeRate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", exchangeRate: 0.012 },
  { code: "EUR", symbol: "€", name: "Euro", exchangeRate: 0.011 },
  { code: "GBP", symbol: "£", name: "British Pound", exchangeRate: 0.0095 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", exchangeRate: 0.044 },
];

const EXCHANGE_RATES = CURRENCY_LIST.reduce((acc, c) => {
  acc[c.code] = c.exchangeRate;
  return acc;
}, {});

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    () => (typeof window !== "undefined" && localStorage.getItem("currency")) || "INR"
  );

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("currency", currency);
  }, [currency]);

  const switchCurrency = useCallback((next) => setCurrency(next), []);

  const convertPrice = useCallback(
    (amountInINR) => Number(amountInINR || 0) * (EXCHANGE_RATES[currency] || 1),
    [currency]
  );

  const convertFromTo = useCallback((amount, from, to) => {
    if (!amount) return 0;
    const inInr = from === "INR" ? Number(amount) : Number(amount) / (EXCHANGE_RATES[from] || 1);
    return to === "INR" ? inInr : inInr * (EXCHANGE_RATES[to] || 1);
  }, []);

  const formatPrice = useCallback(
    (amount, code = currency) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount || 0),
    [currency]
  );

  const getCurrencySymbol = useCallback(
    (code) => CURRENCY_LIST.find((c) => c.code === code)?.symbol || code,
    []
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        switchCurrency,
        convertPrice,
        convertFromTo,
        formatPrice,
        countryCurrencyMap: CURRENCY_LIST,
        fetchExchangeRates: () => {},
        exchangeRates: EXCHANGE_RATES,
        getCurrencySymbol,
        loading: false,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
