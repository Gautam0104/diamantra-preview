import {
  indexPageData,
  banners,
  announcementBanners,
  headerImage,
} from "@/mock/homeData";

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const ok = (data) => ({ data: { data, success: true } });

export const fetchIndexPageData = async () => {
  await delay();
  return ok(indexPageData);
};

export const getPublicBanners = async () => {
  await delay();
  return ok(banners);
};

export const getAnnouncementPublicBanners = async () => {
  await delay();
  return ok(announcementBanners);
};

export const getPublicHeaderImage = async () => {
  await delay();
  return ok(headerImage);
};

export const getAllPublicCurrencies = async () => {
  await delay();
  return ok([
    { code: "INR", symbol: "₹", exchangeRate: 1 },
    { code: "USD", symbol: "$", exchangeRate: 0.012 },
    { code: "EUR", symbol: "€", exchangeRate: 0.011 },
    { code: "GBP", symbol: "£", exchangeRate: 0.0095 },
    { code: "AED", symbol: "د.إ", exchangeRate: 0.044 },
  ]);
};

export const fetchFooterCmsPage = async () => ok({ title: "", content: "Static preview." });
export const submitContactForm = async () => ok({ success: true });
export const checkServiceAvailability = async (pincode) => {
  await delay(250);
  const ok_pins = ["400001", "110001", "560001", "600001", "700001", "500001"];
  return ok({ serviceable: ok_pins.includes(String(pincode)), pincode });
};
