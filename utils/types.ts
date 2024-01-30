export type StartupProfile = {
  name: string | null;
  username: string;
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
  profiles: StartupProfile[];
};
