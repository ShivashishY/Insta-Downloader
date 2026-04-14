import { FaqItem, HowStep } from "@/lib/types";

export type ContentKey = "video" | "photo" | "reels" | "story" | "igtv" | "carousel";

export interface ContentPageData {
  key: ContentKey;
  path: string;
  navLabel: string;
  h1: string;
  subtitle: string;
  inputPlaceholder: string;
  howTo: HowStep[];
  faqs: FaqItem[];
  guideTitle: string;
  guideParagraphs: string[];
}

const baseFaqs: FaqItem[] = [
  {
    question: "Is this downloader free?",
    answer: "Yes. The tool is free to use and works without account registration."
  },
  {
    question: "Can I download private posts?",
    answer: "No. Only publicly accessible media can be downloaded."
  },
  {
    question: "Do you add watermarks?",
    answer: "No. Downloaded files keep original source quality and do not add watermarks."
  },
  {
    question: "Do I need to install an app?",
    answer: "No app is required. The downloader works in a regular browser."
  },
  {
    question: "Is there a download limit?",
    answer: "Requests are rate-limited per IP to prevent abuse, but normal users can download comfortably."
  }
];

export const CONTENT_PAGES: Record<ContentKey, ContentPageData> = {
  video: {
    key: "video",
    path: "/video",
    navLabel: "Video",
    h1: "Instagram Video Downloader",
    subtitle: "Download Instagram videos in HD quality online. No login. No watermark. Works on all devices.",
    inputPlaceholder: "Paste Instagram video link here...",
    howTo: [
      { name: "Copy video link", text: "Open Instagram and copy the public video URL." },
      { name: "Paste and process", text: "Paste the URL and click Download to fetch quality options." },
      { name: "Save file", text: "Select HD 1080p, 720p, or SD and save instantly." }
    ],
    faqs: baseFaqs,
    guideTitle: "Complete Guide: Download Instagram Videos Safely and Clearly",
    guideParagraphs: [
      "Instagram video posts are often shared for education, entertainment, product demos, and announcements. A downloader page should do more than provide a simple input box; it should help users understand what to expect before they click download. On this page, video links are processed from public Instagram posts only. If a video is private, account restricted, or removed by the creator, extraction will fail by design. This protects creator settings and keeps usage aligned with platform boundaries. The main goal is convenience for legitimate personal use, such as saving tutorials for offline viewing during travel, keeping references for study, or archiving a link that may be updated later.",
      "Quality and compatibility are also important. Different Instagram videos may expose multiple format streams, and each stream can differ in resolution, file size, and bitrate. When several options are available, users can choose a smaller file for mobile storage or a higher quality version for larger screens. In practical use, faster downloads are often achieved with moderate quality, while higher quality can take longer and consume more bandwidth. Understanding this tradeoff helps users avoid failed transfers on unstable networks. If one option stalls, choosing another quality usually solves the problem. The downloader interface is designed to keep this choice simple while still exposing enough detail for informed decisions.",
      "Copyright and permission should always guide downloading behavior. This tool is intended for personal use, not unauthorized redistribution, resale, or reposting without attribution and consent. If you did not create the media, confirm you have permission before using the file elsewhere. Respect creator rights, local laws, and fair-use limits in your country. We do not host a copy of the downloaded media permanently, and we do not store user media libraries on our server. Each request is processed directly from the source URL and returned for immediate save. This approach reduces privacy risk while keeping the workflow efficient for users who need a quick, compliant way to download public Instagram videos."
    ]
  },
  photo: {
    key: "photo",
    path: "/photo",
    navLabel: "Photo",
    h1: "Instagram Photo Downloader",
    subtitle: "Save Instagram photos in original quality with one click.",
    inputPlaceholder: "Paste Instagram photo link here...",
    howTo: [
      { name: "Copy photo link", text: "Copy the URL of any public Instagram photo post." },
      { name: "Paste the URL", text: "Paste link into the input field and press Download." },
      { name: "Download photo", text: "Choose and save the full-resolution image." }
    ],
    faqs: baseFaqs,
    guideTitle: "How Photo Downloading Works for Public Instagram Posts",
    guideParagraphs: [
      "Instagram photo posts can include one image or multiple slides, and each slide may have different sizes depending on source upload and Instagram processing. A reliable photo downloader should explain this clearly so users understand why output can vary. On this page, the tool attempts to recover the best publicly available image candidate from a shared post URL. If a post is private, age-gated, region-limited, or removed, extraction may return an error. That behavior is expected and ensures account privacy settings are respected. For standard public posts, the process is fast and usually returns high-quality files that are suitable for offline reference.",
      "Many users save images for mood boards, academic notes, visual inspiration, or personal archives. In each case, clarity and file naming matter. Downloading with stable file names helps users organize content by project or source. If a post has multiple image resources, the downloader prioritizes stronger candidates rather than tiny preview thumbnails. This is helpful when you plan to zoom in later or reuse the image privately on another device. Keep in mind that Instagram may compress uploads; therefore, the best downloadable version is the highest quality publicly exposed by the source, not necessarily the original camera file. Even with that limitation, results are typically strong enough for everyday personal use.",
      "Responsible use remains the most important rule. Downloaded images should not be reposted, sold, or edited for publication without permission from the original creator. Personal backup, learning, and private reference are generally the intended scenarios for this tool. The service does not maintain a long-term media vault, and it does not store downloaded files on behalf of users. Requests are processed transiently from public links, then streamed back for immediate save. This reduces storage risk and helps maintain a simple, transparent workflow. If a creator deletes a post, changes visibility, or updates access controls, future downloads may stop. That is normal and aligns the tool with creator-controlled distribution."
    ]
  },
  reels: {
    key: "reels",
    path: "/reels",
    navLabel: "Reels",
    h1: "Instagram Reels Downloader",
    subtitle: "Download Instagram Reels videos fast in HD quality.",
    inputPlaceholder: "Paste Instagram reel link here...",
    howTo: [
      { name: "Copy reel URL", text: "Open Reels and copy the link from share options." },
      { name: "Paste and download", text: "Paste the URL and click Download." },
      { name: "Save reel", text: "Pick your quality and save reel without watermark." }
    ],
    faqs: baseFaqs,
    guideTitle: "Instagram Reels Downloader Guide for Fast, Stable Results",
    guideParagraphs: [
      "Reels are short-form videos that often move quickly across trends, which makes reliable downloading especially useful for personal offline viewing. This page is optimized for reel links and aims to return playable MP4 output whenever the source is publicly accessible. Reels can change availability over time because creators may delete, archive, or limit visibility after posting. If that happens, a previously valid link can fail later. The downloader reflects current source access at the moment of request rather than storing a permanent mirror. This behavior keeps extraction aligned with real-time source permissions and helps avoid stale or misleading results.",
      "For best performance, copy the exact reel URL from Instagram share options and paste it directly without extra text. Some devices append tracking parameters automatically; those are usually safe, but a clean URL can reduce edge-case parsing errors. If multiple stream variants are available, choose the format that balances quality and speed for your connection. On slower networks, a medium-quality stream may complete faster and reduce interruption risk. If you experience temporary failures, retrying after a short delay often works because social platforms can rate-limit burst requests. The interface is designed to remain straightforward while still exposing enough information for users who care about output quality.",
      "Usage policy matters just as much as technical success. Reels should be downloaded only when you have a lawful basis, especially if you plan to share or republish content outside private viewing. Personal study, offline access, and temporary reference are the intended uses here. Avoid removing attribution, reuploading without consent, or using downloaded clips in commercial projects unless rights are clearly granted. We do not keep a permanent hosted copy of reel files on our servers, and we do not provide a user media locker. Media is fetched from source and streamed for immediate save. This model supports privacy-aware operation while encouraging responsible handling of creator content."
    ]
  },
  story: {
    key: "story",
    path: "/story",
    navLabel: "Story",
    h1: "Instagram Story Saver",
    subtitle: "Save public Instagram stories in seconds, directly from your browser.",
    inputPlaceholder: "Paste Instagram story link here...",
    howTo: [
      { name: "Copy story link", text: "Find a public story and copy its URL." },
      { name: "Paste in tool", text: "Paste the story URL and hit Download." },
      { name: "Store to device", text: "Select file and save story to phone or desktop." }
    ],
    faqs: baseFaqs,
    guideTitle: "Story Saver Notes: Public Access, Expiry, and Download Expectations",
    guideParagraphs: [
      "Instagram stories are temporary by nature, so timing affects download success more than most other content types. A story can expire, be deleted, or become inaccessible quickly, and that can happen between two attempts only minutes apart. This page is designed to process story URLs when they are still publicly reachable or otherwise available through the extraction backend. If a story is no longer accessible at source, the downloader cannot recreate it. That is expected behavior and should be treated as a source-availability issue, not a local browser issue. For best results, use the exact story URL as soon as possible after publication.",
      "Some story links may require authenticated access depending on account settings, regional checks, or platform-side controls. In those cases, extraction may rely on configured backend authentication methods and may still fail if the source session lacks permission. This page presents those failures transparently so users understand why a specific story cannot be downloaded. Clear errors are better than silent failure because they let users distinguish between invalid links, expired stories, and authorization restrictions. If a story is accessible, output can be image or video depending on the original upload format. Download speed will vary by file size and network quality.",
      "Personal-use limitations are particularly important with stories because they often include casual or sensitive content intended for a limited audience window. Download only what you are allowed to save, and do not republish someone else’s story without permission. Respect creator intent, platform rules, and local copyright laws. Our system does not maintain a long-term archive of downloaded stories and does not store a private media history for users. Requests are processed from source links and streamed back directly for immediate saving. This keeps storage exposure low while preserving a practical workflow for legitimate personal backup use where access is lawful and technically available."
    ]
  },
  igtv: {
    key: "igtv",
    path: "/igtv",
    navLabel: "IGTV",
    h1: "IGTV Downloader",
    subtitle: "Download IGTV videos online in high quality.",
    inputPlaceholder: "Paste IGTV link here...",
    howTo: [
      { name: "Copy IGTV link", text: "Open IGTV content and copy URL." },
      { name: "Paste link", text: "Use the input field to submit URL." },
      { name: "Download IGTV", text: "Choose desired format and save instantly." }
    ],
    faqs: baseFaqs,
    guideTitle: "IGTV Downloading Guide for Long-Form Instagram Video",
    guideParagraphs: [
      "IGTV and other long-form Instagram video formats can be valuable for lectures, interviews, tutorials, and detailed walkthroughs. Because these files are often larger than reels or short clips, users benefit from knowing how quality, size, and connection stability interact. This page focuses on taking a public IGTV-style URL and returning downloadable streams without unnecessary steps. If the source content has been removed, made private, or geo-restricted, extraction will fail. That outcome reflects source rules rather than a local download bug. For available posts, choosing a reasonable quality can reduce download interruptions on unstable mobile networks.",
      "Longer videos can include multiple format variants generated during platform encoding. Some variants may be easier to download but lower in detail, while higher variants can look better on large displays but require more storage and bandwidth. If your goal is offline learning on a phone, a medium stream is often enough. If your goal is archival reference on desktop, a higher stream can be preferable. This page keeps option selection simple while still letting users choose what fits their device. If one option fails due to temporary network issues, retrying a different quality is a practical fallback that works in many cases.",
      "As with every downloader flow, legal and ethical use should come first. Downloading does not transfer ownership rights, and it does not grant permission to repost or monetize another person’s video. Keep usage personal unless explicit rights are provided by the creator or rights holder. The service does not create a permanent hosted library of IGTV files and does not store user media collections. Each request is processed from the supplied link and streamed back directly. This design reduces server-side retention risk and supports transparent operation while giving users a practical way to keep temporary offline copies of publicly available long-form Instagram content."
    ]
  },
  carousel: {
    key: "carousel",
    path: "/carousel",
    navLabel: "Carousel",
    h1: "Instagram Carousel / Album Downloader",
    subtitle: "Download all photos and videos from Instagram carousel posts.",
    inputPlaceholder: "Paste Instagram carousel link here...",
    howTo: [
      { name: "Copy album URL", text: "Copy the URL of a public carousel post." },
      { name: "Paste and fetch", text: "Paste in downloader and click Download." },
      { name: "Download all", text: "Save items individually or use Download All ZIP." }
    ],
    faqs: baseFaqs,
    guideTitle: "Carousel and Album Downloader: Save Multi-Slide Posts Clearly",
    guideParagraphs: [
      "Carousel posts can contain mixed media, including photos and videos across multiple slides, so the downloader experience should explain how multi-item extraction works. This page is built for that use case and aims to return each available slide as a separate downloadable item. Public accessibility remains a strict requirement; private or restricted posts cannot be extracted through normal public flows. When a carousel is accessible, users can save individual slides or take all items in sequence, depending on how the result card is presented. This is useful for study material, design references, and private project organization where one post contains several related assets.",
      "Because carousels are multi-item, consistency matters. Clear file names and stable ordering make downloads easier to manage, especially when users want to keep context between slides. In many workflows, users later combine images into notes, mood boards, or comparison documents. Reliable ordering prevents confusion and reduces manual renaming effort. Depending on source structure, some slides may expose different qualities than others, and mixed content types may require separate handling. If a specific slide fails, it does not always mean the entire post is inaccessible. Retrying or downloading remaining items can still produce useful results for the majority of the carousel.",
      "Rights and permissions still apply per slide, not just per post. Downloading a public carousel does not grant permission to republish its images or clips in other channels. Use downloads for personal reference unless explicit permission is provided. Our service does not maintain a permanent server-side mirror of carousel media and does not store long-term user download history. Media is requested from source and streamed for immediate save on your device. This keeps retention limited and workflow simple while supporting legitimate personal use. If a creator edits or removes a carousel later, future extraction can change or fail, which is normal for source-dependent media tools."
    ]
  }
};
