import React, { useState, useEffect } from "react";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [viewType, setViewType] = useState("list");
  const [sortedImages, setSortedImages] = useState([]);
  const [sortBy, setSortBy] = useState("dateUploaded");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 9;

  const fetchImage = async () => {
    try {
      const response = await fetch("https://picsum.photos/v2/list");
      // console.log(data);
      const data = await response.json();
      const formattedData = data.map((image) => ({
        id: image.id,
        url: image.download_url,
        name: `Image ${image.id}`,
        dateUploaded: new Date().toLocaleString(),
        fileSize: `${Math.floor(Math.random() * 1000)} KB`,
      }));
      setImages(formattedData);
      setSortedImages(formattedData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchImage();
  }, []);

  const handleViewToggle = () => {
    setViewType(viewType === "list" ? "grid" : "list");
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (e, pageNumber) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    let sortedData = [...images];
    console.log(sortedData);
    if (sortBy === "dateUploaded") {
      sortedData.sort(
        (a, b) => new Date(b.dateUploaded) - new Date(a.dateUploaded)
      );
    } else if (sortBy === "fileSize") {
      sortedData.sort((a, b) => b.fileSize - a.fileSize);
    }
    setSortedImages(sortedData);
  }, [sortBy, images]);

  const filteredImages = sortedImages.filter((image) =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(
    indexOfFirstImage,
    indexOfLastImage
  );
  return (
    <div className="image-gallery">
      <div className="view-toggle">
        <button
          className={`list-view ${viewType === "list" ? "active" : ""}`}
          onclick={handleViewToggle}
        >
          List View
        </button>
        <button
          className={`grid-view ${viewType === "grid" ? "active" : ""}`}
          onClick={handleViewToggle}
        >
          Grid View
        </button>
      </div>
      <div className="sort-by">
        <label htmlFor="sort-by-select">Sort By:</label>
        <select id="sort-by-select" value={sortBy} onChange={handleSortBy}>
          <option value="dateUploaded">Date Uploaded</option>
          <option value="fileSize">File Size</option>
        </select>
      </div>
      <div className="search">
        <label htmlFor="search-input">Search</label>
        <input
          type="text"
          id="search-input"
          value={searchTerm}
          onChange={handleSearchTerm}
        />
      </div>
      <div className={`image-list ${viewType === "grid" ? "grid-view" : ""}`}>
        <div className="images">
          {currentImages.map((image) => (
            <div className="image" key={image.id}>
              <img src={image.url} alt={image.name} />
              <div className="image-details">
                <div className="image-name">{image.name}</div>
                <div className="image-date">{image.dateUploaded}</div>
                <div className="image-size">{image.fileSize}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {filteredImages.length > imagesPerPage && (
            <ul>
              {Array(Math.ceil(filteredImages.length / imagesPerPage))
                .fill()
                .map((item, i) => (
                  <li key={i}>
                    <button
                      className={currentPage === i + 1 ? "active" : ""}
                      onClick={(e) => handlePageChange(e, i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
