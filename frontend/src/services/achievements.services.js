import api from "./service";
export async function fetchAchievements(){
  try{
    const response = await api.get("/achievements/me");
    if(response.status == 404){
      return null;
    }
    return response.data;
  }
  catch(error){
    console.error("Error fetching achievements:", error);
    throw error;
  }
}
