# Rodha Video Downloader - Tablet Support Guide

## 📱 Installation on Tablet

### Android Tablet (Chrome)

1. **Enable Developer Mode**
   - Open Chrome on your Android tablet
   - Go to `chrome://extensions`
   - Enable "Developer mode" (toggle in top-right corner)

2. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to the extension folder
   - Select the Video-downloader directory
   - The extension should now appear in your extensions list

3. **Verify Installation**
   - You should see the extension icon in Chrome's toolbar
   - Click the icon to open the popup

### iPad (iOS 15+)

**Note:** Direct Chrome extension support on iPad is limited. Use one of these alternatives:

#### Option 1: Web Clipper Method
1. Create a Safari bookmark with custom JavaScript
2. Use it to download videos from Rodha pages
3. Videos save to iPad's Files app

#### Option 2: Desktop Sync
1. Install extension on desktop/laptop
2. Sign in to same Google account
3. Extensions sync across devices
4. Use desktop version for downloads, transfer via iCloud

#### Option 3: Web App Version
1. Visit a hosted web version (future release)
2. Works directly in Safari/Chrome
3. Full tablet optimization

---

## 🎥 How to Use on Tablet

### Basic Workflow

1. **Open Rodha in Chrome**
   - Navigate to `https://www.rodha.co.in`
   - Load the video lecture or class

2. **Open Extension Popup**
   - Tap the extension icon in Chrome toolbar
   - Popup opens at bottom of screen (Android) or in panel (iPad)

3. **Detect Videos**
   - Extension automatically scans page
   - Shows "🔍 Searching for videos..."
   - Found videos appear in list

4. **Download or Copy**
   - **Download**: Tap "⬇️ Download" button
   - **Copy URL**: Tap "📋 Copy" to copy video link
   - **Highlight**: Tap "👁️" to highlight video on page

### Touch Controls

| Action | How to Do It |
|--------|------------|
| Download video | Tap "⬇️ Download" button |
| Copy URL | Tap "📋 Copy" button |
| Highlight | Tap "👁️" button |
| Refresh | Tap "🔄" button |
| Settings | Tap "⚙️" button |
| Close settings | Tap "Close" button |

### Orientation Support

- **Portrait Mode**: Optimized for vertical viewing
- **Landscape Mode**: Wider layout with grid view (on large tablets)
- **Auto-adjust**: UI adapts automatically when you rotate device

---

## 💾 Download Methods on Tablet

### Method 1: Direct Download (Recommended)
- **How it works**: Video downloads to tablet's Downloads folder
- **Best for**: Videos in MP4, WebM, or similar formats
- **Supports**: Android tablets, some iPad scenarios
- **Storage**: Default browser download location

### Method 2: Copy URL
- **How it works**: Video URL copied to clipboard
- **Best for**: All devices and video types
- **Next step**: Open download manager or external app
- **Apps to use**: 
  - Android: ADM, TubeMate, SnapTube
  - iPad: Documents by Readdle, CloudSafe

### Method 3: Share & Save
- Tap "📋 Copy" button
- Tap and hold to see full URL
- Share to cloud storage (Google Drive, OneDrive, iCloud)
- Download from there

---

## ⚙️ Settings & Customization

### Accessing Settings
1. Tap "⚙️" button in top-right
2. Settings panel opens

### Available Settings

#### Auto-Download
- **OFF** (Default): Ask before each download
- **ON**: Automatically download videos
- **Best for**: Batch downloading lectures

#### Show Notifications
- **ON** (Default): Show download status
- **OFF**: Silent downloads
- **Useful for**: Discreet downloading in class

### Saving Settings
1. Adjust toggles as needed
2. Tap "Save Settings"
3. Tap "Close" to return
4. Settings persist across sessions

---

## 📊 Supported Video Formats

| Format | Support | Notes |
|--------|---------|-------|
| MP4 | ✅ Full | Most common, works everywhere |
| WebM | ✅ Full | Modern format, good compression |
| OGV | ✅ Full | Older format, rarely used |
| HLS (.m3u8) | ⚠️ Copy only | Need external tools to download |
| DASH (.mpd) | ⚠️ Copy only | Streaming format, copy URL for tools |
| iframe (YouTube) | ✅ Link | Copy and use YouTube downloader |
| Data attributes | ✅ Full | Custom video tags |

---

## 🔧 Troubleshooting

### Problem: Extension not showing
**Solution:**
- Check that it's enabled in `chrome://extensions`
- Restart Chrome
- Reload the page (Rodha site)
- Try clearing cache: Settings > Privacy > Clear browsing data

### Problem: No videos detected
**Solutions:**
- Wait for page to fully load
- Tap "🔄" refresh button
- Check if videos are in iframes
- Try a different lecture/video
- Ensure JavaScript is enabled

### Problem: Download fails
**Solutions:**
- Check internet connection
- Try copy method instead
- Use external download app
- Check available storage space
- Disable VPN if active

### Problem: Popup is too small
**Solutions:**
- Pinch to zoom (if supported)
- Rotate to landscape mode
- Use copy method to use external downloader
- On larger tablets, popup auto-expands

### Problem: Settings not saving
**Solution:**
- Sign out of Chrome, sign back in
- Clear Chrome data and reinstall extension
- Try in different Chrome profile

---

## 📁 File Storage

### Android Tablet
- **Default location**: `Downloads/Videos/rodha_[date]_[name].mp4`
- **Access**: Files app > Downloads folder
- **Move files**: Drag to other folders
- **Cloud sync**: Backup to Google Drive

### iPad
- **Default**: iCloud Drive (if syncing enabled)
- **Alternative**: Use Files app
- **Cloud options**: 
  - Google Drive
  - OneDrive
  - Dropbox
  - iCloud Drive

### Naming Convention
- **Format**: `rodha_YYYY-MM-DD_VideoName.mp4`
- **Example**: `rodha_2026-08-24_Lecture_Physics.mp4`
- **Sanitized**: Special characters replaced with underscores

---

## 🚀 Performance Tips

### For Better Speed
1. **Close other apps**: Free up RAM
2. **Good connection**: Use WiFi if possible
3. **Clear cache**: Settings > Apps > Chrome > Storage > Clear Cache
4. **Disable extensions**: Temporarily disable other extensions

### For Large Files
1. **WiFi required**: Large videos may timeout on mobile data
2. **Stable connection**: Don't move between WiFi networks
3. **Battery**: Keep device plugged in during download
4. **Check storage**: Ensure enough free space

### Batch Downloading
1. Enable "Auto-download" in settings
2. Open multiple tabs with videos
3. Click each extension popup's download button
4. All queue automatically

---

## 🔒 Privacy & Security

### Data Handled
- ✅ Video URLs only
- ✅ Your downloaded files
- ✅ Settings (auto-download, notifications)
- ❌ Does NOT collect personal data
- ❌ Does NOT track usage
- ❌ Does NOT access accounts

### Permissions Used
| Permission | Why | Scope |
|-----------|-----|-------|
| `tabs` | Access current page | Only rodha.co.in |
| `scripting` | Detect videos | Only rodha.co.in |
| `downloads` | Save files | To your device |
| `storage` | Remember settings | Encrypted locally |

### Safe to Use
- Open source (available on GitHub)
- No internet connection to external servers
- All processing on your device
- Works offline for detected videos

---

## 🆘 Getting Help

### Common Questions

**Q: Will this get me in trouble?**
A: This extension is for personal download backup. Always check Rodha's terms of service.

**Q: Can I download entire courses?**
A: Yes, but downloads happen one video at a time. Use batch mode in settings.

**Q: Does it work without internet?**
A: No, you need internet to fetch videos. Extension works offline only for already-detected videos.

**Q: Can I share downloaded videos?**
A: Check Rodha's terms. Typically for personal use only.

### Report Issues
1. **GitHub**: [Issues page](https://github.com/Mohan-Kalyani/Video-downloader/issues)
2. **What to include**:
   - Device (iPad/Android tablet model)
   - Chrome version
   - What you were doing
   - Error message (if any)
   - Screenshot (optional)

---

## 📱 Device Compatibility

| Device | Support | Notes |
|--------|---------|-------|
| **Android 8+** | ✅ Full | All tablets supported |
| **iPad (iOS 15+)** | ⚠️ Limited | Use workarounds |
| **Samsung Tab** | ✅ Full | Recommended |
| **Amazon Fire HD** | ✅ Full | Works great |
| **Lenovo Tab** | ✅ Full | No issues |
| **OnePlus Tab** | ✅ Full | Confirmed working |

---

## 🎓 Video Tutorial

### Quick Start (2 minutes)
1. Install extension
2. Go to Rodha video page
3. Tap extension icon
4. Wait for detection
5. Tap "Download" or "Copy"
6. Done!

### Full Setup (5 minutes)
- Enable developer mode
- Load unpacked extension
- Configure settings
- Test with sample video
- Organize downloads

---

## 🚀 Version History

### v1.1.0 - Tablet Support (Current)
- ✅ Tablet detection
- ✅ Touch optimization
- ✅ Responsive UI
- ✅ Landscape/portrait support
- ✅ Mobile-friendly buttons
- ✅ Alternative download methods

### v1.0.0 - Initial Release
- Basic video detection
- Download functionality
- Settings panel
- Desktop optimized

---

## 📞 Support & Feedback

**Questions?** Create an issue on GitHub
**Suggestions?** We'd love to hear them!
**Bug reports?** Include device info and steps to reproduce

---

## 📄 License

This extension is provided as-is for personal use. Please respect copyright and Rodha's terms of service.

**Made with ❤️ for tablet users**

Last Updated: August 24, 2026
Version: 1.1.0 (Tablet Support)
