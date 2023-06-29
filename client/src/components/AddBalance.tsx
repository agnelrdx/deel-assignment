import { useState } from 'react';
import Select from 'react-select';
import styles from 'assets/css/addBalance.module.css';

type Dropdown = {
  value: number;
  label: string;
};

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

const AddBalance = () => {
  const [selectedBalance, setSelectedBalance] = useState<Dropdown | null>(null);
  const [error, setError] = useState(false);

  return (
    <div className={styles['add-balance']}>
      <Select
        placeholder="Select a client to add"
        onChange={(value) => setSelectedBalance(value)}
        options={options}
        className="mb-3"
        inputValue={undefined}
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
      <button className="w-full" type="button">
        Add Balance
      </button>
    </div>
  );
};

export default AddBalance;
