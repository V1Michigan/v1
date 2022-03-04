import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Year, RoleType } from "../../types/profile";
import type { FieldOfStudy } from "../../types/fieldsOfStudy";
import useSupabase from "../../hooks/useSupabase";

// Username included separately
interface Profile {
  name: string;
  email: string;
  phone: string; // Not sure this should be public
  // cohort: string;  For the future...
  year: Year,
  fields_of_study: {
    majors: FieldOfStudy[],
    minors: FieldOfStudy[],
  },
  linkedin: string,
  website: string,
  roles: RoleType[],
  interests: string[],
}
const PROFILE_COLUMNS = "name, phone, year, fields_of_study, linkedin, website, roles, interests";

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { username: profileUsername } = router.query;
  const { supabase, username: currentUsername } = useSupabase();
  const isCurrentUser = profileUsername === currentUsername;

  const [profileData, setProfileData] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error, status } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("username", profileUsername)
        .single();

      if ((error && status !== 406) || !data) {
        router.replace("/404");
      } else {
        setProfileData(data);
      }
    };
    fetchProfile();
  }, [supabase, profileUsername, router]);

  return (
    <p>
      Profile:
      {" "}
      {profileUsername}
      {profileData && JSON.stringify(profileData)}
    </p>
  );
};

export default UserProfile;
