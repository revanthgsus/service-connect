
// createImage crop function
const CreateImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous'; // handle CORS issues
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = url;
  });


// cropped image handle functionality
const CropImage = async (imageSrc, pixelCrop) => {
  const image = await CreateImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve({ blob });
      } else {
        reject(new Error('Canvas is empty.'));
      }
    }, 'image/jpg', 1);
  });
};

export default CropImage;
