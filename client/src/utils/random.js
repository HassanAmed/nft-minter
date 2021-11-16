const arraylength = parseInt(process.env.REACT_APP_COLLECTION_SIZE);
const images = Array.from({ length: arraylength }, (_, i) => i + 1);
const mintedImages = [];
export const getRandomImageId = async () => {
  let minted = images.splice(Math.floor(Math.random() * images.length), 1);
  mintedImages.push(minted[0]);
  return minted[0];
};

