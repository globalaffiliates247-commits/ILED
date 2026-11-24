// Admin UI strings. English is the default for the super admin; Vietnamese is available.
(function () {
  const DICT = {
    en: {
      login_title: 'Sign in', login_sub: 'ILED Staff Manager · Super admin',
      username: 'Username', pin: '6-digit code', login: 'Sign in', logout: 'Sign out',
      err_login: 'Wrong username or code.', too_many: 'Too many attempts. Try again in 15 minutes.',
      nav_current: 'Current', nav_attention: 'Needs attention', nav_archived: 'Archived',
      page_current: 'Current staff', page_attention: 'Needs attention', page_archived: 'Archived staff',
      add: '+ Add staff', export: 'Export CSV', search_ph: 'Search by name, position or ID…',
      stat_current: 'Active contracts', stat_attention: 'Expiring or ended', stat_archived: 'Archived',
      col_id: 'ILED ID', col_name: 'Name', col_position: 'Position', col_field: 'Field',
      col_end: 'Contract end', col_status: 'Status', col_days: 'Days left', col_actions: '',
      edit: 'Edit', archive: 'Archive', restore: 'Restore', open: 'Card', none: 'No staff found.',
      confirm_archive: 'Archive this staff member? The public page will show "not collaborating".',
      status_active: 'Active', status_expiring: 'Expiring', status_ended: 'Ended', status_archived: 'Archived',
      title_add: 'Add staff', title_edit: 'Edit staff',
      f_title: 'Title / honorific', f_name: 'Full name *', f_position: 'Position',
      f_id: 'ILED ID', f_id_hint: 'Auto-generated.', f_start: 'Start date *',
      f_end: 'Contract end (auto)', f_end_hint: '1 year, calculated from start date.',
      f_field: 'Field', f_field_none: '—', f_field_law: 'Law', f_field_edu: 'Education',
      f_email: 'Email', f_phone: 'Phone', f_notes: 'Notes',
      f_attach_name: 'Attachment name', f_attach_name_ph: 'e.g. Signed contract 2026',
      f_attach_url: 'Attachment link (https)',
      f_attach_hint: 'Store the link to the file (Google Drive or similar), not the file itself.',
      share_title: 'Card & share link', share_hint: 'Static link for sharing with partners. The QR code encodes this link.',
      copy: 'Copy link', copied: 'Link copied.', open_card: 'Open phone card', open_pub: 'Open public page',
      scans: 'scans', save: 'Save', cancel: 'Cancel',
      err_required: 'Please fill in the required fields.', err_generic: 'Something went wrong. Please try again.',
      err_session: 'Your session has expired. Please sign in again.', saved: 'Saved.', archived_ok: 'Archived.', restored_ok: 'Restored.',
      days_unit: 'days'
    },
    vi: {
      login_title: 'Đăng nhập', login_sub: 'Quản lý nhân sự ILED · Quản trị viên',
      username: 'Tên đăng nhập', pin: 'Mã 6 số', login: 'Đăng nhập', logout: 'Đăng xuất',
      err_login: 'Sai tên đăng nhập hoặc mã.', too_many: 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.',
      nav_current: 'Đang hoạt động', nav_attention: 'Cần chú ý', nav_archived: 'Đã lưu trữ',
      page_current: 'Nhân sự đang hoạt động', page_attention: 'Cần chú ý', page_archived: 'Nhân sự đã lưu trữ',
      add: '+ Thêm nhân sự', export: 'Xuất CSV', search_ph: 'Tìm theo tên, chức danh hoặc mã…',
      stat_current: 'Hợp đồng đang hiệu lực', stat_attention: 'Sắp hết hạn hoặc đã hết', stat_archived: 'Đã lưu trữ',
      col_id: 'Mã ILED', col_name: 'Họ tên', col_position: 'Chức danh', col_field: 'Lĩnh vực',
      col_end: 'Hết hạn HĐ', col_status: 'Trạng thái', col_days: 'Còn lại', col_actions: '',
      edit: 'Sửa', archive: 'Lưu trữ', restore: 'Khôi phục', open: 'Thẻ', none: 'Không có nhân sự nào.',
      confirm_archive: 'Lưu trữ nhân sự này? Trang công khai sẽ hiển thị "không còn cộng tác".',
      status_active: 'Đang hoạt động', status_expiring: 'Sắp hết hạn', status_ended: 'Đã hết hạn', status_archived: 'Đã lưu trữ',
      title_add: 'Thêm nhân sự', title_edit: 'Sửa nhân sự',
      f_title: 'Danh xưng', f_name: 'Họ và tên *', f_position: 'Chức danh',
      f_id: 'Mã ILED', f_id_hint: 'Tự động tạo.', f_start: 'Ngày bắt đầu *',
      f_end: 'Hết hạn hợp đồng (tự động)', f_end_hint: '1 năm, tính từ ngày bắt đầu.',
      f_field: 'Lĩnh vực', f_field_none: '—', f_field_law: 'Pháp luật', f_field_edu: 'Giáo dục',
      f_email: 'Email', f_phone: 'Điện thoại', f_notes: 'Ghi chú',
      f_attach_name: 'Tên tài liệu đính kèm', f_attach_name_ph: 'VD: Hợp đồng đã ký 2026',
      f_attach_url: 'Liên kết tài liệu (https)',
      f_attach_hint: 'Chỉ lưu liên kết tới tệp (Google Drive hoặc tương tự), không tải tệp lên đây.',
      share_title: 'Thẻ & liên kết chia sẻ', share_hint: 'Liên kết cố định để chia sẻ với đối tác. Mã QR mã hóa liên kết này.',
      copy: 'Sao chép liên kết', copied: 'Đã sao chép liên kết.', open_card: 'Mở thẻ điện thoại', open_pub: 'Mở trang công khai',
      scans: 'lượt quét', save: 'Lưu', cancel: 'Hủy',
      err_required: 'Vui lòng điền các trường bắt buộc.', err_generic: 'Có lỗi xảy ra. Vui lòng thử lại.',
      err_session: 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.', saved: 'Đã lưu.', archived_ok: 'Đã lưu trữ.', restored_ok: 'Đã khôi phục.',
      days_unit: 'ngày'
    }
  };

  let lang = 'en';
  try { lang = localStorage.getItem('iled-admin-lang') === 'vi' ? 'vi' : 'en'; } catch (_) { /* storage blocked */ }

  function t(key) {
    return (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
  }

  function applyStatic(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    (root || document).querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
  }

  function setLang(next) {
    lang = next === 'vi' ? 'vi' : 'en';
    try { localStorage.setItem('iled-admin-lang', lang); } catch (_) { /* ignore */ }
    applyStatic();
    document.dispatchEvent(new CustomEvent('i18n:change'));
  }

  window.I18N = { t, applyStatic, setLang, getLang: () => lang };
})();
