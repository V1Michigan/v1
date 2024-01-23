export type StartupProfile = {
  headshot: string;
  name: string;
  role: string;
};

export type Startup = {
  created_at: string;
  description: string;
  id: number;
  industries: string[];
  logo: string;
  name: string;
  roles: string[];
  size: number;
  stage: string;
  tech: string[];
  website: string;
  members: StartupProfile[];
};
