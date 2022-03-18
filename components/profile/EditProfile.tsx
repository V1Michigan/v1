import type { Profile } from "../../pages/profile/[username]";
import {
  AdditionalLinksField,
  BioField,
  EmailField,
  InterestsField,
  LinkedInField,
  MajorsField,
  MinorsField,
  PhoneField,
  RolesField,
  YearField,
} from "./fields/ProfileFields";

interface EditProfileProps {
  profile: Profile;
}

const EditProfile = ({ profile }: EditProfileProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 justify-center items-center">
    <EmailField value={profile.email} label="Email" />
    <PhoneField label="Phone" />
    <BioField label="Bio" />
    <YearField label="School year" />
    <LinkedInField label="LinkedIn" />
    <AdditionalLinksField label="Additional links" />
    <MajorsField label="Major(s)" />
    <MinorsField label="Minor(s)" />
    <RolesField label="Roles" />
    <InterestsField label="Interests" />
  </div>
);

export default EditProfile;
