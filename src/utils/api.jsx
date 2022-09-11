import axios from "axios";

export const API_MULTICHAIN = axios.create({
  baseURL: "https://rpc.ankr.com",
});

export const API_RESCUE = axios.create({
  baseURL: "https://api.web3rescue.com/rescue",
});
