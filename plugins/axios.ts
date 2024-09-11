import { defineNuxtPlugin } from "#app";
import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    baseURL: "http://localhost:4000",
  });

  nuxtApp.provide("axios", api);
});
