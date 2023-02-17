import React from "react";
import { useEffect } from "react";
import "./SellPopup.css";
import { UseSellItem } from "../../hooks/UseSellItem";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
function SellPopup() {
  const [showCms, setShowCms] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("TCG");
  const [price, setPrice] = React.useState(0);
  const [image, setImage] = React.useState("");
  const { sell, isLoading, error } = UseSellItem();
  const imageInput = React.createRef();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   await sell({ title, category, price, image });

  // };

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSellSubmit = async (e) => {
    console.log(e); // log the event object to the console
    e.preventDefault();
    console.log(category);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("image", imageInput.current.files[0]);
    try {
      await sell(formData);
      setShowCms(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTitle(""), setCategory("TCG"), setImage(""), setPrice(0);
  }, [showCms]);

  return (
    <>
      {" "}
      {isLoading && <Loader className="loader__container" />}
      {showCms && !isLoading && (
        <div className="popup__container">
          <div className="close__button">
            <i onClick={() => setShowCms(false)} class="bi bi-x-square"></i>
          </div>
          <form className="form__container" onSubmit={handleSellSubmit}>
            <label className="sell__headers">Product Name:</label>
            <input
              className="sell__input"
              placeholder="Enter your product name...."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />

            <label className="sell__headers">
              Choose the listing category:
            </label>
            <select
              className="sell__categories"
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="TCG">Trading Card Game</option>
              <option value="Comics">Comics</option>
              <option value="Sports">Sports</option>
              <option value="Figurines">Figurines</option>
              <option value="Other">Other</option>
            </select>

            <label className="sell__headers">Price:</label>
            <input
              className="sell__input"
              type="number"
              placeholder="Enter price in CAD"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
            <label for="photo" className="sell__headers">
              Upload an image of the item:
            </label>
            <input
              onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
              ref={imageInput}
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              id="photo"
              name="photo"
              required
            />
            <button className="list__item__button" type="submit">
              List Item
            </button>
          </form>

          <div className="featuredList__preview">
            <div className="featuredCard__preview">
              <div className="featuredImage-wrapper__preview">
                {image ? (
                  <img
                    src={image}
                    alt="featured-img"
                    className="featuredImage"
                  />
                ) : (
                  <img
                    src="/images/tab-log.png"
                    alt="featured-img"
                    className="featuredImage"
                  />
                )}
              </div>

              <div className="featuredCard__content__preview">
                <h3 className="featuredName__preview">{title}</h3>
                <div className="displayStack__1__preview">
                  <div className="featuredPrice__preview">${price}</div>
                </div>
              </div>
            </div>
          </div>
          <img className="mini__logo" src="/images/tab-log.png" />
        </div>
      )}
      {!isLoading && (
        <div className="sell__button__container">
          <button className="sell__button" onClick={() => setShowCms(true)}>
            List an item
          </button>
        </div>
      )}
    </>
  );
}

export default SellPopup;
