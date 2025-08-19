tinymce.init({
  selector: 'textarea[textarea-mce]',
  plugins: 'lists link image table code help wordcount',
  // upload tu tinymce len api de luu tren cloudinary de khong phai luu vao db
  images_upload_url: '/admin/upload',
  automatic_uploads: true,
});