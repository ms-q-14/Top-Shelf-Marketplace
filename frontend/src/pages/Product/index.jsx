import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FeaturedCard from "../Home/FeaturedCard";
import IndividualProduct from "../IndividualProduct";
import "./index.css";
import Pagination from "./Pagination";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { getExpressBaseURI } from "../../utils/constants";
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Product() {
  const { search } = useLocation();
  let query = useQuery();
  const [data, setData] = React.useState([]);
  const [category, setCategory] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(null);
  const [lastPage, setLastPage] = React.useState();
  const [postsPerPage, setPostsPerPage] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState(null);

  useEffect(() => {
    console.log("search ran");
    const page = query.get("page");
    if (page === null) {
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
    const category = query.get("category");
    if (category === null) {
      setCategory("all");
    } else {
      setCategory(category);
    }
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (category === null || currentPage === null) {
    } else {
      switch (category) {
        case "all":
          setCategoryName("All Products");
          break;
        case "TCG":
          setCategoryName("Trading Card Games");
          break;
        case "Comics":
          setCategoryName("Comics");
          break;
        case "Figurines":
          setCategoryName("Figurines");
          break;
        case "Sports":
          setCategoryName("Sports Memorabilia");
          break;
        default:
          setCategoryName("All Products");
      }
      setLoading(true);
      fetch(
        `${getExpressBaseURI()}/api/product?category=${category}&page=${currentPage}&limit=${postsPerPage}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data.products);
          setLastPage(data.lastPage);
          console.log(currentPage);
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [category, currentPage]);

  const categoryCards = data?.map((product) => {
    return (
      <Link
        className="link"
        to={`/product/${product._id}`}
        state={{ id: product._id }}
      >
        <div className="category__card">
          <FeaturedCard
            id={product._id}
            key={product._id}
            name={product.title}
            price={product.price}
            image={product.image}
            category={product.category}
          />
        </div>
      </Link>
    );
  });

  return (
    <>
      {!loading && (
        <>
          <div className="products__container">
            <div className="category__header">
              <h1 className="category__title">{categoryName}</h1>
              <p></p>
            </div>
            <div className="category__cards">{categoryCards}</div>

            <Pagination
              lastPage={lastPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              category={category}
            />
          </div>
        </>
      )}
      {loading && <Loader className="product_loader" />}
    </>
  );
}

export default Product;
