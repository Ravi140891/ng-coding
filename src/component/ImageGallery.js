import React, { useState, useEffect } from "react";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(9);

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const handleSortChange = (sortByOption) => {
    setSortBy(sortByOption);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchImages = () => {
      // generate random images with size and date
      const images = [];
      for (let i = 1; i <= 100; i++) {
        const imageSize = Math.floor(Math.random() * 10000) + 1000; // random size between 1KB to 10MB
        const date = new Date(
          Date.now() - Math.floor(Math.random() * 10000000000)
        ).toISOString(); // random date within the last 10000 days
        images.push({
          id: i,
          download_url: `https://picsum.photos/500/500?random=${i}`,
          author: `Author ${i}`,
          uploaded_at: date,
          size: imageSize,
        });
      }
      setImages(images);
    };
    fetchImages();
  }, []);

  const filteredImages = images.filter((image) => {
    const term = searchTerm.toLowerCase();
    const name = image.author.toLowerCase();
    const date = new Date(image.uploaded_at).toLocaleDateString().toLowerCase();
    const size = image.size.toString().toLowerCase();

    return name.includes(term) || date.includes(term) || size.includes(term);
  });

  const sortedImages = filteredImages.sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.uploaded_at) - new Date(b.uploaded_at);
    } else if (sortBy === "size") {
      return a.size - b.size;
    } else {
      return 0;
    }
  });

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = sortedImages.slice(indexOfFirstImage, indexOfLastImage);

  const renderImages = () => {
    if (view === "list") {
      return currentImages.map((image) => (
        <div key={image.id} className="list-item">
          <img src={image.download_url} alt={image.author} />
          <div className="details">
            <h3>{image.author}</h3>
            <p>
              Date Uploaded: {new Date(image.uploaded_at).toLocaleDateString()}
            </p>
            <p>File Size: {image.size / 1024} KB</p>
          </div>
        </div>
      ));
    } else {
      return (
        <div className="grid-container">
          {currentImages.map((image) => (
            <div key={image.id} className="grid-item">
              <img src={image.download_url} alt={image.author} />
            </div>
          ))}
        </div>
      );
    }
  };
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(sortedImages.length / imagesPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              className={`btn page-link${
                currentPage === number ? " active" : ""
              }`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="image-list">
      <div className="header">
        <h1>Image Gallery</h1>
        <div className="options">
          <div className="sort-by">
            <label htmlFor="view-select">View:</label>
            <select
              id="view-select"
              value={view}
              onChange={(e) => handleViewChange(e.target.value)}
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>

            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">None</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
            </select>
          </div>

          <div className="search">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="image-container">{renderImages()}</div>

      <div className="pagination-container">{renderPagination()}</div>
    </div>
  );
};

export default ImageGallery;
