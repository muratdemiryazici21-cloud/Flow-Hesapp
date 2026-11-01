/**
 * Compresses and resizes an uploaded user image to a lightweight 256x256 square avatar
 * ensuring fast Firestore persistence and crisp display across devices.
 */
export async function compressAvatarImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Lütfen geçerli bir resim dosyası seçin (PNG, JPG, WEBP).');
  }

  // 15MB file size limit check before processing
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Dosya boyutu çok büyük (En fazla 15MB yüklenebilir).');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Resim dosyası okunamadı.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Resim formatı desteklenmiyor.'));
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Resim işlenirken bir hata oluştu.'));
          return;
        }

        // Center square crop
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        // Convert to WebP or JPEG
        let dataUrl = canvas.toDataURL('image/webp', 0.85);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
