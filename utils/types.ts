export type StartupProfile = {
  id: string;
  name: string | null;
  username: string;
  email: string;
  slack_deeplink: string | null;
};

export type StartupProfileMetadata = {
  role?: string;
  headshot_src?: string;
};

export type Startup = {
  created_at: string;
  description: string;
  id: number;
  industries: string[];
  logo: string;
  name: string;
  startups_members: StartupProfileMetadata[];
  size: number;
  stage: string;
  tech: string[];
  website: string;
  profiles: StartupProfile[];
  github: string;
  isProject: boolean;
};

export type Project = {
  created_at: string;
  description: string;
  id: number;
  logo_url: string;
  name: string;
  categories: string[];
  link: string;
  startup_id: number;
  profiles: {
    id: string;
    username: string;
    email: string;
    name: string;
    slack_deeplink: string;
  }[];
};
