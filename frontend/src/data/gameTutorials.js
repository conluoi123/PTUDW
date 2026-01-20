// Tutorials Data
export const GAME_TUTORIALS = {
    caro5: {
        title: "Hướng Dẫn Chơi Caro 5",
        steps: [
            {
                title: "Mục Tiêu Trò Chơi",
                content: "Nhiệm vụ của bạn là trở thành người đầu tiên tạo được một hàng liên tiếp gồm 5 quân cờ (X) theo chiều ngang, dọc hoặc chéo.",
                highlight: "board"
            },
            {
                title: "Lựa Chọn Độ Khó",
                content: "Trước khi bắt đầu, hãy chọn cấp độ AI phù hợp với bạn: Dễ, Trung Bình hoặc Khó (sử dụng thuật toán Minimax thông minh).",
                highlight: "difficulty_selector"
            },
            {
                title: "Cách Điều Khiển",
                content: "Bạn có thể dùng CHUỘT hoặc các PHÍM MŨI TÊN để di chuyển ô chọn màu xanh. Nhấn nút Tròn Lớn (hoặc phím Enter) để đánh dấu X.",
                highlight: "controls"
            },
            {
                title: "Thông Tin Trận Đấu",
                content: "Hãy chú ý đến đồng hồ đếm ngược và lượt đi hiện tại ở đây. Nếu hết giờ, bạn sẽ bị xử thua!",
                highlight: "info_panel"
            },
            {
                title: "Chiến Thuật Thắng",
                content: "Hãy quan sát kỹ để chặn ngay khi đối thủ (O) sắp có 4 quân thẳng hàng. Đồng thời, cố gắng tạo ra các thế cờ đôi (2 đường thắng cùng lúc) để đối thủ không đỡ kịp.",
                highlight: "board"
            }
        ]
    },
    caro4: {
        title: "Hướng Dẫn Chơi Caro 4",
        steps: [
            {
                title: "Mục Tiêu",
                content: "Tương tự Caro 5, nhưng bạn chỉ cần nối liền 4 quân cờ đễ chiến thắng. Bàn cờ nhỏ hơn (10x10) nên nhịp độ trận đấu sẽ rất nhanh.",
                highlight: "board"
            },
            {
                title: "Độ Khó",
                content: "Đừng quên chọn độ khó trước khi chơi. AI cấp độ Khó sẽ tính toán rất kỹ các nước đi chặn đường của bạn.",
                highlight: "difficulty_selector"
            },
            {
                title: "Lưu Ý Quan Trọng",
                content: "Vì chỉ cần 4 quân là thắng, nên ngay khi thấy đối thủ có 3 quân thẳng hàng không bị chặn, bạn PHẢI chặn ngay lập tức!",
                highlight: "board"
            }
        ]
    },
    tictactoe: {
        title: "Cờ Caro 3x3 (Tic Tac Toe)",
        steps: [
            {
                title: "Luật Chơi Cổ Điển",
                content: "Đây là phiên bản kinh điển trên bàn cờ 3x3. Bạn cần tạo 3 quân thẳng hàng để thắng.",
                highlight: "board"
            },
            {
                title: "Chiến Thuật",
                content: "Chiếm ô trung tâm là chìa khóa quan trọng nhất. Nếu đi sau, hãy cố gắng phòng thủ để hòa cờ.",
                highlight: "board"
            }
        ]
    },
    snake: {
        title: "Rắn Săn Mồi (Snake)",
        steps: [
            {
                title: "Nhiệm Vụ",
                content: "Điều khiển chú rắn ăn các điểm thức ăn màu đỏ xuất hiện ngẫu nhiên. Mỗi lần ăn, rắn sẽ dài ra và điểm số sẽ tăng.",
                highlight: "board"
            },
            {
                title: "Điều Khiển Rắn",
                content: "Sử dụng cụm phím Mũi Tên điều hướng trên màn hình hoặc bàn phím để rẽ trái, phải, lên, xuống.",
                highlight: "controls"
            },
            {
                title: "Luật Sinh Tồn",
                content: "Cẩn thận! Trò chơi kết thúc ngay lập tức nếu đầu rắn đâm vào tường bao quanh hoặc tự cắn vào đuôi của mình.",
                highlight: "board"
            }
        ]
    },
    match3: {
        title: "Xếp Hình (Match 3)",
        steps: [
            {
                title: "Cách Chơi",
                content: "Chọn một viên đá quý và đổi chỗ với viên bên cạnh để tạo thành hàng ngang hoặc dọc có từ 3 viên cùng màu trở lên.",
                highlight: "board"
            },
            {
                title: "Combo Điểm",
                content: "Khi 3 viên cùng màu được xếp thẳng hàng, chúng sẽ biến mất và các viên mới sẽ rơi xuống. Hãy tính toán để tạo ra các chuỗi Combo liên tiếp!",
                highlight: "board"
            }
        ]
    },
    memory: {
        title: "Lật Hình Ghi Nhớ",
        steps: [
            {
                title: "Nhiệm Vụ",
                content: "Tìm ra tất cả các cặp hình giống nhau đang bị ẩn giấu dưới các ô vuông.",
                highlight: "board"
            },
            {
                title: "Quy Tắc Lật",
                content: "Mỗi lượt bạn được lật 2 ô. Nếu hình giống nhau, chúng sẽ giữ nguyên. Nếu sai, chúng sẽ úp lại sau 1 giây.",
                highlight: "board"
            },
            {
                title: "Bí Kíp",
                content: "Hãy tập trung ghi nhớ vị trí của các hình đã lật sai trước đó. Trí nhớ tốt là chìa khóa chiến thắng!",
                highlight: "board"
            }
        ]
    },
    draw: {
        title: "Vẽ Pixel Art",
        steps: [
            {
                title: "Sáng Tạo",
                content: "Đây là không gian để bạn thư giãn. Di chuyển con trỏ và nhấn Enter để tô màu một ô pixel.",
                highlight: "board"
            },
            {
                title: "Bảng Màu",
                content: "Sử dụng bảng màu bên phải để chọn các màu sắc khác nhau cho bức tranh của bạn.",
                highlight: "palette"
            },
            {
                title: "Xóa & Sửa",
                content: "Để xóa một ô đã tô, hãy chọn màu nền (hoặc nhấn lại vào ô đó). Hãy thỏa sức sáng tạo nghệ thuật Pixel!",
                highlight: "board"
            }
        ]
    }
};
