import axios from 'axios';

export const fetchZonesFromAPI = async (geonameId: string, selectedLanguageCode: string) => {
  const apiUrl = `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=amadagueye&lang=${selectedLanguageCode}`;
  try {
    const response = await axios.get(apiUrl);
    const zones = response.data.geonames.map((zone: any) => ({
      key: zone.geonameId,
      value: zone.name,
    }));
    return zones;
  } catch (error) {
    console.error('Error fetching zones:', error);
    throw error;
  }
};

export const fetchGeonameName = async (geonameId: string, selectedLanguageCode: string) => {
  const apiUrl = `http://api.geonames.org/getJSON?geonameId=${geonameId}&username=amadagueye&lang=${selectedLanguageCode}`;
  try {
    const response = await axios.get(apiUrl);
    //console.log(response.data.name)
    return { key: geonameId, value: response.data.name };
  } catch (error) {
    console.error('Error fetching geoname name:', error);
    throw error;
  }
};
