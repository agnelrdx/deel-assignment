import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AddBalance from 'components/AddBalance';
import styles from 'assets/css/tabs.module.css';

interface ProfileTabsProps {
  profileDetails: {
    id: string;
    firstName: string;
    lastName: string;
    balance: number;
    profession: string;
  };
}

const ProfileTabs = ({ profileDetails }: ProfileTabsProps) => {
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
        <AddBalance />
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
      </TabPanel>
    </Tabs>
  );
};

export default ProfileTabs;
