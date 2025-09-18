// Policy.tsx
import React from 'react';
import './Policy.css';

interface PolicyProps {
    className?: string;
}

const Policy: React.FC<PolicyProps> = ({ className }) => {
    return (
        <div className={`policy-container ${className || ''}`}>
            <div className="policy-content">
                <header className="policy-header">
                    <h1>Chính Sách Khách Sạn</h1>
                    <p className="policy-subtitle">À La Carte Ha Long Bay Residence</p>
                </header>

                {/* Chính sách hủy phòng */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <span className="section-icon">🏠</span>
                        Chính sách hủy phòng
                    </h2>
                    <div className="policy-card">
                        <h3 className="policy-card-title">Giá Flexible:</h3>
                        <ul className="policy-list">
                            <li>
                                <strong>Miễn phí hủy</strong> tối đa trước 5 ngày so với ngày đến.
                            </li>
                            <li>
                                <strong>Hủy trong vòng 5 ngày</strong> trước khi đến hoặc không đến:
                                <span className="highlight">tính phí toàn bộ thời gian lưu trú.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Điều khoản điều kiện */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <span className="section-icon">📋</span>
                        Điều khoản, điều kiện và chính sách bảo mật
                    </h2>
                    <div className="policy-grid">
                        <div className="policy-card">
                            <h3 className="policy-card-title">Giờ nhận phòng</h3>
                            <p className="time-info">
                                <span className="time">15:00</span> - <span className="time">23:30</span>
                            </p>
                        </div>
                        <div className="policy-card">
                            <h3 className="policy-card-title">Giờ trả phòng</h3>
                            <p className="time-info">
                                <span className="time">00:30</span> - <span className="time">12:00</span>
                            </p>
                        </div>
                    </div>
                    <div className="policy-note">
                        <p>
                            <strong>Lưu ý:</strong> Chính sách hủy và thanh toán trước có thể khác nhau tùy theo loại phòng.
                            Vui lòng kiểm tra điều kiện áp dụng cho từng lựa chọn khi đặt phòng.
                        </p>
                    </div>
                </section>

                {/* Chính sách trẻ em */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <span className="section-icon">👶</span>
                        Chính sách trẻ em & giường
                    </h2>
                    <div className="children-policy">
                        <div className="age-group">
                            <h3>Dưới 5 tuổi</h3>
                            <p><span className="free-tag">MIỄN PHÍ</span> cho tối đa 02 trẻ ngủ chung giường với bố mẹ.</p>
                        </div>
                        <div className="age-group">
                            <h3>Từ 6 – 11 tuổi</h3>
                            <p>Phụ thu theo chính sách khách sạn.</p>
                        </div>
                    </div>
                    <div className="policy-note">
                        <p>
                            Để hiển thị giá và số khách chính xác, vui lòng nhập số lượng và độ tuổi trẻ em khi tìm phòng.
                        </p>
                    </div>
                </section>

                {/* Chính sách giường cũi */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <span className="section-icon">🛏️</span>
                        Chính sách giường cũi & giường phụ
                    </h2>
                    <div className="bed-policy">
                        <div className="age-category">
                            <h3>0 – 2 tuổi:</h3>
                            <ul className="bed-list">
                                <li>
                                    <span className="bed-type">Giường phụ theo yêu cầu:</span>
                                    <span className="price">1,335,000 VND/trẻ em/đêm</span>
                                </li>
                                <li>
                                    <span className="bed-type">Giường cũi theo yêu cầu:</span>
                                    <span className="free-tag">Miễn phí</span>
                                </li>
                            </ul>
                        </div>
                        <div className="age-category">
                            <h3>Từ 3 tuổi trở lên:</h3>
                            <ul className="bed-list">
                                <li>
                                    <span className="bed-type">Giường phụ theo yêu cầu:</span>
                                    <span className="price">1,335,000 VND/người/đêm</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="policy-warning">
                        <strong>Lưu ý:</strong> <ul><ol>Giá giường cũi và giường phụ không bao gồm trong tổng giá phòng
                            và sẽ được thanh toán riêng trong thời gian lưu trú.</ol><ol> Số lượng giường phụ/giường cũi
                                tùy thuộc vào loại phòng và tình trạng có sẵn.</ol></ul> 
                    </div>
                </section>

                {/* Các chính sách khác */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <span className="section-icon">ℹ️</span>
                        Thông tin bổ sung
                    </h2>
                    <div className="policy-grid">
                        <div className="policy-card">
                            <h3 className="policy-card-title">
                                <span className="icon">🎂</span>
                                Giới hạn độ tuổi
                            </h3>
                            <p>Không có giới hạn độ tuổi khi nhận phòng.</p>
                        </div>

                        <div className="policy-card">
                            <h3 className="policy-card-title">
                                <span className="icon">🐕</span>
                                Vật nuôi
                            </h3>
                            <p>Khách sạn không chấp nhận vật nuôi.</p>
                        </div>
                    </div>
                </section>

                {/* Thẻ thanh toán */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <span className="section-icon">💳</span>
                        Thẻ thanh toán
                    </h2>
                    <div className="payment-cards">
                        <p>Khách sạn chấp nhận các loại thẻ:</p>
                        <div className="card-list">
                            <span className="card-item">Mastercard</span>
                            <span className="card-item">Visa</span>
                            <span className="card-item">JCB</span>
                            <span className="card-item">American Express</span>
                            <span className="card-item">Thẻ ghi nợ</span>
                        </div>
                    </div>
                    <div className="policy-note">
                        <p>
                            <strong>À La Carte Ha Long Bay Residence</strong> có quyền tạm giữ một khoản tiền trước khi nhận phòng.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Policy;