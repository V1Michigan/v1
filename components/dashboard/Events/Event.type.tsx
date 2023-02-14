// TODO - Implement Event type restrictions

// enum EventRestriction{
//     Leadership = "Leadership Only",
//     MembersOnly = "Members Only",
//     Alumni = "Alumni Only",
//     Public = ""
// }

export type Event = {
  name: string;
  id: string;
  start_date: string;
  end_date: string;
  place: string;
  description: string;
  link: string;
  place_url?: string;
  // TODO - Implement Event type restrictions
  // restrictions: EventRestriction;
  // TODO - Implement Event img
  // img: string;
};
