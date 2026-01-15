import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000",
});
const BACKEND_URL = "http://localhost:3000";
export async function fetchAchievements(){
  try{
    const response = await api.get( "/achievements/me");
    return response.data;
  }
  catch(error){
    console.error("Error fetching achievements:", error);
    throw error;
  }
}
