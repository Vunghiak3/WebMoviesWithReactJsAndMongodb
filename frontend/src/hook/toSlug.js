export function toSlug(name) {
  return name
    .normalize("NFD") // Chuyển chuỗi về dạng chuẩn hóa tổ hợp ký tự
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d") // Chuyển đổi 'đ' thành 'd'
    .replace(/Đ/g, "D") // Chuyển đổi 'Đ' thành 'D'
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Loại bỏ các ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .trim() // Loại bỏ khoảng trắng đầu/cuối chuỗi
    .toLowerCase(); // Chuyển tất cả về chữ thường
}
