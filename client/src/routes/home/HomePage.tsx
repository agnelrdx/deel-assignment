import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import logo from 'assets/images/react.svg';
import { GET } from 'utils/api';
import styles from './HomePage.module.css';

type Dropdown = {
  value: string;
  label: string;
};

type Client = {
  id: string;
  firstName: string;
  lastName: string;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<Dropdown | null>(null);
  const [options, setOptions] = useState<Dropdown[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDropdown = async () => {
    setLoading(true);
    const clients = await GET('clients');
    const dropdownOptions = clients.map((client: Client) => ({
      value: client.id,
      label: `${client.firstName} ${client.lastName}`,
    }));
    setOptions(dropdownOptions);
    setLoading(false);
  };

  useEffect(() => {
    fetchDropdown();
  }, []);

  const handleClick = () => {
    setError(false);
    if (!selectedClient) return setError(true);

    navigate(`/dashboard/${selectedClient.value}`);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className={`${styles.login} flex flex-col items-center`}>
        <img src={logo} alt="logo" className={styles.login__logo} />
        <Select
          placeholder="Select a client"
          onChange={(value) => setSelectedClient(value)}
          options={options}
          className={styles.login__select}
          isLoading={loading}
          styles={{
            control: (styles) => ({
              ...styles,
              borderColor: error ? '#90323d' : '#cccccc',
            }),
            option: (styles) => ({
              ...styles,
              color: '#494949',
            }),
          }}
        />
        <button
          onClick={handleClick}
          type="button"
          className={styles.login__button}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default HomePage;
