/**
 * Mobile Download Handler
 * Provides alternative download methods for tablets and mobile devices
 * Handles blob URLs, data URLs, and fallback mechanisms
 */

class MobileDownloadHandler {
  constructor() {
    this.isTablet = this.detectTablet();
    this.downloadMethod = this.selectDownloadMethod();
  }

  /**
   * Detect if device is a tablet
   */
  detectTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroidTablet = userAgent.includes('android') && 
                           !userAgent.includes('mobile');
    const isIPad = userAgent.includes('ipad') || 
                  (userAgent.includes('mac') && navigator.maxTouchPoints > 4);
    return isAndroidTablet || isIPad;
  }

  /**
   * Select the best download method available
   */
  selectDownloadMethod() {
    // Priority 1: Native downloads API (for Android tablets)
    if (chrome && chrome.downloads) {
      try {
        return 'native';
      } catch (e) {
        console.warn('Native downloads API unavailable:', e);
      }
    }

    // Priority 2: Blob/Object URLs (works on all platforms)
    if (typeof URL.createObjectURL === 'function') {
      return 'blob';
    }

    // Priority 3: Copy to clipboard (fallback)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return 'copy';
    }

    // Last resort: data URLs
    return 'data-url';
  }

  /**
   * Download video using the selected method
   */
  async downloadVideo(videoUrl, filename) {
    console.log(`📥 Downloading via ${this.downloadMethod}:`, filename);

    try {
      switch (this.downloadMethod) {
        case 'native':
          return await this.downloadViaChrome(videoUrl, filename);
        case 'blob':
          return await this.downloadViaBlob(videoUrl, filename);
        case 'copy':
          return await this.downloadViaCopy(videoUrl, filename);
        case 'data-url':
          return this.downloadViaDataUrl(videoUrl, filename);
        default:
          throw new Error('No download method available');
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to copy method
      if (this.downloadMethod !== 'copy') {
        return this.downloadViaCopy(videoUrl, filename);
      }
      throw error;
    }
  }

  /**
   * Download using Chrome's downloads API (Android tablets)
   */
  downloadViaChrome(url, filename) {
    return new Promise((resolve, reject) => {
      if (!chrome || !chrome.downloads) {
        reject(new Error('Chrome downloads API not available'));
        return;
      }

      const timestamp = new Date().toISOString().slice(0, 10);
      const sanitizedFilename = this.sanitizeFilename(filename);
      
      const downloadOptions = {
        url: url,
        filename: `Videos/rodha_${timestamp}_${sanitizedFilename}.mp4`,
        saveAs: false
      };

      chrome.downloads.download(downloadOptions, (downloadId) => {
        if (downloadId) {
          console.log('✅ Chrome download started:', downloadId);
          resolve({ method: 'native', id: downloadId });
        } else {
          reject(new Error('Failed to start Chrome download'));
        }
      });
    });
  }

  /**
   * Download using Blob URLs (works on all platforms)
   */
  async downloadViaBlob(url, filename) {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      this.createDownloadLink(blobUrl, filename);
      
      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

      console.log('✅ Blob download initiated:', filename);
      return { method: 'blob', filename };
    } catch (error) {
      console.error('Blob download failed:', error);
      throw error;
    }
  }

  /**
   * Download via copy to clipboard
   */
  async downloadViaCopy(url, filename) {
    try {
      await navigator.clipboard.writeText(url);
      console.log('✅ Video URL copied to clipboard');
      return {
        method: 'copy',
        message: `Video URL copied! Use a download manager to save:\n${url}`
      };
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      throw error;
    }
  }

  /**
   * Download using data URLs (for small files)
   */
  downloadViaDataUrl(url, filename) {
    if (url.startsWith('data:')) {
      this.createDownloadLink(url, filename);
      return { method: 'data-url', filename };
    } else {
      throw new Error('URL is not a data URL');
    }
  }

  /**
   * Create a temporary download link and trigger click
   */
  createDownloadLink(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = this.sanitizeFilename(filename);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    try {
      link.click();
    } finally {
      document.body.removeChild(link);
    }
  }

  /**
   * Sanitize filename for safe download
   */
  sanitizeFilename(filename) {
    return filename
      .replace(/[^a-z0-9_\-\.]/gi, '_')
      .substring(0, 100)
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Fetch video with progress tracking
   */
  async fetchVideoWithProgress(url, onProgress) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const total = parseInt(response.headers.get('content-length'), 10);
      let loaded = 0;

      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        loaded += value.length;

        if (onProgress) {
          onProgress({
            loaded,
            total,
            percent: total ? (loaded / total) * 100 : 0
          });
        }
      }

      return new Blob(chunks);
    } catch (error) {
      console.error('Video fetch failed:', error);
      throw error;
    }
  }

  /**
   * Check if URL is downloadable
   */
  isDownloadableUrl(url) {
    const downloadableExtensions = [
      '.mp4', '.webm', '.ogv', '.mov', '.m3u8', '.mpd'
    ];
    
    const urlLower = url.toLowerCase();
    return downloadableExtensions.some(ext => urlLower.includes(ext));
  }

  /**
   * Get download handler info for UI
   */
  getDownloadInfo() {
    return {
      method: this.downloadMethod,
      isTablet: this.isTablet,
      supportsNative: !!(chrome && chrome.downloads),
      supportsBlob: typeof URL.createObjectURL === 'function',
      supportsClipboard: !!(navigator.clipboard && navigator.clipboard.writeText),
      capabilities: {
        'native': this.downloadMethod === 'native',
        'blob': this.downloadMethod === 'blob',
        'copy': this.downloadMethod === 'copy',
        'data-url': this.downloadMethod === 'data-url'
      }
    };
  }
}

// Create global instance
const mobileDownloader = new MobileDownloadHandler();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileDownloadHandler;
}
