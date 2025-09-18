// Booking.tsx
import React, { useState, useEffect } from 'react';
import './Blog.css';

interface Room {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  amenities: string[];
  maxGuests: number;
  size: string;
  bedType: string;
  available: boolean;
}

interface BookingForm {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  rooms: number;
  roomType: string;
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface SearchFilters {
  priceRange: [number, number];
  amenities: string[];
  maxGuests: number;
  sortBy: 'price' | 'name' | 'size';
}

interface BookingProps {
  className?: string;
}

const Booking: React.FC<BookingProps> = ({ className }) => {
  const [formData, setFormData] = useState<BookingForm>({
    checkInDate: '',
    checkOutDate: '',
    adults: 2,
    children: 0,
    rooms: 1,
    roomType: '',
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState<Partial<BookingForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [totalNights, setTotalNights] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    priceRange: [0, 5000000],
    amenities: [],
    maxGuests: 10,
    sortBy: 'price'
  });
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sample room data
  const allRooms: Room[] = [
    {
      id: 'standard-001',
      name: 'Standard Room - Ocean View',
      price: 1500000,
      description: 'Phòng tiêu chuẩn với view biển tuyệt đẹp, đầy đủ tiện nghi cơ bản.',
      image: 'https://th.bing.com/th/id/OIP.ctNJLHgPH15npRh46fpr4AHaE8?w=163&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      amenities: ['Wi-Fi', 'TV', 'Máy lạnh', 'Mini bar', 'View biển'],
      maxGuests: 2,
      size: '25m²',
      bedType: 'Giường đôi',
      available: true
    },
    {
      id: 'standard-002',
      name: 'Standard Room - City View',
      price: 1200000,
      description: 'Phòng tiêu chuẩn với view thành phố, thoải mái và tiện nghi.',
      image: 'https://th.bing.com/th/id/OIP.nItZoYKuddGm1Gc5pQq4ZQHaFc?w=240&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
      amenities: ['Wi-Fi', 'TV', 'Máy lạnh', 'Mini bar'],
      maxGuests: 2,
      size: '22m²',
      bedType: 'Giường đôi',
      available: true
    },
    {
      id: 'deluxe-001',
      name: 'Deluxe Room - Ocean Front',
      price: 2200000,
      description: 'Phòng cao cấp với view biển trực diện, ban công riêng và tiện nghi hiện đại.',
      image: 'https://th.bing.com/th/id/OIP.ctRX3zdAZb8-cZzW_E-TywHaE8?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
      amenities: ['Wi-Fi', 'TV 4K', 'Máy lạnh', 'Mini bar', 'Ban công', 'View biển', 'Máy pha cà phê'],
      maxGuests: 3,
      size: '35m²',
      bedType: 'Giường king',
      available: true
    },
    {
      id: 'deluxe-002',
      name: 'Deluxe Room - Garden View',
      price: 1900000,
      description: 'Phòng cao cấp với view vườn xanh mát, không gian rộng rãi.',
      image: 'https://th.bing.com/th/id/OIP.fYSXnDaOB6Or-kFTJDNl3gHaE8?w=245&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      amenities: ['Wi-Fi', 'TV', 'Máy lạnh', 'Mini bar', 'Ban công', 'Máy pha cà phê'],
      maxGuests: 3,
      size: '30m²',
      bedType: 'Giường king',
      available: true
    },
    {
      id: 'suite-001',
      name: 'Executive Suite - Premium Ocean',
      price: 3500000,
      description: 'Suite sang trọng với không gian rộng lớn, view biển 180 độ và tiện nghi 5 sao.',
      image: '/images/suite-executive.jpg',
      amenities: ['Wi-Fi', 'TV 4K', 'Máy lạnh', 'Mini bar', 'Ban công lớn', 'View biển', 'Máy pha cà phê', 'Bồn tắm jacuzzi', 'Phòng khách riêng'],
      maxGuests: 4,
      size: '65m²',
      bedType: 'Giường king + Sofa bed',
      available: true
    },
    {
      id: 'suite-002',
      name: 'Honeymoon Suite',
      price: 4200000,
      description: 'Suite dành cho tuần trăng mật với thiết kế lãng mạn và tiện nghi cao cấp.',
      image: '/images/suite-honeymoon.jpg',
      amenities: ['Wi-Fi', 'TV 4K', 'Máy lạnh', 'Mini bar', 'Ban công lớn', 'View biển', 'Máy pha cà phê', 'Bồn tắm jacuzzi', 'Trang trí lãng mạn', 'Champagne welcome'],
      maxGuests: 2,
      size: '55m²',
      bedType: 'Giường king',
      available: false
    },
    {
      id: 'family-001',
      name: 'Family Room - Connecting Rooms',
      price: 2800000,
      description: 'Phòng gia đình với 2 phòng liền kề, phù hợp cho gia đình có trẻ nhỏ.',
      image: '/images/family-connecting.jpg',
      amenities: ['Wi-Fi', 'TV', 'Máy lạnh', 'Mini bar', 'Tủ lạnh', 'Khu vực chơi trẻ em'],
      maxGuests: 6,
      size: '45m²',
      bedType: '2 giường đôi',
      available: true
    },
    {
      id: 'family-002',
      name: 'Family Suite - Ocean View',
      price: 3200000,
      description: 'Suite gia đình rộng rãi với view biển, phòng khách và phòng ngủ riêng biệt.',
      image: '/images/family-suite.jpg',
      amenities: ['Wi-Fi', 'TV 4K', 'Máy lạnh', 'Mini bar', 'Tủ lạnh', 'Phòng khách', 'Ban công', 'View biển'],
      maxGuests: 5,
      size: '60m²',
      bedType: 'Giường king + 2 giường đơn',
      available: true
    }
  ];

  // Room types with base prices (for form selection)
  const roomTypes = [
    { id: 'standard', name: 'Phòng Standard', price: 1350000, description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi' },
    { id: 'deluxe', name: 'Phòng Deluxe', price: 2050000, description: 'Phòng cao cấp với view đẹp' },
    { id: 'suite', name: 'Suite', price: 3850000, description: 'Phòng suite sang trọng với ban công' },
    { id: 'family', name: 'Phòng Family', price: 3000000, description: 'Phòng rộng dành cho gia đình' }
  ];

  // Search for available rooms
  const searchRooms = async () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter rooms based on dates and availability
      const available = allRooms.filter(room => {
        const totalGuests = formData.adults + formData.children;
        return room.available && room.maxGuests >= totalGuests;
      });
      
      setAvailableRooms(available);
      applyFilters(available);
      
    } catch (error) {
      console.error('Error searching rooms:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Apply search filters
  const applyFilters = (rooms: Room[] = availableRooms) => {
    let filtered = rooms;

    // Search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(room => 
      room.price >= searchFilters.priceRange[0] && 
      room.price <= searchFilters.priceRange[1]
    );

    // Amenities filter
    if (searchFilters.amenities.length > 0) {
      filtered = filtered.filter(room =>
        searchFilters.amenities.every(amenity => 
          room.amenities.includes(amenity)
        )
      );
    }

    // Max guests filter
    filtered = filtered.filter(room => room.maxGuests <= searchFilters.maxGuests);

    // Sort
    filtered.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return parseInt(a.size) - parseInt(b.size);
        default:
          return 0;
      }
    });

    setFilteredRooms(filtered);
  };

  // Auto search when dates change
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      searchRooms();
    }
  }, [formData.checkInDate, formData.checkOutDate, formData.adults, formData.children]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, searchFilters]);

  // Select room from search results
  const selectRoom = (room: Room) => {
    setFormData(prev => ({ ...prev, roomType: room.id }));
    
    // Scroll to booking form
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Calculate price with selected room
    if (totalNights > 0) {
      const price = room.price * totalNights * formData.rooms;
      setEstimatedPrice(price);
    }
  };

  // Calculate stay duration and price
  const calculateStay = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (nights > 0) {
        setTotalNights(nights);
        
        let selectedRoom;
        if (formData.roomType.includes('-')) {
          // Selected from search results
          selectedRoom = allRooms.find(room => room.id === formData.roomType);
        } else {
          // Selected from room types
          selectedRoom = roomTypes.find(room => room.id === formData.roomType);
        }
        
        if (selectedRoom) {
          const price = selectedRoom.price * nights * formData.rooms;
          setEstimatedPrice(price);
        }
      }
    }
  };

  // Get today's date for min date validation
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum checkout date (day after checkin)
  const getMinCheckoutDate = () => {
    if (formData.checkInDate) {
      const checkInDate = new Date(formData.checkInDate);
      checkInDate.setDate(checkInDate.getDate() + 1);
      return checkInDate.toISOString().split('T')[0];
    }
    return getTodayDate();
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<BookingForm> = {};

    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Ngày bắt đầu là bắt buộc';
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Ngày kết thúc là bắt buộc';
    }

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    if (!formData.roomType) {
      newErrors.roomType = 'Vui lòng chọn loại phòng';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof BookingForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Recalculate price when relevant fields change
    if (['checkInDate', 'checkOutDate', 'roomType', 'rooms'].includes(name)) {
      setTimeout(calculateStay, 100);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form on success
      setFormData({
        checkInDate: '',
        checkOutDate: '',
        adults: 2,
        children: 0,
        rooms: 1,
        roomType: '',
        fullName: '',
        email: '',
        phone: '',
        specialRequests: ''
      });
      setTotalNights(0);
      setEstimatedPrice(0);
      
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setSubmitStatus('idle');
    }, 5000);
  };

  return (
    <div className={`booking-container ${className || ''}`}>
      <div className="booking-content">
        {/* Header */}
        <header className="booking-header">
          <h1>Đặt Phòng</h1>
          <p className="booking-subtitle">À La Carte Ha Long Bay Residence</p>
        </header>

        {/* Room Search Section */}
        <section className="room-search-section">
          <h2 className="section-title">
            <span className="section-icon">🔍</span>
            Tìm kiếm phòng trống
          </h2>
          
          {/* Quick Search Dates */}
          <div className="quick-search">
            <div className="search-dates">
              <div className="form-group">
                <label className="form-label">Ngày nhận phòng</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  min={getTodayDate()}
                  className="form-input date-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Ngày trả phòng</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  min={getMinCheckoutDate()}
                  className="form-input date-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Khách</label>
                <div className="guest-summary">
                  {formData.adults} người lớn
                  {formData.children > 0 && `, ${formData.children} trẻ em`}
                </div>
              </div>
            </div>
            
            <button 
              type="button" 
              onClick={searchRooms}
              className="search-button"
              disabled={!formData.checkInDate || !formData.checkOutDate || isSearching}
            >
              {isSearching ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Đang tìm...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Tìm phòng
                </>
              )}
            </button>
          </div>

          {/* Search Filters */}
          {availableRooms.length > 0 && (
            <div className="search-filters">
              <div className="filter-group">
                <input
                  type="text"
                  placeholder="Tìm theo tên phòng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-group">
                <select
                  value={searchFilters.sortBy}
                  onChange={(e) => setSearchFilters(prev => ({ 
                    ...prev, 
                    sortBy: e.target.value as 'price' | 'name' | 'size' 
                  }))}
                  className="filter-select"
                >
                  <option value="price">Sắp xếp theo giá</option>
                  <option value="name">Sắp xếp theo tên</option>
                  <option value="size">Sắp xếp theo diện tích</option>
                </select>
              </div>

              <div className="filter-group price-range">
                <label className="filter-label">Khoảng giá:</label>
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="100000"
                  value={searchFilters.priceRange[1]}
                  onChange={(e) => setSearchFilters(prev => ({ 
                    ...prev, 
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                  }))}
                  className="price-slider"
                />
                <span className="price-display">
                  Tối đa: {searchFilters.priceRange[1].toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Available Rooms List */}
        {availableRooms.length > 0 && (
          <section className="available-rooms-section">
            <h2 className="section-title">
              <span className="section-icon">🏨</span>
              Phòng có sẵn ({filteredRooms.length})
            </h2>
            
            <div className="rooms-grid">
              {filteredRooms.map(room => (
                <div 
                  key={room.id} 
                  className={`room-result-card ${formData.roomType === room.id ? 'selected' : ''}`}
                >
                  <div className="room-image">
                    <img src={room.image} alt={room.name} loading="lazy"  />
                    <div className="room-status">
                      {room.available ? (
                        <span className="available">Còn phòng</span>
                      ) : (
                        <span className="unavailable">Hết phòng</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="room-details">
                    <h3 className="room-title">{room.name}</h3>
                    <p className="room-desc">{room.description}</p>
                    
                    <div className="room-specs">
                      <div className="spec-item">
                        <span className="spec-icon">📐</span>
                        <span>{room.size}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">🛏️</span>
                        <span>{room.bedType}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">👥</span>
                        <span>Tối đa {room.maxGuests} khách</span>
                      </div>
                    </div>
                    
                    <div className="room-amenities">
                      {room.amenities.slice(0, 4).map(amenity => (
                        <span key={amenity} className="amenity-tag">{amenity}</span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="more-amenities">+{room.amenities.length - 4} tiện ích</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="room-pricing">
                    <div className="price-per-night">
                      <span className="currency">VNĐ</span>
                      <span className="amount">{room.price.toLocaleString()}</span>
                      <span className="period">/đêm</span>
                    </div>
                    
                    {totalNights > 0 && (
                      <div className="total-price">
                        Tổng {totalNights} đêm: {(room.price * totalNights).toLocaleString()} VNĐ
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => selectRoom(room)}
                      className="select-room-button"
                      disabled={!room.available}
                    >
                      {formData.roomType === room.id ? 'Đã chọn' : 'Chọn phòng này'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredRooms.length === 0 && availableRooms.length > 0 && (
              <div className="no-results">
                <p>Không tìm thấy phòng phù hợp với bộ lọc hiện tại.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSearchFilters({
                      priceRange: [0, 5000000],
                      amenities: [],
                      maxGuests: 10,
                      sortBy: 'price'
                    });
                  }}
                  className="reset-filters-button"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </section>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Date Selection */}
          <section className="booking-section">
            <h2 className="section-title">
              <span className="section-icon">📅</span>
              Thời gian lưu trú
            </h2>
            
            <div className="date-selection">
              <div className="form-group">
                <label htmlFor="checkInDate" className="form-label">
                  Ngày bắt đầu <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="checkInDate"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  min={getTodayDate()}
                  className={`form-input date-input ${errors.checkInDate ? 'error' : ''}`}
                />
                {errors.checkInDate && (
                  <span className="error-message">{errors.checkInDate}</span>
                )}
              </div>

              <div className="date-separator">
                <span className="arrow">→</span>
              </div>

              <div className="form-group">
                <label htmlFor="checkOutDate" className="form-label">
                  Ngày kết thúc <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="checkOutDate"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  min={getMinCheckoutDate()}
                  className={`form-input date-input ${errors.checkOutDate ? 'error' : ''}`}
                />
                {errors.checkOutDate && (
                  <span className="error-message">{errors.checkOutDate}</span>
                )}
              </div>
            </div>

            {totalNights > 0 && (
              <div className="stay-summary">
                <span className="nights-info">
                  <strong>{totalNights}</strong> đêm lưu trú
                </span>
              </div>
            )}
          </section>

          {/* Guest & Room Selection */}
          <section className="booking-section">
            <h2 className="section-title">
              <span className="section-icon">👥</span>
              Thông tin khách & phòng
            </h2>
            
            <div className="guest-room-selection">
              <div className="form-group">
                <label htmlFor="adults" className="form-label">Người lớn</label>
                <select
                  id="adults"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  className="form-select"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} người</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="children" className="form-label">Trẻ em</label>
                <select
                  id="children"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  className="form-select"
                >
                  {[0,1,2,3,4].map(num => (
                    <option key={num} value={num}>{num} trẻ</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rooms" className="form-label">Số phòng</label>
                <select
                  id="rooms"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="form-select"
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num} phòng</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Room Type Selection */}
          <section className="booking-section">
            <h2 className="section-title">
              <span className="section-icon">🏨</span>
              {formData.roomType && formData.roomType.includes('-') ? 'Phòng đã chọn' : 'Chọn loại phòng'}
            </h2>
            
            {formData.roomType && formData.roomType.includes('-') ? (
              // Show selected room from search results
              (() => {
                const selectedRoom = allRooms.find(room => room.id === formData.roomType);
                return selectedRoom ? (
                  <div className="selected-room-display">
                    <div className="selected-room-card">
                      <img src={selectedRoom.image} alt={selectedRoom.name} className="selected-room-image" />
                      <div className="selected-room-info">
                        <h3>{selectedRoom.name}</h3>
                        <p>{selectedRoom.description}</p>
                        <div className="selected-room-specs">
                          <span>📐 {selectedRoom.size}</span>
                          <span>🛏️ {selectedRoom.bedType}</span>
                          <span>👥 Tối đa {selectedRoom.maxGuests} khách</span>
                        </div>
                        <div className="selected-room-price">
                          {selectedRoom.price.toLocaleString()} VNĐ/đêm
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, roomType: '' }))}
                        className="change-room-button"
                      >
                        Thay đổi
                      </button>
                    </div>
                  </div>
                ) : null;
              })()
            ) : (
              // Show room type selection
              <div className="room-types">
                {roomTypes.map(room => (
                  <div
                    key={room.id}
                    className={`room-card ${formData.roomType === room.id ? 'selected' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, roomType: room.id }));
                      if (errors.roomType) {
                        setErrors(prev => ({ ...prev, roomType: undefined }));
                      }
                      setTimeout(calculateStay, 100);
                    }}
                  >
                    <input
                      type="radio"
                      id={room.id}
                      name="roomType"
                      value={room.id}
                      checked={formData.roomType === room.id}
                      onChange={handleChange}
                      className="room-radio"
                    />
                    <div className="room-info">
                      <h3 className="room-name">{room.name}</h3>
                      <p className="room-description">{room.description}</p>
                      <div className="room-price">
                        {room.price.toLocaleString()} VNĐ<span>/đêm</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {errors.roomType && (
              <span className="error-message">{errors.roomType}</span>
            )}
          </section>

          {/* Price Summary */}
          {estimatedPrice > 0 && (
            <section className="booking-section price-summary">
              <h2 className="section-title">
                <span className="section-icon">💰</span>
                Tổng chi phí ước tính
              </h2>
              
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Loại phòng:</span>
                  <span>
                    {(() => {
                      if (formData.roomType.includes('-')) {
                        return allRooms.find(r => r.id === formData.roomType)?.name;
                      } else {
                        return roomTypes.find(r => r.id === formData.roomType)?.name;
                      }
                    })()}
                  </span>
                </div>
                <div className="price-item">
                  <span>Số đêm:</span>
                  <span>{totalNights} đêm</span>
                </div>
                <div className="price-item">
                  <span>Số phòng:</span>
                  <span>{formData.rooms} phòng</span>
                </div>
                <div className="price-total">
                  <span>Tổng cộng:</span>
                  <span className="total-amount">{estimatedPrice.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </section>
          )}

          {/* Guest Information */}
          <section className="booking-section">
            <h2 className="section-title">
              <span className="section-icon">👤</span>
              Thông tin khách hàng
            </h2>
            
            <div className="guest-info">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Nhập họ và tên đầy đủ"
                />
                {errors.fullName && (
                  <span className="error-message">{errors.fullName}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Số điện thoại <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+84 xxx xxx xxx"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="specialRequests" className="form-label">
                  Yêu cầu đặc biệt
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Ví dụ: Tầng cao, view biển, giường đôi..."
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* Submit Status Messages */}
          {submitStatus === 'success' && (
            <div className="status-message success">
              <span className="status-icon">✅</span>
              Đặt phòng thành công! Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="status-message error">
              <span className="status-icon">❌</span>
              Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại hoặc liên hệ trực tiếp.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Đang xử lý...
              </>
            ) : (
              <>
                <span className="submit-icon">🏨</span>
                Đặt phòng ngay
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;