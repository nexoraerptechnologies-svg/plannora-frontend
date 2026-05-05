import venue1 from "@/assets/vendor/venue-1.jpg";
import venue2 from "@/assets/vendor/venue-2.jpg";
import venue3 from "@/assets/vendor/venue-3.jpg";
import venue4 from "@/assets/vendor/venue-4.jpg";
import catering1 from "@/assets/vendor/catering-1.jpg";
import decor1 from "@/assets/vendor/decor-1.jpg";

export interface MediaItem {
  id: string;
  url: string;
  thumbnail: string;
  tags: string[];
  isCover: boolean;
  views: number;
  engagement: number;
  type: "image" | "video";
  name: string;
}

// Pre-built media items for mock vendor services
export const MOCK_SERVICE_MEDIA: Record<string, MediaItem[]> = {
  "s-001": [
    { id: "img-001", url: venue1, thumbnail: venue1, tags: ["outdoor", "garden", "sunset"], isCover: true, views: 342, engagement: 89, type: "image", name: "Hacienda Gardens" },
    { id: "img-002", url: venue2, thumbnail: venue2, tags: ["indoor", "ballroom", "night"], isCover: false, views: 287, engagement: 72, type: "image", name: "Ballroom Reception" },
    { id: "img-003", url: venue3, thumbnail: venue3, tags: ["outdoor", "ceremony", "garden"], isCover: false, views: 256, engagement: 65, type: "image", name: "Garden Ceremony" },
    { id: "img-004", url: venue4, thumbnail: venue4, tags: ["outdoor", "night", "terrace"], isCover: false, views: 198, engagement: 54, type: "image", name: "Terrace Evening" },
  ],
  "s-002": [
    { id: "img-005", url: venue3, thumbnail: venue3, tags: ["outdoor", "ceremony"], isCover: true, views: 189, engagement: 45, type: "image", name: "Ceremony Setup" },
    { id: "img-006", url: venue1, thumbnail: venue1, tags: ["outdoor", "garden"], isCover: false, views: 134, engagement: 32, type: "image", name: "Garden View" },
  ],
  "s-003": [
    { id: "img-007", url: catering1, thumbnail: catering1, tags: ["plated", "gourmet", "luxury"], isCover: true, views: 412, engagement: 98, type: "image", name: "Premium Plating" },
  ],
  "s-007": [
    { id: "img-008", url: decor1, thumbnail: decor1, tags: ["centerpiece", "roses", "luxury"], isCover: true, views: 523, engagement: 134, type: "image", name: "Floral Centerpiece" },
  ],
};

// Vendor gallery images (aggregate)
export const VENDOR_GALLERY: Record<string, string[]> = {
  "v-001": [venue1, venue2, venue3, venue4],
  "v-002": [catering1],
  "v-004": [decor1],
};

export const IMAGE_TAGS = [
  "outdoor", "indoor", "ceremony", "reception", "night", "sunset",
  "garden", "ballroom", "terrace", "luxury", "detail", "plated",
  "gourmet", "centerpiece", "roses", "bridal",
];
