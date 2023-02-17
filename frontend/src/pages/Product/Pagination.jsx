import React from "react";
import { Link } from "react-router-dom";
import "./Pagination.css";

const Pagination = ({ lastPage, setCurrentPage, currentPage, category }) => {
  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  let start = Math.max(1, parseInt(currentPage, 10) - 1);
  let end = Math.min(lastPage, parseInt(currentPage, 10) + 1);

  return (
    <div className="pagination__container">
      <Link
        className="link"
        to={`/product?category=${category}&page=${Number(currentPage) - 1}`}
      >
        <button disabled={Number(currentPage) === 1}>Prev</button>
      </Link>

      {currentPage > 2 && (
        <>
          <Link className="link" to={`/product?category=${category}&page=1`}>
            <button>1</button>
          </Link>
          <span>...</span>
        </>
      )}

      {pages.slice(start - 1, end).map((page, index) => {
        return (
          <Link
            className="link"
            to={`/product?category=${category}&page=${page}`}
          >
            <button
              key={index}
              className={page === parseInt(currentPage, 10) ? "active" : ""}
            >
              {page}
            </button>
          </Link>
        );
      })}

      {currentPage < lastPage - 1 && (
        <>
          <span>...</span>
          <Link
            className="link"
            to={`/product?category=${category}&page=${lastPage}`}
          >
            <button>{lastPage}</button>
          </Link>
        </>
      )}

      <Link
        className="link"
        to={`/product?category=${category}&page=${Number(currentPage) + 1}`}
      >
        <button disabled={Number(currentPage) === lastPage}>Next</button>
      </Link>
    </div>
  );
};

export default Pagination;
