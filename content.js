/**
 * Content Script for Rodha Video Downloader
 * Detects and extracts video sources from the page
 */

// Video detection configuration
const VIDEO_SOURCES = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  m3u8: 'application/x-mpegURL',
  mpd: 'application/dash+xml'
};

// Store detected videos
let detectedVideos = [];

/**
 * Detect all video sources on the page
 */
function detectVideos() {
  detectedVideos = [];

  // 1. Detect HTML5 <video> elements
  detectHTML5Videos();

  // 2. Detect embedded iframes (YouTube, Vimeo, etc.)
  detectIframeVideos();

  // 3. Detect video in data attributes
  detectDataAttributeVideos();

  // 4. Detect video links
  detectVideoLinks();

  // Send detected videos to popup
  sendVideoListToPopup();

  // Setup observer for dynamically loaded videos
  setupMutationObserver();
}

/**
 * Detect HTML5 <video> elements
 */
function detectHTML5Videos() {
  const videos = document.querySelectorAll('video');
  
  videos.forEach((videoElement, index) => {
    // Check for <source> children
    const sources = videoElement.querySelectorAll('source');
    
    sources.forEach((source) => {
      const videoUrl = source.getAttribute('src');
      const type = source.getAttribute('type') || 'video/mp4';
      
      if (videoUrl) {
        addVideo({
          url: getAbsoluteUrl(videoUrl),
          title: `Video ${detectedVideos.length + 1}`,
          type: 'HTML5 Video',
          format: extractFormat(videoUrl, type),
          element: videoElement
        });
      }
    });

    // Check for src attribute on video element
    const videoSrc = videoElement.getAttribute('src');
    if (videoSrc && videoSrc.trim()) {
      addVideo({
        url: getAbsoluteUrl(videoSrc),
        title: `Video ${detectedVideos.length + 1}`,
        type: 'HTML5 Video',
        format: extractFormat(videoSrc),
        element: videoElement
      });
    }

    // Check for poster attribute for thumbnail
    const poster = videoElement.getAttribute('poster');
    if (poster) {
      videoElement.dataset.posterUrl = getAbsoluteUrl(poster);
    }
  });
}

/**
 * Detect embedded iframe videos
 */
function detectIframeVideos() {
  const iframes = document.querySelectorAll('iframe');
  
  iframes.forEach((iframe) => {
    const src = iframe.getAttribute('src');
    
    if (src) {
      // YouTube
      if (src.includes('youtube.com') || src.includes('youtu.be')) {
        const videoId = extractYouTubeId(src);
        if (videoId) {
          addVideo({
            url: src,
            title: `YouTube Video`,
            type: 'Embedded Iframe',
            format: 'iframe',
            element: iframe
          });
        }
      }
      
      // Vimeo
      if (src.includes('vimeo.com')) {
        addVideo({
          url: src,
          title: `Vimeo Video`,
          type: 'Embedded Iframe',
          format: 'iframe',
          element: iframe
        });
      }

      // Direct video file in iframe
      if (src.match(/\.(mp4|webm|ogv)$/i)) {
        addVideo({
          url: getAbsoluteUrl(src),
          title: `Embedded Video ${detectedVideos.length + 1}`,
          type: 'Embedded Iframe',
          format: extractFormat(src),
          element: iframe
        });
      }
    }
  });
}

/**
 * Detect videos in data attributes
 */
function detectDataAttributeVideos() {
  // Common data attribute patterns
  const patterns = [
    '[data-video-url]',
    '[data-src]',
    '[data-mp4]',
    '[data-video]'
  ];

  patterns.forEach((pattern) => {
    document.querySelectorAll(pattern).forEach((element) => {
      const videoUrl = 
        element.getAttribute('data-video-url') ||
        element.getAttribute('data-src') ||
        element.getAttribute('data-mp4') ||
        element.getAttribute('data-video');

      if (videoUrl && isValidUrl(videoUrl)) {
        addVideo({
          url: getAbsoluteUrl(videoUrl),
          title: `Video ${detectedVideos.length + 1}`,
          type: 'Data Attribute',
          format: extractFormat(videoUrl),
          element: element
        });
      }
    });
  });
}

/**
 * Detect video links (direct .mp4, .m3u8, .mpd files)
 */
function detectVideoLinks() {
  const videoExtensions = ['.mp4', '.webm', '.ogv', '.m3u8', '.mpd'];
  const links = document.querySelectorAll('a[href]');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    
    if (href && videoExtensions.some(ext => href.toLowerCase().includes(ext))) {
      if (isValidUrl(href)) {
        addVideo({
          url: getAbsoluteUrl(href),
          title: link.textContent.trim() || `Video ${detectedVideos.length + 1}`,
          type: 'Direct Link',
          format: extractFormat(href),
          element: link
        });
      }
    }
  });
}

/**
 * Add video to detected list (avoid duplicates)
 */
function addVideo(video) {
  const isDuplicate = detectedVideos.some(v => v.url === video.url);
  
  if (!isDuplicate && video.url) {
    detectedVideos.push(video);
  }
}

/**
 * Extract video format from URL or type
 */
function extractFormat(url, type = '') {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('.mp4')) return 'MP4';
  if (urlLower.includes('.webm')) return 'WebM';
  if (urlLower.includes('.ogv')) return 'OGV';
  if (urlLower.includes('.m3u8')) return 'HLS';
  if (urlLower.includes('.mpd')) return 'DASH';
  
  if (type.includes('mp4')) return 'MP4';
  if (type.includes('webm')) return 'WebM';
  if (type.includes('ogv')) return 'OGV';
  if (type.includes('mpegURL')) return 'HLS';
  if (type.includes('dash')) return 'DASH';
  
  return 'Unknown';
}

/**
 * Extract YouTube video ID
 */
function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * Convert relative URLs to absolute
 */
function getAbsoluteUrl(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('//')) {
    return window.location.protocol + url;
  }
  
  if (url.startsWith('/')) {
    return window.location.origin + url;
  }
  
  return window.location.origin + '/' + url;
}

/**
 * Validate URL
 */
function isValidUrl(url) {
  try {
    new URL(url, window.location.origin);
    return true;
  } catch {
    return false;
  }
}

/**
 * Send video list to popup
 */
function sendVideoListToPopup() {
  chrome.runtime.sendMessage({
    action: 'videosDetected',
    videos: detectedVideos
  }).catch(() => {
    // Popup not open, ignore error
  });
}

/**
 * Setup observer for dynamically loaded videos
 */
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    let hasNewVideos = false;
    const previousCount = detectedVideos.length;

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Re-detect videos
        detectVideos();
        hasNewVideos = detectedVideos.length > previousCount;
      }
    });

    if (hasNewVideos) {
      sendVideoListToPopup();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });
}

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideos') {
    sendResponse({ videos: detectedVideos });
  }
  
  if (request.action === 'highlightVideo') {
    const video = detectedVideos[request.index];
    if (video && video.element) {
      video.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      video.element.style.border = '3px solid red';
      
      setTimeout(() => {
        video.element.style.border = '';
      }, 2000);
    }
  }
});

// Start video detection when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', detectVideos);
} else {
  detectVideos();
}

// Also detect after a short delay to catch lazy-loaded content
setTimeout(detectVideos, 2000);
