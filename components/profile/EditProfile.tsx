import type { Profile } from "../../pages/profile/[username]";
import {
  AdditionalLinksField, EmailField, InterestsField, LinkedInField, MajorsField,
  MinorsField, PhoneField, RolesField, YearField,
} from "./ProfileFields";

interface EditProfileProps {
  profile: Profile
}

const EditProfile = ({ profile }: EditProfileProps) => (
  <div className="flex flex-col gap-y-4">
    <div className="flex flex-col gap-y-2 p-2">
      <div className="flex flex-row">
        <img className="h-6" src="/profile/email.svg" alt="Email" />
        {/* TODO: Fix labels */}
        <EmailField value={ profile.email } />
      </div>
      <div className="flex flex-row">
        <img className="h-6" src="/profile/phone.svg" alt="Phone" />
        <PhoneField />
      </div>
      <div className="flex flex-row">
        <img className="h-6" src="/profile/linkedin.svg" alt="LinkedIn" />
        <LinkedInField />
      </div>
    </div>
    <AdditionalLinksField />
    <YearField />
    <MajorsField />
    <MinorsField />
    <RolesField />
    <InterestsField />
  </div>
);

export default EditProfile;
