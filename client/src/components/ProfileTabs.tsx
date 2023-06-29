import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AddBalance from 'components/AddBalance';
import PayContractor from 'components/PayContractor';
import styles from 'assets/css/tabs.module.css';
import { Profile } from 'utils/types';

interface ProfileTabsProps {
  profileDetails: {
    id: string;
    firstName: string;
    lastName: string;
    balance: number;
    profession: string;
  };
  updateProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const ProfileTabs = ({ profileDetails, updateProfile }: ProfileTabsProps) => {
  return (
    <Tabs>
      <TabList className={styles.tablist}>
        <Tab className={styles.tab}>Profile</Tab>
        <Tab className={styles.tab}>Contractor</Tab>
      </TabList>

      <TabPanel>
        <p className="mb-1">First Name - {profileDetails.firstName}</p>
        <p className="mb-1">Last Name - {profileDetails.lastName}</p>
        <p className="mb-1">Profession - {profileDetails.profession}</p>
        <AddBalance updateProfile={updateProfile} />
      </TabPanel>
      <TabPanel>
        <PayContractor updateProfile={updateProfile} />
      </TabPanel>
    </Tabs>
  );
};

export default ProfileTabs;
