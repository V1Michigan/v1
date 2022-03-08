import type { Profile } from "../../pages/profile/[username]";
import {
  AdditionalLinksField, EmailField, InterestsField, LinkedInField, MajorsField,
  MinorsField, PhoneField, RolesField, YearField,
} from "./fields/ProfileFields";

interface EditProfileProps {
  profile: Profile
}

const EditProfile = ({ profile }: EditProfileProps) => (
  <div className="flex flex-col gap-y-4">
    <div className="flex flex-col gap-y-2 p-2">
      <EmailField value={ profile.email } label={ <img className="h-6" src="/profile/email.svg" alt="Email" /> } />
      <PhoneField label={ <img className="h-6" src="/profile/phone.svg" alt="Phone" /> } />
      <LinkedInField label={ <img className="h-6" src="/profile/linkedin.svg" alt="LinkedIn" /> } />
    </div>
    <AdditionalLinksField label="Additional links" />
    <YearField label="School year" />
    <MajorsField label="Major(s)" />
    <MinorsField label="Minor(s)" />
    <RolesField label="Roles" />
    <InterestsField label="Interests" />
  </div>
);

export default EditProfile;
