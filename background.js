/**
 * Background Service Worker for Rodha Video Downloader
 * Handles video download requests and manages downloads
 * Tablet-compatible with fallback download methods
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadVideo') {
    downloadVideo(request.videoUrl, request.videoName, sender.tab.id);
    sendResponse({ status: 'download started' });
  }
  
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['autoDownload', 'notifications', 'downloadMethod'], (settings) => {
      sendResponse(settings);
    });
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'saveSettings') {
    chrome.storage.sync.set(request.settings, () => {
      sendResponse({ status: 'settings saved' });
    });
    return true;
  }

  if (request.action === 'getDeviceInfo') {
    sendResponse({
      supportsDownloads: true,
      supportsNotifications: true,
      userAgent: navigator.userAgent
    });
  }
});

/**
 * Download video file with tablet support
 */
function downloadVideo(url, filename, tabId) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const sanitizedFilename = filename
    .replace(/[^a-z0-9_\-]/gi, '_')
    .substring(0, 100);
  
  const downloadOptions = {
    url: url,
    filename: `Videos/rodha_${timestamp}_${sanitizedFilename}.mp4`,
    saveAs: false
  };

  // Try native download API first
  if (chrome.downloads && typeof chrome.downloads.download === 'function') {
    chrome.downloads.download(downloadOptions, (downloadId) => {
      if (chrome.runtime.lastError) {
        // Fallback for mobile devices where downloads API might fail
        handleDownloadFallback(url, filename, sanitizedFilename);
        return;
      }

      if (downloadId) {
        // Show notification on success
        chrome.storage.sync.get(['notifications'], (settings) => {
          if (settings.notifications !== false) {
            showNotification('Download Started', `Downloading: ${sanitizedFilename}`);
          }
        });

        // Listen for download completion
        chrome.downloads.onChanged.addListener(function onDownloadChange(delta) {
          if (delta.id === downloadId && delta.state) {
            if (delta.state.current === 'complete') {
              showNotification('Download Complete', sanitizedFilename);
              chrome.downloads.onChanged.removeListener(onDownloadChange);
            } else if (delta.state.current === 'interrupted') {
              showNotification('Download Failed', sanitizedFilename);
              chrome.downloads.onChanged.removeListener(onDownloadChange);
            }
          }
        });
      } else {
        handleDownloadFallback(url, filename, sanitizedFilename);
      }
    });
  } else {
    // Downloads API not available - use fallback
    handleDownloadFallback(url, filename, sanitizedFilename);
  }
}

/**
 * Fallback download handler for mobile/tablet
 */
function handleDownloadFallback(url, filename, sanitizedFilename) {
  console.log('📱 Using fallback download method for tablet');
  
  // Store download info for content script to handle
  chrome.storage.local.set({
    pendingDownload: {
      url: url,
      filename: sanitizedFilename,
      timestamp: new Date().toISOString()
    }
  });

  showNotification(
    'Download Started',
    `${sanitizedFilename} - Using browser download`
  );
}

/**
 * Show notification with error handling
 */
function showNotification(title, message) {
  if (!chrome.notifications) {
    console.log(`📢 ${title}: ${message}`);
    return;
  }

  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon128.png',
      title: title,
      message: message
    });
  } catch (error) {
    console.warn('Notifications not available:', error);
    // Silently fail - notifications may not be available on all platforms
  }
}

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      autoDownload: false,
      notifications: true,
      downloadMethod: 'auto' // auto, blob, copy, native
    });

    console.log('🎥 Rodha Video Downloader installed - Tablet support enabled');
  }
});

/**
 * Handle extension updates
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    console.log('🔄 Rodha Video Downloader updated to version', chrome.runtime.getManifest().version);
  }
});
