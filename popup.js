/**
 * Popup Script for Rodha Video Downloader
 * Manages the popup UI and user interactions
 */

let currentVideos = [];

// DOM Elements
const statusSection = document.getElementById('statusSection');
const videosContainer = document.getElementById('videosContainer');
const noVideosSection = document.getElementById('noVideosSection');
const errorSection = document.getElementById('errorSection');
const videosList = document.getElementById('videosList');
const videoCount = document.getElementById('videoCount');
const statusMessage = document.getElementById('statusMessage');
const errorMessage = document.getElementById('errorMessage');
const refreshBtn = document.getElementById('refreshBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const autoDownloadCheckbox = document.getElementById('autoDownload');
const notificationsCheckbox = document.getElementById('notifications');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  requestVideosFromContent();
  setupEventListeners();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
  refreshBtn.addEventListener('click', requestVideosFromContent);
  settingsBtn.addEventListener('click', toggleSettings);
  closeSettingsBtn.addEventListener('click', closeSettings);
  saveSettingsBtn.addEventListener('click', saveSettings);
}

/**
 * Request videos from content script
 */
function requestVideosFromContent() {
  showStatus('🔍 Searching for videos...');
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) {
      showError('Could not access current tab');
      return;
    }

    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'getVideos' },
      (response) => {
        if (chrome.runtime.lastError) {
          showError('Could not connect to page. Refresh and try again.');
          return;
        }

        if (response && response.videos) {
          currentVideos = response.videos;
          displayVideos();
        } else {
          showError('No response from page');
        }
      }
    );
  });
}

/**
 * Display detected videos
 */
function displayVideos() {
  if (currentVideos.length === 0) {
    statusSection.classList.add('hidden');
    videosContainer.classList.add('hidden');
    noVideosSection.classList.remove('hidden');
    return;
  }

  statusSection.classList.add('hidden');
  noVideosSection.classList.add('hidden');
  videosContainer.classList.remove('hidden');

  videoCount.textContent = `Found ${currentVideos.length} video${currentVideos.length !== 1 ? 's' : ''}`;
  videosList.innerHTML = '';

  currentVideos.forEach((video, index) => {
    const videoElement = createVideoElement(video, index);
    videosList.appendChild(videoElement);
  });
}

/**
 * Create video list item element
 */
function createVideoElement(video, index) {
  const div = document.createElement('div');
  div.className = 'video-item';
  div.id = `video-${index}`;

  const titleLength = 50;
  const shortTitle = video.title.length > titleLength 
    ? video.title.substring(0, titleLength) + '...' 
    : video.title;

  const urlLength = 45;
  const shortUrl = video.url.length > urlLength
    ? video.url.substring(0, urlLength) + '...'
    : video.url;

  div.innerHTML = `
    <div class="video-info">
      <div class="video-title" title="${video.title}">${escapeHtml(shortTitle)}</div>
      <div class="video-meta">
        <span class="video-type">${video.type}</span>
        <span class="video-format">${video.format}</span>
      </div>
      <div class="video-url" title="${video.url}">
        <small>${escapeHtml(shortUrl)}</small>
      </div>
    </div>
    <div class="video-actions">
      <button class="btn btn-download" data-index="${index}" title="Download this video">
        ⬇️ Download
      </button>
      <button class="btn btn-copy" data-index="${index}" title="Copy video URL">
        📋 Copy
      </button>
      <button class="btn btn-highlight" data-index="${index}" title="Highlight on page">
        👁️
      </button>
    </div>
  `;

  // Add event listeners
  div.querySelector('.btn-download').addEventListener('click', () => downloadVideo(index));
  div.querySelector('.btn-copy').addEventListener('click', () => copyUrl(index));
  div.querySelector('.btn-highlight').addEventListener('click', () => highlightVideo(index));

  return div;
}

/**
 * Download video
 */
function downloadVideo(index) {
  const video = currentVideos[index];
  
  if (!video) return;

  // Show downloading state
  const btn = document.querySelector(`#video-${index} .btn-download`);
  const originalText = btn.textContent;
  btn.textContent = '⏳ Starting...';
  btn.disabled = true;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({
      action: 'downloadVideo',
      videoUrl: video.url,
      videoName: video.title
    }, (response) => {
      if (response && response.status === 'download started') {
        btn.textContent = '✅ Started!';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      } else {
        btn.textContent = '❌ Error';
        btn.disabled = false;
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    });
  });
}

/**
 * Copy video URL to clipboard
 */
function copyUrl(index) {
  const video = currentVideos[index];
  
  if (!video) return;

  navigator.clipboard.writeText(video.url).then(() => {
    const btn = document.querySelector(`#video-${index} .btn-copy`);
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';
    
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }).catch(() => {
    alert('Failed to copy URL');
  });
}

/**
 * Highlight video on page
 */
function highlightVideo(index) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'highlightVideo',
      index: index
    }).catch(() => {
      alert('Could not highlight video');
    });
  });
}

/**
 * Show status message
 */
function showStatus(message) {
  statusSection.classList.remove('hidden');
  videosContainer.classList.add('hidden');
  noVideosSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  statusMessage.textContent = message;
}

/**
 * Show error message
 */
function showError(message) {
  statusSection.classList.add('hidden');
  videosContainer.classList.add('hidden');
  noVideosSection.classList.add('hidden');
  errorSection.classList.remove('hidden');
  errorMessage.textContent = `⚠️ ${message}`;
}

/**
 * Load settings from storage
 */
function loadSettings() {
  chrome.storage.sync.get(['autoDownload', 'notifications'], (settings) => {
    autoDownloadCheckbox.checked = settings.autoDownload || false;
    notificationsCheckbox.checked = settings.notifications !== false;
  });
}

/**
 * Save settings to storage
 */
function saveSettings() {
  const settings = {
    autoDownload: autoDownloadCheckbox.checked,
    notifications: notificationsCheckbox.checked
  };

  chrome.runtime.sendMessage({
    action: 'saveSettings',
    settings: settings
  }, (response) => {
    if (response && response.status === 'settings saved') {
      closeSettings();
      showStatus('✅ Settings saved!');
      setTimeout(() => {
        statusSection.classList.add('hidden');
      }, 2000);
    }
  });
}

/**
 * Toggle settings panel
 */
function toggleSettings() {
  settingsPanel.classList.toggle('hidden');
}

/**
 * Close settings panel
 */
function closeSettings() {
  settingsPanel.classList.add('hidden');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Listen for messages from content script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'videosDetected') {
    currentVideos = request.videos;
    displayVideos();
  }
});
