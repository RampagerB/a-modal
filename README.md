# A Modal

A Chromium browser extension that intercepts link clicks and displays them in a modal window inspired by Arc Browser. / 一个 Chromium 浏览器插件，用于拦截链接点击并在模态窗口中显示链接内容，灵感来源于 Arc Browser。

## Features / 功能特性

- **Link Interception**: Intercepts links that would open in new tabs and displays them in a modal / **链接拦截**：拦截会在新标签页打开的链接，并在模态窗口中显示
- **Blacklist Mode**: Uses a blacklist system to exclude specific domains from modal display / **黑名单模式**：使用黑名单系统排除特定域名的模态显示
- **Modal Display**: Shows content in a modal with 80% screen width and full height / **模态显示**：在模态窗口中显示内容，宽度为屏幕的 80%，高度为全屏
- **Control Buttons**: Close, copy URL, and open in new tab buttons / **控制按钮**：关闭、复制网址和在新标签页打开按钮
- **Hardware Acceleration**: Optimized for smooth video playback / **硬件加速**：针对流畅的视频播放进行优化
- **Multi-language Support**: Automatically adapts to system language (English/Chinese) / **多语言支持**：自动适配系统语言（英语/中文）
- **Font Awesome Icons**: Professional icon design / **Font Awesome 图标**：专业的图标设计

## Installation / 安装

1. Download or clone this repository / 下载或克隆此仓库
2. Open Chrome and navigate to `chrome://extensions/` / 打开 Chrome 并导航到 `chrome://extensions/`
3. Enable "Developer mode" / 启用"开发者模式"
4. Click "Load unpacked" and select the extension directory / 点击"加载已解压的扩展程序"并选择扩展目录
5. The extension will appear in your browser toolbar / 扩展将出现在您的浏览器工具栏中

## Usage / 使用方法

### Adding to Blacklist / 添加到黑名单

1. Visit any website / 访问任意网站
2. Click the extension icon in the browser toolbar / 点击浏览器工具栏中的扩展图标
3. Toggle the "Add to blacklist" switch / 切换"添加到黑名单"开关
4. The domain will be added to or removed from the blacklist / 域名将被添加到或从黑名单中移除

### Viewing Links in Modal / 在模态窗口中查看链接

1. Ensure the current domain is NOT in the blacklist / 确保当前域名不在黑名单中
2. Click any link that would normally open in a new tab / 点击任何通常会在新标签页打开的链接
3. The link will open in a modal window instead / 链接将在模态窗口中打开
4. Use the control buttons to close, copy URL, or open in new tab / 使用控制按钮关闭、复制网址或在新标签页打开

## Modal Controls / 模态控制

- **Close Button (×)**: Closes the modal / **关闭按钮 (×)**：关闭模态窗口
- **Copy Button (📋)**: Copies the current URL to clipboard / **复制按钮 (📋)**：将当前网址复制到剪贴板
- **Open in New Tab Button (↗)**: Opens the link in a new tab / **在新标签页打开按钮 (↗)**：在新标签页中打开链接
- **Click Background**: Click outside the modal to close it / **点击背景**：点击模态窗口外部关闭它

## Technical Details / 技术细节

- **Manifest Version**: V3 / **清单版本**：V3
- **Permissions**: activeTab, storage, scripting / **权限**：activeTab、storage、scripting
- **Storage**: Chrome Storage API for blacklist management / **存储**：Chrome 存储 API 用于黑名单管理
- **Content Scripts**: Link interception and modal display / **内容脚本**：链接拦截和模态显示
- **Background Service Worker**: Message handling and storage management / **后台服务工作线程**：消息处理和存储管理

## Performance Optimization / 性能优化

- **Hardware Acceleration**: GPU rendering for smooth animations / **硬件加速**：GPU 渲染以实现流畅动画
- **Lazy Loading**: iframe content loads efficiently / **懒加载**：iframe 内容高效加载
- **CSS Optimizations**: will-change and transform properties / **CSS 优化**：will-change 和 transform 属性
- **Efficient DOM Manipulation**: Optimized for minimal reflows / **高效 DOM 操作**：针对最小重排进行优化

## Browser Compatibility / 浏览器兼容性

- Google Chrome / 谷歌浏览器
- Microsoft Edge / 微软 Edge
- Brave Browser / Brave 浏览器
- Other Chromium-based browsers / 其他基于 Chromium 的浏览器

## License / 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details / 本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## Contributing / 贡献

Contributions are welcome! Please feel free to submit issues and pull requests / 欢迎贡献！请随时提交问题和拉取请求

## Support / 支持

If you encounter any issues or have suggestions, please open an issue on GitHub / 如果您遇到任何问题或有建议，请在 GitHub 上提出问题

---

**Note**: This extension uses a blacklist mode by default, meaning it will intercept links on all domains except those in the blacklist. / **注意**：此扩展默认使用黑名单模式，意味着它将拦截所有域名上的链接，黑名单中的域名除外。