/**
 * Tablet Utilities - Device detection and tablet-specific functions
 * Handles device detection, viewport management, and touch event handling
 */

// Device Detection
const TabletUtils = {
  /**
   * Detect if the current device is a tablet
   */
  isTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroidTablet = userAgent.includes('android') && 
                           !userAgent.includes('mobile');
    const isIPad = userAgent.includes('ipad') || 
                  (userAgent.includes('mac') && navigator.maxTouchPoints > 4);
    return isAndroidTablet || isIPad;
  },

  /**
   * Detect if device is mobile (phone or tablet)
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * Get device type
   */
  getDeviceType() {
    if (this.isTablet()) return 'tablet';
    if (this.isMobile()) return 'mobile';
    return 'desktop';
  },

  /**
   * Get viewport dimensions
   */
  getViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      isLandscape: window.innerWidth > window.innerHeight,
      isPortrait: window.innerHeight > window.innerWidth
    };
  },

  /**
   * Check if viewport is large (tablet/desktop)
   */
  isLargeViewport() {
    return window.innerWidth >= 768;
  },

  /**
   * Detect screen orientation
   */
  getOrientation() {
    if (screen.orientation) {
      return screen.orientation.type;
    }
    return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
  },

  /**
   * Handle orientation change
   */
  onOrientationChange(callback) {
    window.addEventListener('orientationchange', () => {
      setTimeout(callback, 100);
    });
    
    screen.orientation.addEventListener('change', () => {
      callback();
    });
  },

  /**
   * Get touch support
   */
  supportsTouchEvents() {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
  },

  /**
   * Optimize for touch - enhance touch targets
   */
  optimizeForTouch() {
    if (!this.supportsTouchEvents()) return;

    // Add touch class to document
    document.documentElement.classList.add('touch-enabled');

    // Disable hover effects and replace with active states
    const style = document.createElement('style');
    style.textContent = `
      /* Disable hover effects on touch devices */
      @media (hover: none) {
        button:hover,
        a:hover {
          background-color: inherit;
        }
      }
      
      /* Enhance touch targets */
      .touch-enabled button,
      .touch-enabled a {
        min-height: 44px;
        min-width: 44px;
        padding: 12px 16px;
      }
      
      /* Prevent double-tap zoom on buttons */
      .touch-enabled button,
      .touch-enabled a {
        touch-action: manipulation;
      }
    `;
    document.head.appendChild(style);
  },

  /**
   * Handle long-press (right-click equivalent on touch)
   */
  onLongPress(element, callback, duration = 500) {
    let timer = null;
    let isLongPress = false;

    const startPress = () => {
      isLongPress = false;
      timer = setTimeout(() => {
        isLongPress = true;
        callback();
      }, duration);
    };

    const endPress = () => {
      if (timer) clearTimeout(timer);
    };

    // Touch events
    element.addEventListener('touchstart', startPress, { passive: true });
    element.addEventListener('touchend', endPress, { passive: true });
    element.addEventListener('touchmove', endPress, { passive: true });

    // Mouse events (for desktop testing)
    element.addEventListener('mousedown', startPress);
    element.addEventListener('mouseup', endPress);
    element.addEventListener('mousemove', endPress);
  },

  /**
   * Get available download methods on this device
   */
  getAvailableDownloadMethods() {
    const methods = [];

    // Check if downloads API is available
    if (chrome && chrome.downloads) {
      methods.push('native');
    }

    // Blob download is always available
    methods.push('blob');

    // Copy URL is always available
    methods.push('copy');

    return methods;
  },

  /**
   * Detect storage availability
   */
  getStorageInfo() {
    if (navigator.storage && navigator.storage.estimate) {
      return navigator.storage.estimate();
    }
    return {
      usage: 0,
      quota: 0
    };
  },

  /**
   * Check if specific feature is supported
   */
  isFeatureSupported(feature) {
    const supported = {
      'downloads': chrome && chrome.downloads !== undefined,
      'notifications': chrome && chrome.notifications !== undefined,
      'storage': chrome && chrome.storage !== undefined,
      'touch': this.supportsTouchEvents(),
      'clipboard': navigator.clipboard !== undefined,
      'blob-urls': typeof URL.createObjectURL === 'function'
    };
    return supported[feature] !== undefined ? supported[feature] : false;
  },

  /**
   * Get device capabilities summary
   */
  getCapabilities() {
    return {
      deviceType: this.getDeviceType(),
      isTablet: this.isTablet(),
      isMobile: this.isMobile(),
      supportsTouchEvents: this.supportsTouchEvents(),
      largeViewport: this.isLargeViewport(),
      orientation: this.getOrientation(),
      viewport: this.getViewport(),
      availableDownloadMethods: this.getAvailableDownloadMethods(),
      features: {
        downloads: this.isFeatureSupported('downloads'),
        notifications: this.isFeatureSupported('notifications'),
        storage: this.isFeatureSupported('storage'),
        clipboard: this.isFeatureSupported('clipboard'),
        blobUrls: this.isFeatureSupported('blob-urls')
      }
    };
  },

  /**
   * Log device capabilities (for debugging)
   */
  logCapabilities() {
    console.log('🎯 Device Capabilities:', this.getCapabilities());
  }
};

// Initialize tablet utilities on script load
if (typeof window !== 'undefined') {
  // Optimize for touch on startup
  TabletUtils.optimizeForTouch();

  // Log capabilities in development
  if (chrome && chrome.runtime) {
    console.log('📱 Tablet Utilities Loaded', TabletUtils.getDeviceType());
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TabletUtils;
}
