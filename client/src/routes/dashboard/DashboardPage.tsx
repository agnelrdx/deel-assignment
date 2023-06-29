import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET } from 'utils/api';
import Loader from 'components/Loader';
import ProfileTabs from 'components/ProfileTabs';
import styles from './DashboardPage.module.css';

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  balance: number;
  profession: string;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    const clients = await GET('profile');

    if (!clients) {
      sessionStorage.removeItem('logged-in');
      return navigate(`/`);
    }

    setProfile(clients);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex items-center justify-center h-full">
      <div className={styles.profile}>
        <div className={styles.header}>
          <span>Good day!!</span>
          <span className={styles['header__balance']}>
            Balance: ${profile.balance}
          </span>
        </div>

        <ProfileTabs profileDetails={profile} />
      </div>
    </div>
  );
};

export default DashboardPage;
