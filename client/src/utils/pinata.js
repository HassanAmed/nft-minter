require("dotenv").config();
const axios = require("axios");

export const pinToIPFS = async (JSONBody) => {
  //making axios POST request to server to pin file to ipfs ⬇️
  return axios
    .post("/pinFile", JSONBody)
    .then(function (response) {
      if (response.data.success && response.data.pinataUrl) {
        return response.data;
      }
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
