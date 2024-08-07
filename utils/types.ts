export type StartupProfile = {
  name: string | null;
  username: string;
  email: string;
};

export type StartupProfileMetadata = {
  role: string;
  headshot_src: string;
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
  logo: string;
  name: string;
  categories: string;
  link: string;
};
