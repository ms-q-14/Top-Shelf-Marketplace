import React from "react";
import topshelfLogo from "../../assets/topshelfLogo.png";
import "./ProfilePicture.css";
import AvatarEditor from "react-avatar-editor";
import { useAuthContext } from "../../hooks/useAuthContext";
import Loader from "../../components/Loader";
import { getExpressBaseURI } from "../../utils/constants";
function ProfilePicture() {
  const { dispatch, state } = useAuthContext();
  const [profilePicture, setProfilePicture] = React.useState();
  const [file, setFile] = React.useState(null);
  const [profilePopup, setProfilePopup] = React.useState(false);
  const [scale, setScale] = React.useState(1.0);
  const [loading, setLoading] = React.useState(false);

  //Resets the popup contents to baseline
  // React.useEffect(() => {
  //   setProfilePicture(state.user?.avatar), setScale(1.0);
  // }, [profilePopup]);
  React.useEffect(() => {
    if (state.user?.avatar) {
      setProfilePicture(state.user?.avatar + "?" + new Date().getTime());
    } else {
      setProfilePicture(topshelfLogo);
    }
  }, [state.user?.avatar]);

  //Handles the submit action and saves profile pic on DB

  React.useEffect(() => {}, []);
  const handleProfilePicSave = async (e) => {
    e.preventDefault();

    let user = JSON.parse(localStorage.getItem("user")).user;
    let fileName = `${user.id}.${file.type.split("/")[1]}`;

    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("file", file);
    setLoading(true);
    const response = await fetch(`${getExpressBaseURI()}/api/user/avatar`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        user.avatar = data.avatar;
        localStorage.setItem("user", JSON.stringify({ user }));
        dispatch({
          type: "AVATAR_UPLOAD",
          payload: { avatar: data.avatar },
        });
        URL.revokeObjectURL(
          `https://topshelf-sahil.s3.us-east-2.amazonaws.com/${fileName}`
        );
        window.location.reload();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <>
          <div className="profile__page__container">
            <img className="profile__page__img" src={profilePicture} />
          </div>
          <div className="profile__edit" onClick={() => setProfilePopup(true)}>
            <button type="button">Edit Profile Picture</button>
          </div>
        </>
      )}
      {!loading && profilePopup && (
        <div className="profile__popup">
          <form action="/submit" onSubmit={handleProfilePicSave}>
            <label for="photo" className="sell__headers">
              Upload an image of the item:
            </label>
            <input
              onChange={(e) => {
                setProfilePicture(URL.createObjectURL(e.target.files[0]));
                console.log(e);
                setFile(e.target.files[0]);
                console.log(e.target.files[0]);
              }}
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              id="photo"
              name="photo"
            />
            <AvatarEditor
              image={profilePicture}
              width={200}
              height={200}
              borderRadius={100}
              color={[128, 128, 128, 0.6]} // RGBA
              scale={scale}
              rotate={0}
            />
            <div>
              <label htmlFor="zoom">Zoom:</label>
              <input
                type="range"
                min={1}
                max={2}
                step={0.01}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              />
              {scale.toFixed(2)}
            </div>
          </form>
          <button type="submit" onClick={handleProfilePicSave}>
            Save Image
          </button>
        </div>
      )}
    </>
  );
}

export default ProfilePicture;
