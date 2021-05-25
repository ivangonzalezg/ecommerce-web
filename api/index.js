import axios from "axios";

const baseURL = process.env.NODE_ENV === "production" ? "http://3.141.85.165:1337" : "http://localhost:1337";

const API = (jwt = "") =>
  axios.create({
    baseURL,
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
  });

function getErrorMessage(error = new Error("Error")) {
  return typeof error.response?.data?.message === "string"
    ? error.response?.data?.message
    : error.response?.data?.message[0]?.messages[0]?.message || error.message;
}

function getPhotoUrl(url = "") {
  if (!url) {
    return undefined;
  }
  return () => `${baseURL}${url}`;
}

export default API;

export { getErrorMessage, getPhotoUrl };
