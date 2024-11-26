import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
    const [keyword, setKeyword] = useState(""); // Lưu giá trị tìm kiếm

    const handleChange = (e) => {
        setKeyword(e.target.value); // Cập nhật giá trị từ ô tìm kiếm
    };

    const handleSearch = () => {
        onSearch(keyword); // Chỉ gọi onSearch khi bấm nút Tìm kiếm
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Tìm kiếm..."
                value={keyword}
                onChange={handleChange} // Chỉ cập nhật giá trị tìm kiếm, không tìm kiếm ngay
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
                Tìm kiếm
            </button>
        </div>
    );
}

export default SearchBar;
