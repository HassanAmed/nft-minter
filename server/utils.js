const arraylength = parseInt(200);
const images = Array.from({ length: arraylength }, (_, i) => i + 1);

function isExists(id) {
  return images.includes(id);
}

function removeMinted(e) {
  if (!isExists(e)) {
    return false;
  }
  return images.splice(images.indexOf(e), 1);
}

export { isExists, removeMinted };
