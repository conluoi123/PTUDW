# Background Music

Để thêm nhạc nền cho website:

1. **Tải file nhạc** (MP3 format, khoảng 2-3MB)
   - Nguồn free: https://www.bensound.com/
   - Hoặc: https://incompetech.com/music/royalty-free/

2. **Đặt file vào thư mục:**

   ```
   frontend/public/music/background.mp3
   ```

3. **Tạo thư mục nếu chưa có:**

   ```bash
   mkdir -p frontend/public/music
   ```

4. **Nhạc đề xuất:**
   - Bensound - Ukulele
   - Bensound - Sunny
   - Kevin MacLeod - Wallpaper

## Hoặc dùng URL trực tiếp:

Sửa file `MusicContext.jsx` dòng 12:

```javascript
audioRef.current = new Audio(
  "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
);
```

**Lưu ý:** URL trên chỉ để demo, nên tải về và host local.
