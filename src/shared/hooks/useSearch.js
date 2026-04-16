import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchProductName } from "@/features/product/api/productApi";

const PAGE_SUGGESTIONS = [
  { title: "Home", path: "/", type: "page" },
  { title: "About Us", path: "/about-us", type: "page" },
  { title: "Shop all", path: "/shop-all", type: "page" },
  { title: "Blogs", path: "/blogs", type: "page" },
  { title: "Contact Us", path: "/contact-us", type: "page" },
  { title: "Payment Options", path: "/payment-options", type: "page" },
  { title: "4C's of Diamond", path: "/diamonds-4cs", type: "page" },
  {
    title: "Lab Grown Diamond Vs Natural Diamond",
    path: "/lab-grown-vs-natural-diamonds",
    type: "page",
  },
  { title: "Ring Size Chart", path: "/rings-size-chart", type: "page" },
  { title: "FAQs", path: "/faqs", type: "page" },
  {
    title: "IGI Lab Grown Diamond Grading Report",
    path: "/lab-grown-diamond-grading-report",
    type: "page",
  },
  {
    title: "Bracelet Size Chart",
    path: "/bracelets-size-chart",
    type: "page",
  },
  {
    title: "Necklace Size Chart",
    path: "/necklaces-size-chart",
    type: "page",
  },
  { title: "Bangles Size Chart", path: "/bangles-size-chart", type: "page" },
  { title: "Diamond Size Guide", path: "/diamond-size-guide", type: "page" },
  { title: "Privacy Policy", path: "/privacy-policy", type: "page" },
  {
    title: "Terms And Conditions",
    path: "/terms-and-conditions",
    type: "page",
  },
  {
    title: "Exchange Return And Refund Policy",
    path: "/exchange-return-and-refund-policy",
    type: "page",
  },
  { title: "Shipping Policy", path: "/shipping-policy", type: "page" },
  {
    title: "Lifetime Returns and Exchange Policy",
    path: "/lifetime-returns-and-exchange-policy",
    type: "page",
  },
  {
    title: "Diamond Color Customization Policy",
    path: "/diamond-color-customization-policy",
    type: "page",
  },
  { title: "Profile", path: "/user/profile", type: "page" },
  { title: "Address Book", path: "/user/address-book", type: "page" },
  { title: "Order History", path: "/user/order-history", type: "page" },
  { title: "My Gifts", path: "/user/my-gifts", type: "page" },
];

const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export default function useSearch() {
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Product data
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Voice search
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const isVoiceSupported = !!SpeechRecognition;

  // Fetch product names on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProductName();
        setProductData(response?.data?.data?.productVariant || []);
      } catch (err) {
        console.error("Failed to fetch product names:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter suggestions when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      return;
    }

    const query = searchQuery.toLowerCase();

    const pageSuggestions = PAGE_SUGGESTIONS.filter((item) =>
      item.title.toLowerCase().includes(query)
    )
      .slice(0, 5)
      .map((item) => ({ ...item, id: item.path }));

    const productSuggestions = productData
      .filter((p) =>
        p.productVariantTitle.toLowerCase().includes(query)
      )
      .slice(0, 8)
      .map((p) => ({
        title: p.productVariantTitle,
        id: p.id,
        slug: p.productVariantSlug,
        type: "product",
      }));

    setSuggestions([...pageSuggestions, ...productSuggestions]);
    setHighlightedIndex(-1);
  }, [searchQuery, productData]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSuggestions([]);
    setHighlightedIndex(-1);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;

      const query = searchQuery.toLowerCase().trim();

      // Check for exact page match
      const exactPageMatch = PAGE_SUGGESTIONS.find(
        (item) => item.title.toLowerCase() === query
      );
      if (exactPageMatch) {
        navigate(exactPageMatch.path);
        clearSearch();
        return;
      }

      // Default: product search
      navigate(
        `/shop-all?search=${encodeURIComponent(searchQuery.trim())}&limit=12&page=1`,
        { replace: true }
      );
      clearSearch();
    },
    [searchQuery, navigate, clearSearch]
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      if (suggestion.type === "page") {
        navigate(suggestion.path);
      } else {
        navigate(
          `/shop-all?search=${encodeURIComponent(suggestion.title)}&limit=12&page=1`,
          { replace: true }
        );
      }
      clearSearch();
    },
    [navigate, clearSearch]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!suggestions.length) {
        if (e.key === "Escape") {
          clearSearch();
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, suggestions.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(suggestions[highlightedIndex]);
      } else if (e.key === "Escape") {
        clearSearch();
      }
    },
    [suggestions, highlightedIndex, handleSuggestionClick, clearSearch]
  );

  // Voice search
  const startListening = useCallback(() => {
    if (!isVoiceSupported || isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setSearchQuery(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        toast.error(
          "Microphone access denied. Please allow microphone permissions."
        );
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isVoiceSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    suggestions,
    highlightedIndex,
    isLoading,
    isListening,
    isVoiceSupported,
    startListening,
    stopListening,
    handleSubmit,
    handleSuggestionClick,
    handleKeyDown,
    clearSearch,
  };
}
