/**
 * Marketplace logo SVG components
 * Shopee, Tokopedia, TikTok Shop, Akulaku
 */

export function ShopeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M52.5 12a16 16 0 0 0-14.5 9.3A16 16 0 1 0 52.5 12zm0 26a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" fill="#EE4D2D"/>
      <path d="M44.5 38H60.5V52a2 2 0 0 1-2 2H46.5a2 2 0 0 1-2-2V38z" fill="#EE4D2D"/>
      <text x="70" y="40" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="24" fill="#EE4D2D">shopee</text>
    </svg>
  );
}

export function TokopediaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="30" r="20" fill="#42b549"/>
      <circle cx="28" cy="30" r="13" fill="white"/>
      <circle cx="28" cy="30" r="7" fill="#42b549"/>
      <text x="56" y="40" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="22" fill="#42b549">tokopedia</text>
    </svg>
  );
}

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="8" y="42" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="26" fill="black">TikTok</text>
      <rect x="126" y="6" width="62" height="34" rx="6" fill="#FE2C55"/>
      <text x="131" y="29" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="14" fill="white">Shop</text>
    </svg>
  );
}

export function AkulakuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 190 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="50" x="5" y="5" rx="10" fill="#1677FF"/>
      <text x="9" y="38" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="28" fill="white">A</text>
      <text x="62" y="40" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="22" fill="#1677FF">Akulaku</text>
    </svg>
  );
}

export function getMarketplaceIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "shopee":
      return ShopeeIcon;
    case "tokopedia":
      return TokopediaIcon;
    case "tiktok":
    case "tiktokshop":
      return TikTokIcon;
    case "akulaku":
      return AkulakuIcon;
    default:
      return null;
  }
}
