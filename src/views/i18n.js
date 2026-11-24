'use strict';

const STR = {
  vi: {
    id: 'Mã ILED', since: 'Từ ngày', until: 'Hiệu lực đến',
    collab: 'Đang hợp tác với ILED', not_collab: 'Không còn hợp tác với ILED',
    footer: 'Thông tin được hệ thống ILED cập nhật tự động.',
    qr_title: 'Mã QR của hồ sơ này', qr_desc: 'Chia sẻ trang này bằng cách cho người khác quét mã.',
    card_hint: 'Quét mã QR để xem thông tin', view: 'Xem',
    notfound: 'Không tìm thấy hồ sơ hợp lệ.',
    email: 'Email', phone: 'Điện thoại',
    card_front: 'Mặt trước', card_back: 'Mặt sau', card_open_profile: 'Xem hồ sơ đầy đủ',
    card_motto: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', card_motto_sub: 'Độc lập - Tự do - Hạnh phúc',
  },
  en: {
    id: 'ILED ID', since: 'Since', until: 'Valid until',
    collab: 'Currently collaborating with ILED', not_collab: 'No longer collaborating with ILED',
    footer: 'Information is updated automatically by ILED.',
    qr_title: 'QR code for this profile', qr_desc: 'Share this page by letting others scan the code.',
    card_hint: 'Scan the QR code to view details', view: 'View',
    notfound: 'No valid profile found.',
    email: 'Email', phone: 'Phone',
    card_front: 'Front', card_back: 'Back', card_open_profile: 'View full profile',
    card_motto: 'SOCIALIST REPUBLIC OF VIETNAM', card_motto_sub: 'Independence - Freedom - Happiness',
  },
};

const pick = (lang) => (lang === 'en' ? 'en' : 'vi');
const t = (lang) => STR[pick(lang)];

module.exports = { t, pick };
