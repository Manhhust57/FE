import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Blog.css";

const API_URL = "https://anstay.com.vn";
const BLOG_API = `${API_URL}/api/blog/posts`; // API riêng cho user - chỉ lấy bài đã xuất bản
const FEATURED_TOUR_API = `${API_URL}/api/tours`; // Lấy tour từ API chính

// Danh mục blog theo demo
const BLOG_CATEGORIES = [
  { value: "all", label: "Tất cả" },
  { value: "blog-du-lich", label: "Blog du lịch" },
  { value: "tin-tuc-du-lich", label: "Tin tức du lịch" },
  { value: "dia-danh-du-lich", label: "Địa danh du lịch" },
  { value: "kinh-nghiem-du-lich", label: "Kinh nghiệm du lịch" },
  { value: "khach-san-resort", label: "Khách sạn, Resort" },
  { value: "am-thuc-vung-mien", label: "Ẩm thực vùng miền" },
];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredTour, setFeaturedTour] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const blogsPerPage = 5;

  useEffect(() => {
    console.log("Đang lấy danh sách bài viết cho user từ:", BLOG_API);
    axios
      .get(BLOG_API)
      .then((res) => {
        console.log("Nhận được", res.data.length, "bài viết từ API");
        setBlogs(res.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách bài viết:", error);
        setBlogs([]);
      });
  }, []);

  // Lấy tour nổi bật từ shared JSON hoặc API
  useEffect(() => {
    const loadFeaturedTour = async () => {
      try {
        // Thử lấy từ file shared JSON trong CÙNG DOMAIN (tránh bị trả về HTML từ index)
        const resp = await fetch(`/shared-tours.json?t=${Date.now()}`);
        if (resp.ok) {
          const text = await resp.text();
          try {
            const tours = JSON.parse(text);
            if (Array.isArray(tours) && tours.length > 0) {
            const activeTour = tours.find(tour => tour.status === "ACTIVE") || tours[0];
            if (activeTour) {
              setFeaturedTour({
                title: activeTour.name,
                location: activeTour.area === "HA_NOI" ? "Hà Nội" : 
                         activeTour.area === "HA_LONG" ? "Hạ Long" :
                         activeTour.area === "DA_NANG" ? "Đà Nẵng" :
                         activeTour.area === "HO_CHI_MINH" ? "TP.HCM" : "Khác",
                imageUrl: activeTour.images?.[0]?.imageUrl || "https://placehold.co/600x400?text=Tour+Image",
                currentPrice: activeTour.discountPercent > 0 ? 
                  activeTour.price * (100 - activeTour.discountPercent) / 100 : activeTour.price,
                originalPrice: activeTour.discountPercent > 0 ? activeTour.price : null,
                durationDays: activeTour.durationDays,
                transportation: activeTour.transportation || "Ôtô",
              });
              return;
            }
            }
          } catch {
            console.warn('shared-tours.json không phải JSON hợp lệ');
          }
        }
      } catch (error) {
        console.warn("Không thể lấy shared tours:", error);
      }

      // Fallback: thử localStorage (nếu cùng domain)
      try {
        const savedTours = localStorage.getItem('anstay_tours');
        if (savedTours) {
          const tours = JSON.parse(savedTours);
          const activeTour = tours.find(tour => tour.status === "ACTIVE") || tours[0];
          if (activeTour) {
            setFeaturedTour({
              title: activeTour.name,
              location: activeTour.area === "HA_NOI" ? "Hà Nội" : 
                       activeTour.area === "HA_LONG" ? "Hạ Long" :
                       activeTour.area === "DA_NANG" ? "Đà Nẵng" :
                       activeTour.area === "HO_CHI_MINH" ? "TP.HCM" : "Khác",
              imageUrl: activeTour.images?.[0]?.imageUrl || "https://placehold.co/600x400?text=Tour+Image",
              currentPrice: activeTour.discountPercent > 0 ? 
                activeTour.price * (100 - activeTour.discountPercent) / 100 : activeTour.price,
              originalPrice: activeTour.discountPercent > 0 ? activeTour.price : null,
              durationDays: activeTour.durationDays,
              transportation: activeTour.transportation || "Ôtô",
            });
            return;
          }
        }
      } catch (error) {
        console.warn("Lỗi localStorage:", error);
      }

      // Fallback: thử API
      try {
        const res = await axios.get(FEATURED_TOUR_API);
        const tours = Array.isArray(res.data) ? res.data : [];
        const activeTour = tours.find(tour => tour.status === "ACTIVE") || tours[0];
        if (activeTour) {
          setFeaturedTour({
            title: activeTour.name,
            location: activeTour.area === "HA_NOI" ? "Hà Nội" : 
                     activeTour.area === "HA_LONG" ? "Hạ Long" :
                     activeTour.area === "DA_NANG" ? "Đà Nẵng" :
                     activeTour.area === "HO_CHI_MINH" ? "TP.HCM" : "Khác",
            imageUrl: activeTour.images?.[0]?.imageUrl || "https://placehold.co/600x400?text=Tour+Image",
            currentPrice: activeTour.discountPercent > 0 ? 
              activeTour.price * (100 - activeTour.discountPercent) / 100 : activeTour.price,
            originalPrice: activeTour.discountPercent > 0 ? activeTour.price : null,
            durationDays: activeTour.durationDays,
            transportation: activeTour.transportation || "Ôtô",
          });
          return;
        }
      } catch (error) {
        console.warn("Lỗi API:", error);
      }

      // Không có tour nào - không hiển thị gì
      console.warn("Không có tour nào để hiển thị");
    };

    loadFeaturedTour();
  }, []);
  
  // Filter theo category
  const filteredBlogs = selectedCategory === "all" 
    ? blogs 
    : blogs.filter((b) => b.category === selectedCategory);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  // Xử lý ảnh (thêm domain nếu cần)
  const getFullImageUrl = (url) => {
    if (!url) return "https://placehold.co/400x250?text=No+Image";
    if (url.startsWith("data:")) return url; // Xử lý base64 data URL
    if (url.startsWith("http")) return url;
    return API_URL + url;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const ScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset về trang đầu khi đổi category
  };

  return (
    <div className="blog-page">
      <div className="blog-container">
        {/* Sidebar */}
        <div className="blog-sidebar">
          <div className="sidebar-section">
            <h3>Danh mục</h3>
            <ul className="category-list">
              {BLOG_CATEGORIES.map((cat) => (
                <li key={cat.value}>
                  <button
                    className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.value)}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3>Tour nổi bật</h3>
            <div className="featured-tour">
              <img
                src={featuredTour?.imageUrl || "https://placehold.co/300x200?text=Tour+Image"}
                alt="Tour nổi bật"
                className="featured-tour-image"
              />
              <div className="featured-tour-content">
                <span className="tour-location">{featuredTour?.location || ""}</span>
                <h4 className="tour-title">{featuredTour?.title || ""}</h4>
                <div className="tour-price">
                  {featuredTour?.currentPrice != null && (
                    <span className="current-price">
                      {Number(featuredTour.currentPrice).toLocaleString("vi-VN")}₫
                    </span>
                  )}
                  {featuredTour?.originalPrice != null && (
                    <span className="original-price">
                      {Number(featuredTour.originalPrice).toLocaleString("vi-VN")}
                    </span>
                  )}
                </div>
                <div className="tour-details">
                  {featuredTour?.durationDays && (
                    <span>
                      Thời gian {featuredTour.durationDays} ngày {Math.max(0, featuredTour.durationDays - 1)} đêm
                    </span>
                  )}
                  {featuredTour?.transportation && (
                    <span>Phương tiện {featuredTour.transportation}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="blog-main">
          <h1 className="blog-main-title">Blog du lịch</h1>
          <div className="blog-list">
            {currentBlogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <img
                  src={getFullImageUrl(blog.thumbnail)}
                  alt={blog.title}
                  className="blog-image"
                />
                <div className="blog-content">
                  <h2 className="blog-title">{blog.title}</h2>
                  <div className="blog-meta">
                    <span>
                      <i className="bi bi-calendar3"></i>{" "}
                      {blog.createdAt
                        ? blog.createdAt
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("-")
                        : ""}
                    </span>
                    <span>
                      <i className="bi bi-eye"></i> {blog.views || 0}
                    </span>
                  </div>
                  <p className="blog-description">
                    {blog.summary && blog.summary.trim() !== ""
                      ? blog.summary
                      : blog.content
                      ? blog.content.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
                      : ""}
                  </p>
                  <Link to={`/blog/${blog.id}`}>
                    <button className="blog-button">Xem thêm</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBlogs.length === 0 && (
            <div className="no-blogs">
              <p>Không có bài viết nào trong danh mục này.</p>
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    paginate(index + 1);
                    ScrollToTop();
                  }}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
