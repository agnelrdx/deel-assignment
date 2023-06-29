import { useState } from 'react';
import Select from 'react-select';
import { POST } from 'utils/api';
import { Profile } from 'utils/types';
import styles from 'assets/css/addBalance.module.css';

type Dropdown = {
  value: number;
  label: string;
};

interface AddBalanceProps {
  updateProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const options = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '5',
    value: 5,
  },
  {
    label: '10',
    value: 10,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '100',
    value: 100,
  },
  {
    label: '500',
    value: 500,
  },
];

const AddBalance = ({ updateProfile }: AddBalanceProps) => {
  const [selectedBalance, setSelectedBalance] = useState<Dropdown | null>(null);
  const [error, setError] = useState(false);
  const [addBalanceError, setAddBalanceError] = useState(false);

  const handleClick = async () => {
    setError(false);
    setAddBalanceError(false);
    if (!selectedBalance) return setError(true);

    const userId = sessionStorage.getItem('logged-in-user');
    const res = await POST(`balances/deposit/${userId}`, {
      data: { amount: selectedBalance.value },
    });

    if (!res) return setAddBalanceError(true);

    setSelectedBalance(null);
    updateProfile((preValue) => ({
      ...preValue!,
      balance: preValue!.balance + selectedBalance.value,
    }));
  };

  return (
    <div className={styles['add-balance']}>
      <Select
        placeholder="Select amount to topup client balance"
        onChange={(value) => setSelectedBalance(value)}
        options={options}
        value={selectedBalance}
        isSearchable={false}
        className="mb-3"
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
      <button className="w-full" type="button" onClick={handleClick}>
        Add Balance
      </button>
      {addBalanceError && (
        <div className="alert__error">
          You cannot deposit more than 25% of total jobs to pay.
        </div>
      )}
    </div>
  );
};

export default AddBalance;
