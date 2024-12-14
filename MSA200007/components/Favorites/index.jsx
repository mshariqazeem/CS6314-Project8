import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import './styles.css';

function Favorites({loggedUserId}) {
    const style = {
        width: '50%',         // Set the width of the modal to 50% of the screen
        height: '50%',       // Ensure the height is auto to maintain aspect ratio
        position: 'absolute', // Position it on the screen
        top: '50%',           // Vertically center the modal
        left: '50%',          // Horizontally center the modal
        transform: 'translate(-50%, -50%)', // Fine-tune centering of modal
        backgroundColor: 'white', // Set background to white or any color you prefer
        borderRadius: 2,      // Optional: Add some border radius for aesthetics
        padding: 2,           // Optional: Padding around the content
        overflow: 'hidden',   // Prevent overflow of content
        boxShadow: 24,        // Optional: Shadow for better visibility
    };
      
    const [photos, setPhotos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalImg, setModalImg] = useState({});
    useEffect(() => {
        axios.get(`/getFavorites/${loggedUserId}`).then((response) => {
            console.log(response.data);
            setPhotos(response.data);
        }).catch(error => {
            console.log(error);
        });
    }, []);
    
    const onImageClick = (photo) => {
        setOpenModal(true);
        setModalImg(photo);
    };

    const handleClose = () => {
        setOpenModal(false);
    };
    
    const removeFavorite = async (photo) => {
        const body = {
            photoId: photo._id,
            userId: loggedUserId
        };
        await axios.post("/removeFavorite", body).then(response => {
            setPhotos(response.data);
        }).catch(error => {
            console.log(error);
        });
    };
    return(
        <div>
            <div className="photo-row">
                {
                    photos.map((photo) => {
                        return (
                            <div key={photo._id} className="photo-item">
                                <button className="remove-btn" onClick={() => removeFavorite(photo)}> X </button>   
                                <button aria-label="Delete" className="photo-thumbnail2" onClick={() => {
                                    onImageClick(photo);
                                }}> 
                                    <img className="thumbnail-image" style={{height:"200px", width:"300px"}} src={`images/${photo.file_name}`} width="100%" /> 
                                </button>
                            </div>
                        );
                    })
                }
            </div>
            <Modal
             open={openModal}
             onClose={handleClose}
            >
                <Box sx={style}>
                    <img src={`images/${modalImg.file_name}`} style={{width: '100%', height: '80%', objectFit: 'contain'}} />
                    <p style={{fontSize:'large'}}>{new Date(modalImg.date_time).toLocaleString()}</p>
                </Box>
                
            </Modal>
        </div>
    );
}

export default Favorites;