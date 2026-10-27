# Phân tích luồng vận hành TWLAN2

## 1. Game Tick (Luồng thời gian)
TWLAN2 không sử dụng cơ chế tick game truyền thống vòng lặp toàn cục liên tục. Thay vào đó:
- Dựa vào Event-Driven kết hợp với Lazy Evaluation (Tính toán trễ). Khi một hành động xảy ra (ví dụ browser request data từ `/api`), nó sẽ tính toán tài nguyên và trạng thái ngay tại thời điểm đó (dựa vào `now` và `fetchedAt`).
- Đối với NPC, có một luồng `NpcRhythm` giả lập thời gian người chơi thật với các trạng thái (Sleep, Offline, Login, Online). NPC chỉ hoạt động mạnh mẽ trong trạng thái `Online`. Điều này tối ưu rất lớn CPU so với tick mỗi giây.

## 2. Server-Sent Events (SSE Events)
Nằm trong package `se.oscarwiklund.twlan2.backend.live.LiveUpdates`:
- Không gửi toàn bộ dữ liệu qua SSE. SSE chỉ bắn tín hiệu thay đổi theo `topic` (VILLAGE, MAP, TRIBE, MAIL...).
- Frontend nhận topic và tự gọi API fetch lại cục bộ. Điều này giảm băng thông đáng kể và tái sử dụng DTO.
- Các event được gom lại (debounce) và flush định kỳ (FLUSH_MS = 250ms), giúp xử lý các đợt bùng nổ event (burst) như khi nhiều NPC đồng loạt hoạt động mà không nghẽn mạng.
- PING_MS (20s) giữ connection luôn sống qua các proxy.

## 3. AI Bot Logic (NPC)
Kiến trúc AI của NPC nằm trong `se.oscarwiklund.twlan2.backend.service.npc`:
- **NpcRhythm**: Quyết định lịch sinh hoạt. NPC có tính cách riêng, có đứa ngủ đêm, có đứa là "cú đêm" (night owl).
- **WorldView**: Một snapshot read-only của thế giới (chặn việc AI phải quét liên tục database). Tối ưu hóa quét bằng thuật toán lưới không gian (grid cell 10x10).
- **AttackPlanner**: Quyết định lượng quân đem đánh dựa trên intel (báo cáo do thám). Mang vừa đủ lính để thắng kèm một tỷ lệ phòng hờ (margin).
- **ConquestPlan**: Lên kế hoạch chiếm làng (Nobleman train) bằng cách chia đợt (waves) cho đến khi điểm trung thành của làng (loyalty) giảm dưới 0.

Kiến trúc này rất hoàn thiện, mô phỏng gần như 100% người thật.
