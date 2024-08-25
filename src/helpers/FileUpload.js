// imageCompressor.js
export function compressImageData(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const targetWidth = 280;
      const targetHeight = (image.height / image.width) * targetWidth;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        0.9
      );
    };

    image.onerror = (error) => {
      console.error("Error loading image:", error);
      reject(error);
    };

    image.src = URL.createObjectURL(file);
  });
}

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export async function UploadFile(
  supabase,
  file,
  bucketName,
  compressImage = false,
  allowed_types = ["image/jpeg", "image/gif", "image/png"]
) {
  if (!file) return { error: true, code: 1, message: "File cant be null!" };
  const { type } = file;
  if (!allowed_types.includes(type)) {
    return { error: true, code: 2, message: "File type not allowed!" };
  }

  const fileExtension = file.type.split("/")[1];
  const uniqueFilename = `${Date.now()}_${generateUniqueId()}.${fileExtension}`;
  let compressedFile = file;
  if (compressImage) compressedFile = await compressImageData(file);

  let { data, error } = await supabase.storage
    .from(bucketName)
    .upload(uniqueFilename, compressedFile);

  if (error) {
    return { error: true, code: 3, message: `${JSON.stringify(error)}` };
  }

  // console.log("Image uploaded successfully:", data);

  const publicUrl = supabase.storage.from(bucketName).getPublicUrl(data.path)
    .data.publicUrl;

  //.log(publicUrl);

  return { ...data, publicUrl: publicUrl };
}
