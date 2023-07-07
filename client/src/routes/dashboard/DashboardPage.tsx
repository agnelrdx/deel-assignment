import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET, POST } from 'utils/api';
import { Profile } from 'utils/types';
import Loader from 'components/Loader';
import ProfileTabs from 'components/ProfileTabs';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    const userId = sessionStorage.getItem('logged-in-user');
    if (!userId) {
      return navigate(`/`);
    }

    const clients = await GET('profiles?type=client');
    const selectedProfile = clients.find(
      (v: Profile) => String(v.id) === userId
    );
    setProfile(selectedProfile);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleClick = async () => {
    await POST('logout');
    sessionStorage.removeItem('logged-in-user');
    navigate(`/`);
  };

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
          <div>
            <span className={styles['header__balance']}>
              Balance: ${profile.balance.toFixed(2)}
            </span>
            <span
              className={styles['header__logout']}
              id="logout"
              aria-labelledby="logout"
              onClick={handleClick}
            >
              Logout
            </span>
          </div>
        </div>

        <ProfileTabs profileDetails={profile} updateProfile={setProfile} />
      </div>
    </div>
  );
};

export default DashboardPage;
