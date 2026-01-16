import api from "@/services/service";

export async function fetchAchievements() {
  try {
    const response = await api.get("/achievements/me");
    return response.data;
  }
  catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
}
