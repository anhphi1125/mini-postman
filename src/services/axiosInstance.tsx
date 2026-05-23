import axios from "axios";

const axiosInstance = (contentType = "application/json") => {
  const axiosIns = axios.create({
    baseURL: "http://localhost:3000",
  });

  axiosIns.interceptors.request.use(
    async (config) => {
      if (config.headers) {
        config.headers.set("Accept", "application/json");
        config.headers.set("Content-Type", contentType);
      }
      return config;
    },
    (err) => Promise.reject(err),
  );

  axiosIns.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err),
  );

  return axiosIns;
};

export default axiosInstance;
