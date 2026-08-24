/**
 * Background Service Worker for Rodha Video Downloader
 * Handles video download requests and manages downloads
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadVideo') {
    downloadVideo(request.videoUrl, request.videoName, sender.tab.id);
    sendResponse({ status: 'download started' });
  }
  
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['autoDownload', 'notifications'], (settings) => {
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
});

/**
 * Download video file
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

  chrome.downloads.download(downloadOptions, (downloadId) => {
    if (downloadId) {
      // Show notification on success
      chrome.storage.sync.get(['notifications'], (settings) => {
        if (settings.notifications !== false) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon128.png',
            title: 'Download Started',
            message: `Downloading: ${sanitizedFilename}`
          });
        }
      });

      // Listen for download completion
      chrome.downloads.onChanged.addListener(function onDownloadChange(delta) {
        if (delta.id === downloadId && delta.state) {
          if (delta.state.current === 'complete') {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'images/icon128.png',
              title: 'Download Complete',
              message: sanitizedFilename
            });
            chrome.downloads.onChanged.removeListener(onDownloadChange);
          } else if (delta.state.current === 'interrupted') {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'images/icon128.png',
              title: 'Download Failed',
              message: sanitizedFilename
            });
            chrome.downloads.onChanged.removeListener(onDownloadChange);
          }
        }
      });
    } else {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon128.png',
        title: 'Download Error',
        message: 'Failed to start download'
      });
    }
  });
}

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      autoDownload: false,
      notifications: true
    });
  }
});
