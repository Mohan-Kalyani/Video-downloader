# Changelog

## [1.0.0] - 2026-08-24

### Added
- Initial release of Rodha Video Downloader extension
- Support for detecting videos on rodha.co.in
- One-click download functionality
- Support for multiple video formats:
  - Direct MP4/WebM streams
  - HTML5 video elements
  - Embedded iframes
  - HLS streams (.m3u8)
  - DASH streams (.mpd)
  - Custom data attributes
- Popup UI with video list and download buttons
- Settings panel with toggle options
- Auto-download and notification settings
- Download status notifications
- Extension icons for 16x16, 48x48, and 128x128 sizes

### Features
- Automatic video detection on page load
- Support for dynamically loaded videos via MutationObserver
- Clean and intuitive user interface
- Error handling and user feedback
- Progressive enhancement for various video hosting methods

### Documentation
- Comprehensive README with installation instructions
- Troubleshooting guide
- Privacy and security information
- Usage examples

---

### Planned Features (Future Releases)

#### [1.1.0] - Planned
- Batch download multiple videos at once
- Video quality selection for streams
- Download history and management
- Custom download folder selection
- Support for subtitles/closed captions
- Dark mode for popup UI
- Keyboard shortcuts for quick download

#### [1.2.0] - Planned
- Support for more video platforms beyond rodha.co.in
- Video preview/thumbnail display
- Download speed optimization
- Network proxy support for region-locked content
- Integration with video players (Vimeo, YouTube, etc.)

#### [2.0.0] - Planned (Major Update)
- Standalone desktop application
- Batch processing from URL lists
- Video conversion tools
- Advanced streaming protocol support
- Multi-platform support (Windows, macOS, Linux native apps)

---

## Version History

### Known Issues
- HLS and DASH streams require external ffmpeg tool
- Some embedded players may not be detected automatically
- Download timeout may occur for very large files

### Fixed Issues
- Video detection now works with dynamically loaded content
- Improved handling of multiple video sources on single page

### Performance
- Optimized content script to reduce page load impact
- Efficient MutationObserver usage to detect new videos
- Reduced popup UI render time

---

For more information, visit: https://github.com/Mohan-Kalyani/Video-downloader
