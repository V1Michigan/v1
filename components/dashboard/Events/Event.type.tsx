// TODO - Implement Event type restrictions

// enum EventRestriction{
//     Leadership = "Leadership Only",
//     MembersOnly = "Members Only",
//     Alumni = "Alumni Only",
//     Public = ""
// }
type LinkInfo = {
  writeup?: string;
  rsvp?: string;
  video?: string;
  slides?: string;
  speaker?: {
    pic?: string;
    url?: string;
  };
};

export type Event = {
  name: string;
  id: string;
  start_date: string;
  end_date: string;
  place: string;
  description: string;
  link: string; // TODO remove
  links: LinkInfo | null;
  interests: string[];
  place_url?: string;
  // interests: []
  // links: [   {     type: 'video' | 'slides' | 'rsvp' | 'speaker' | 'writeup',     link: '...'   },   ... ]
  // Add links and interests
  // TODO - Implement Event type restrictions
  // restrictions: EventRestriction;
  // TODO - Implement Event img
  // img: string;
};
