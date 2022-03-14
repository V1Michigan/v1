import type { Profile } from "../../pages/profile/[username]";
import {
  AdditionalLinksField, EmailField, InterestsField, LinkedInField, MajorsField,
  MinorsField, PhoneField, RolesField, YearField,
} from "./fields/ProfileFields";

interface EditProfileProps {
  profile: Profile
}

const EditProfile = ({ profile }: EditProfileProps) => (
  <div className="grid grid-cols-2 gap-x-10 gap-y-2 justify-center items-center pl-10 pr-10">
    <EmailField value={ profile.email } label="Email" />
    <PhoneField label="Phone" />
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
