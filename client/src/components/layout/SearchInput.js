import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchInput() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        navigate(
            `/search/searchResult?search=${encodeURIComponent(searchText)}`
        );
        setSearchText("");
    };

    const handleChange = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div className="search-row">
            <div className="search-form">
                <div className="search-form__inner">
                    <div className="search-form__box">
                        <div className="search-form__input">
                            <input
                                type="text"
                                placeholder="검색어를 입력해 주세요."
                                value={searchText}
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="btn btn-search"
                                onClick={onSubmit}
                            >
                                검색
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchInput;
