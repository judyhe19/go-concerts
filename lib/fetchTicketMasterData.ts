import type { TicketDataType, TicketMasterAllEventsDataType } from './ticketWebsiteTypeUtils.ts';

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;  

type TicketMasterResponse = {
  test: String;
}
 
export const searchArtist = async (artistName: string): Promise<TicketMasterAllEventsDataType> => {
  const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(artistName)}&apikey=${TICKETMASTER_API_KEY}`);
  const TicketMasterResponse = await response.json();
  const data = extractTicketMasterEventDetails(TicketMasterResponse._embedded);
  return data;
};
  
export const extractTicketMasterEventDetails = (jsonData: TicketMasterAllEventsDataType): TicketMasterAllEventsDataType => {
  if (!jsonData) {
    throw new Error("Invalid JSON structure");
  }
  
  return jsonData.map(event => {
    return {
      name: event.name,
      url: event.url,
      localDate: event.dates?.start?.localDate,
      // city: event.venues?.[0]?.city?.name,
      // state: event._embedded?.venues?.[0]?.state?.name,
      platform: "TicketMaster"
    };
  });
};
  
  // Example usage
  const ARTIST_NAME = 'Example Artist'; // Replace with the actual artist name
  searchArtist(ARTIST_NAME)
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  