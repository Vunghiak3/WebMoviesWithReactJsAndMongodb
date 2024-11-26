import { useEffect, useState } from "react";

// Hàm debounce (nếu chưa có)
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler); // Xóa timeout khi value hoặc delay thay đổi
        };
    }, [value, delay]);

    return debouncedValue;
}

export function Search() {
    const [searchValue, setSearchValue] = useState(""); // Giá trị nhập vào
    const [searchResult, setSearchResult] = useState([]); // Kết quả tìm kiếm
    const [showResult, setShowResult] = useState(false); // Hiển thị kết quả
    const debouncedValue = useDebounce(searchValue, 500); // Giá trị debounce

    useEffect(() => {
        // Nếu giá trị debounce trống, reset kết quả
        if (debouncedValue.trim() === "") {
            setSearchResult([]);
            setShowResult(false);
            return;
        }

        // Gọi API tìm kiếm
        const fetchApi = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/movies?search=${debouncedValue.trim()}`
                );
                const result = await response.json();
                setSearchResult(result);
                setShowResult(true);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchApi();
    }, [debouncedValue]);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchValue(value); // Cập nhật giá trị nhập vào
    };

    return (
        <div>
            <div className={"wrapper-search"}>
                <div className={"search"}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchValue}
                        onChange={handleChange}
                    />
                    <a className={"btn-search"} href={`/tim-kiem/${searchValue}`}>
                        Tìm kiếm
                    </a>
                </div>
            </div>

            {/* Hiển thị kết quả tìm kiếm */}
            {showResult && (
                <div className="search-results">
                    {searchResult.length > 0 ? (
                        searchResult.map((item) => (
                            <div key={item.id} className="search-item">
                                <a href={`/phim/${item.id}`}>
                                    {item.title}
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>Không tìm thấy kết quả.</p>
                    )}
                </div>
            )}
        </div>
    );
}
