import { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { GET, POST } from 'utils/api';
import { Profile, Job } from 'utils/types';
import styles from 'assets/css/payContractor.module.css';

type Dropdown = {
  value: number;
  label: string;
};

interface PayContractorProps {
  updateProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const PayContractor = ({ updateProfile }: PayContractorProps) => {
  const [options, setOptions] = useState<Dropdown[]>([]);
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState(false);

  const fetchContractors = async () => {
    const contractorList = await GET('profiles?type=contractor');
    const dropdownOptions = contractorList.map((v: Profile) => ({
      value: v.id,
      label: `${v.firstName} ${v.lastName}`,
    }));
    setOptions(dropdownOptions);
  };

  const handleChange = async (value: SingleValue<Dropdown>) => {
    const jobList = await GET(`jobs?contractorId=${value?.value}`);
    setJobs(jobList);
  };

  const handleClick = async (id: string, price: number) => {
    setError(false);
    const res = await POST(`jobs/${id}/pay`);

    if (!res) return setError(true);

    const jobsMapped = jobs!.map((v: Job) => ({
      ...v,
      paid: v.id === id ? true : v.paid,
    }));
    setJobs(jobsMapped);
    updateProfile((preValue) => ({
      ...preValue!,
      balance: preValue!.balance - price,
    }));
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  return (
    <div className={styles['pay-contractor']}>
      <Select
        placeholder="Select amount to topup client balance"
        onChange={(value) => handleChange(value)}
        options={options}
        className="mb-3"
        styles={{
          option: (styles) => ({
            ...styles,
            color: '#494949',
          }),
        }}
      />
      {jobs && (
        <table className={styles['pay-contractor__table']}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Created At</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((v, k) => (
              <tr key={k}>
                <td>{v.description}</td>
                <td>{v.createdAt.split('T')[0]}</td>
                <td>${v.price}</td>
                <td>
                  {v.paid ? (
                    '-'
                  ) : (
                    <button
                      type="button"
                      className={styles['pay-contractor__pay']}
                      onClick={() => handleClick(v.id, v.price)}
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td className="text-center" colSpan={5}>
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {error && <div className="alert__error">Insufficient balance.</div>}
    </div>
  );
};

export default PayContractor;
