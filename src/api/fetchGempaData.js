export const fetchGempaData = async () => {
    try {
      const url = `${import.meta.env.VITE_BMKG_API}?t=${new Date().getTime()}`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Gagal mengambil data gempa BMKG:", error);
      throw error;
    }
  };
  