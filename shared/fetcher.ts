import { API_URL } from "./constant";

export const fetcher = async (endpoint: string, init?: RequestInit) => {
  const response = await fetch(`${API_URL}/${endpoint}`, init);
  return response.json();
};
