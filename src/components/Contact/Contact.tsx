// Contact.tsx
import React, { useState } from 'react';
import './Contact.css';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactProps {
  className?: string;
}

// API Service
const contactAPI = {
  create: async (data: { firstName: string; lastName: string; email: string; message: string }) => {
    const response = await fetch('http://localhost:8080/api/v1/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Có lỗi xảy ra khi gửi liên hệ');
    }

    return response.json();
  }
};

const Contact: React.FC<ContactProps> = ({ className }) => {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiError, setApiError] = useState<string>('');

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Tên là bắt buộc';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Họ là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail không hợp lệ';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Tin nhắn là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      // Prepare data for API (only required fields)
      const apiData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      };

      console.log('Sending data to API:', apiData);

      // Call API
      const response = await contactAPI.create(apiData);

      console.log('API Response:', response);

      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });

      setSubmitStatus('success');

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setApiError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi liên hệ');

      // Reset error status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setApiError('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`contact-container ${className || ''}`}>
      <div className="contact-content">
        {/* Header */}
        <header className="contact-header">
          <h1>Liên hệ với chúng tôi</h1>
          <p className="contact-subtitle">À La Carte Ha Long Bay Residence</p>
        </header>

        <div className="contact-layout">
          {/* Contact Information */}
          <section className="contact-info">
            <div className="info-card">
              <h2 className="info-title">
                <span className="info-icon">📍</span>
                Địa chỉ
              </h2>
              <address className="address">
                Lô đất H30–H33, Bán đảo số 2,<br />
                Khu đô thị dịch vụ Hùng Thắng,<br />
                P. Hùng Thắng, Hạ Long,<br />
                Quảng Ninh, 100000 Việt Nam
              </address>

              <div className="location-note">
                <span className="highlight-icon">🏖️</span>
                Nằm tại Bán đảo 2, Khu đô thị Marina Bay<br />
                cách bãi biển <span>chỉ 5 phút đi bộ</span>.
              </div>
            </div>

            <div className="contact-methods">
              <div className="contact-method">
                <h3>
                  <span className="method-icon">📞</span>
                  Điện thoại
                </h3>
                <div className="phone-numbers">
                  <a href="tel:+842033559555" className="phone-link">
                    +84 20 3355 9555
                  </a>
                  <a href="tel:+84835643388" className="phone-link">
                    +84 835 643 388
                  </a>
                </div>
              </div>

              <div className="contact-method">
                <h3>
                  <span className="method-icon">✉️</span>
                  E-mail
                </h3>
                <a href="mailto:info@alacartehalongbay.com" className="email-link">
                  info@alacartehalongbay.com
                </a>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="contact-form-section">
            <h2 className="form-title">
              <span className="form-icon">💬</span>
              Gửi thông tin liên hệ
            </h2>

            <form onSubmit={handleSubmit} className="contact-form">
              {/* Name Fields */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Họ <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Nhập họ của bạn"
                  />
                  {errors.lastName && (
                    <span className="error-message">{errors.lastName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    Tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Nhập tên của bạn"
                  />
                  {errors.firstName && (
                    <span className="error-message">{errors.firstName}</span>
                  )}
                </div>
              </div>

              {/* Contact Fields */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    E-mail <span className="required">*</span>
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
                    Điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+84 xxx xxx xxx"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Tin nhắn <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`form-textarea ${errors.message ? 'error' : ''}`}
                  placeholder="Nhập tin nhắn của bạn..."
                  rows={5}
                />
                {errors.message && (
                  <span className="error-message">{errors.message}</span>
                )}
              </div>

              {/* Security Note */}
              <div className="security-note">
                <p>
                  <span className="security-icon">🔒</span>
                  Vì lý do bảo mật, vui lòng <strong>không nhập thông tin thẻ tín dụng</strong> tại đây.
                </p>
              </div>

              {/* Submit Status Messages */}
              {submitStatus === 'success' && (
                <div className="status-message success">
                  <span className="status-icon">✅</span>
                  Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="status-message error">
                  <span className="status-icon">❌</span>
                  {apiError || 'Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua điện thoại.'}
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
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <span className="submit-icon">📤</span>
                    Gửi yêu cầu
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;