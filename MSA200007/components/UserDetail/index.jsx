import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import axios from "axios";

import "./styles.css";

function UserDetail({ userId }) {
  const [user, setUser] = useState(null); // stores the details of the user fetched by `userId`
  const [photoPreview, setPhotoPreview] = useState(null); // stores preview of photos
  const navigate = useNavigate();

  // `useEffect` fetches the user data whenever `userId` changes
  useEffect(() => {
    axios.get(`/user/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });

    // Fetch photo preview whenever `userId` changes
    axios
      .get(`/user/photos-preview/${userId}`)
      .then((response) => {
        setPhotoPreview(response.data);
      })
      .catch((error) => {
        console.error("Error fetching photo preview:", error);
        // If no photos are available, set photoPreview to null
        setPhotoPreview(null);
      });
  }, [userId]); // Dependency array includes `userId` to re-fetch data if it changes

  // If `user` data is not yet loaded, display a loading message
  if (!user) return <Typography>Loading...</Typography>;

  return (
    <div className="user-detail-container">
      {/* Display user's full name in a header */}
      <Typography variant="h6" className="user-detail-name">{`${user.first_name} ${user.last_name}`}</Typography>
      
      {/* Display additional user details */}
      <Typography variant="body1" className="user-detail-info">{`Location: ${user.location}`}</Typography>
      <Typography variant="body1" className="user-detail-info">{`Description: ${user.description}`}</Typography>
      <Typography variant="body1" className="user-detail-info">{`Occupation: ${user.occupation}`}</Typography>
      
      {/* Link to navigate to the user's photos */}
      <Link to={`/photos/${userId}`} className="user-detail-link">View Photos</Link>

      {/* Photo Preview Section */}
      {photoPreview ? (
        <div className="photo-preview">
          <div className="photo-card">
            <Typography variant="subtitle1">Most Recent Photo</Typography>
            <img
              src={`images/${photoPreview.mostRecent.file_name}`}
              alt="Most Recent"
              className="photo-thumbnail"
              onClick={() => navigate(`/photos/${userId}`)}
            /><br />
            <Typography variant="caption">
              Uploaded on: {new Date(photoPreview.mostRecent.date_time).toLocaleString()}
            </Typography>
          </div>

          <div className="photo-card">
            <Typography variant="subtitle1">Photo with Most Comments</Typography>
            <img
              src={`images/${photoPreview.mostCommented.file_name}`}
              alt="Most Commented"
              className="photo-thumbnail"
              onClick={() => navigate(`/photos/${userId}`)}
            /><br />
            <Typography variant="caption">
              Comments Count: {photoPreview.mostCommented.commentsCount}
            </Typography>
          </div>
        </div>
      ) : (
        <Typography variant="body1" className="no-photo-message">
          This user has not uploaded any photos yet.
        </Typography>
      )}
    </div>
  );
}

export default UserDetail;