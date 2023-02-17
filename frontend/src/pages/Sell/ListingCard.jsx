import React from "react";
import "./ListingCard.css";
import { UseEditItem } from "../../hooks/UseEditItem";

function ListingCard(props) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("TCG");
  const [price, setPrice] = React.useState("");
  const [image, setImage] = React.useState("");
  const { edit, isLoading, error } = UseEditItem();
  const imageInput = React.createRef();

  const handleSubmit = async (e) => {
    console.log(e); // log the event object to the console
    e.preventDefault();
    console.log(category);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("image", imageInput.current.files[0]);

    await edit({ form: formData, id: props.id });
    window.location.reload();
  };

  return (
    <>
      {!showEdit && (
        <div className="listingList">
          <div className="listingCard">
            <div className="listingImage-wrapper">
              <img
                src={props.image}
                alt="listing-img"
                className="listingImage"
              ></img>
            </div>

            <div className="listingCard__content">
              <div className="displayStack__1">
                <text className="listingName">{props.name}</text>
                <div className="listingPrice">${props.price}</div>
              </div>
              <text className="listingCategory">{props.category}</text>
              <text className="listingDate">{Date(props.createdAt)}</text>
              <div className="listing__edit">
                {!props.sold && (
                  <i
                    onClick={() => setShowEdit(true)}
                    className="bi bi-pencil-square edit__icon"
                  ></i>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {showEdit && (
          <div className="listingList">
            <div className="listingCard">
              <div className="listingImage-wrapper">
                {image ? (
                  <img
                    src={image}
                    alt="featured-img"
                    className="featuredImage"
                  />
                ) : (
                  <img
                    src={props.image}
                    alt="featured-img"
                    className="featuredImage"
                  />
                )}
              </div>

              <div className="listingCard__content">
                <div className="displayStack__1">
                  <input
                    type="text"
                    className="listingName"
                    placeholder={props.name}
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  ></input>
                  <input
                    type="number"
                    placeholder={`$ ${props.price}`}
                    onChange={(e) => setPrice(e.target.value)}
                    className="listingPrice"
                    value={price}
                  ></input>
                </div>
                <select
                  className="listingCategory__edit"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="TCG">Trading Card Game</option>
                  <option value="Comics">Comics</option>
                  <option value="Sports">Sports</option>
                  <option value="Figurines">Figurines</option>
                  <option value="Other">Other</option>
                </select>
                <text className="listingDate">{Date(props.createdAt)}</text>
                <div className="listing__submit">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    id="photo"
                    name="photo"
                    ref={imageInput}
                    onChange={(e) =>
                      setImage(URL.createObjectURL(e.target.files[0]))
                    }
                  />
                  <i
                    onClick={handleSubmit}
                    className="bi bi-file-earmark-check edit__icon"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default ListingCard;
