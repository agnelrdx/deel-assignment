import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fetchMock, { FetchMock } from 'jest-fetch-mock';
import selectEvent from 'react-select-event';
import DashboardPage from './DashboardPage';

fetchMock.enableMocks();

describe('DashboardPage', () => {
  beforeEach(() => {
    sessionStorage.setItem('logged-in-user', '1');
    jest.clearAllMocks();
  });

  it('should dashboardPage', async () => {
    (fetch as FetchMock).mockResponse(
      JSON.stringify([
        {
          id: 1,
          firstName: 'agnel',
          lastName: 'joseph',
          balance: 199,
          profession: 'engineer',
        },
      ])
    );

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should logout the user when logout button is clicked', async () => {
    (fetch as FetchMock).mockResponse(
      JSON.stringify([
        {
          id: 1,
          firstName: 'agnel',
          lastName: 'joseph',
          balance: 199,
          profession: 'engineer',
        },
      ])
    );

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    const logoutButton = await screen.findByLabelText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(window.location.href).toEqual(`http://localhost/`);
    });
  });

  it('should not topup balance if nothing is topup dropdown is not selected', async () => {
    (fetch as FetchMock).mockResponse(
      JSON.stringify([
        {
          id: 1,
          firstName: 'agnel',
          lastName: 'joseph',
          balance: 199,
          profession: 'engineer',
        },
      ])
    );

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    const button = await screen.findByRole('button', {
      name: 'Add Balance',
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.fetch).toBeCalledTimes(1); // It should only call for the 1st GET request
    });
  });

  it('should topup balance topup dropdown is selected', async () => {
    (fetch as FetchMock).mockResponse(
      JSON.stringify([
        {
          id: 1,
          firstName: 'agnel',
          lastName: 'joseph',
          balance: 199,
          profession: 'engineer',
        },
      ])
    );

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    const button = await screen.findByRole('button', {
      name: 'Add Balance',
    });
    await selectEvent.select(screen.getByRole('combobox'), ['5']);
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.fetch).toBeCalledTimes(2); // It should twice, 1st GET + POST
    });
  });

  it('should display work performed by contractors', async () => {
    (fetch as FetchMock).mockResponse(
      JSON.stringify([
        {
          id: 1,
          firstName: 'agnel',
          lastName: 'joseph',
          balance: 199,
          profession: 'engineer',
        },
      ])
    );

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    fetchMock.resetMocks();
    (fetch as FetchMock).mockResponseOnce(
      JSON.stringify([
        {
          'id': 5,
          'firstName': 'John',
          'lastName': 'Lenon',
          'profession': 'Musician',
          'balance': 64,
          'type': 'contractor',
          'createdAt': '2023-06-29T22:00:17.988Z',
          'updatedAt': '2023-06-29T22:00:17.988Z',
        },
        {
          'id': 6,
          'firstName': 'Linus',
          'lastName': 'Torvalds',
          'profession': 'Programmer',
          'balance': 1214,
          'type': 'contractor',
          'createdAt': '2023-06-29T22:00:17.989Z',
          'updatedAt': '2023-06-29T22:00:17.989Z',
        },
      ])
    );

    const tab1 = screen.getByRole('tab', {
      name: 'Contractor',
    });
    fireEvent.click(tab1);

    const combobox = await screen.findByRole('combobox');

    fetchMock.resetMocks();
    (fetch as FetchMock).mockResponseOnce(
      JSON.stringify([
        {
          'id': 2,
          'description': 'work',
          'price': 201,
          'paid': null,
          'paymentDate': null,
          'createdAt': '2023-06-29T22:00:17.989Z',
          'updatedAt': '2023-06-29T22:00:17.989Z',
          'ContractId': 2,
        },
        {
          'id': 3,
          'description': 'work',
          'price': 202,
          'paid': null,
          'paymentDate': null,
          'createdAt': '2023-06-29T22:00:17.989Z',
          'updatedAt': '2023-06-29T22:00:17.989Z',
          'ContractId': 3,
        },
        {
          'id': 7,
          'description': 'work',
          'price': 200,
          'paid': true,
          'paymentDate': '2020-08-15T19:11:26.737Z',
          'createdAt': '2023-06-29T22:00:17.989Z',
          'updatedAt': '2023-06-29T22:00:17.989Z',
          'ContractId': 2,
        },
      ])
    );

    await selectEvent.select(combobox, ['John Lenon']);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });
  });

  it('should display error message when a payment exceeds balance', async () => {
    (fetch as FetchMock).mockResponse(
      JSON.stringify([
        {
          id: 1,
          firstName: 'agnel',
          lastName: 'joseph',
          balance: 10,
          profession: 'engineer',
        },
      ])
    );

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    fetchMock.resetMocks();
    (fetch as FetchMock).mockResponseOnce(
      JSON.stringify([
        {
          'id': 5,
          'firstName': 'John',
          'lastName': 'Lenon',
          'profession': 'Musician',
          'balance': 64,
          'type': 'contractor',
          'createdAt': '2023-06-29T22:00:17.988Z',
          'updatedAt': '2023-06-29T22:00:17.988Z',
        },
        {
          'id': 6,
          'firstName': 'Linus',
          'lastName': 'Torvalds',
          'profession': 'Programmer',
          'balance': 1214,
          'type': 'contractor',
          'createdAt': '2023-06-29T22:00:17.989Z',
          'updatedAt': '2023-06-29T22:00:17.989Z',
        },
      ])
    );

    const tab1 = screen.getByRole('tab', {
      name: 'Contractor',
    });
    fireEvent.click(tab1);

    const combobox = await screen.findByRole('combobox');

    fetchMock.resetMocks();
    (fetch as FetchMock).mockResponseOnce(
      JSON.stringify([
        {
          'id': 2,
          'description': 'work',
          'price': 201,
          'paid': null,
          'paymentDate': null,
          'createdAt': '2023-06-29T22:00:17.989Z',
          'updatedAt': '2023-06-29T22:00:17.989Z',
          'ContractId': 2,
        },
        {
          'id': 3,
          'description': 'work',
          'price': 202,
          'paid': null,
          'paymentDate': null,
          'createdAt': '2023-06-29T22:00:17.989Z',
          'updatedAt': '2023-06-29T22:00:17.989Z',
          'ContractId': 3,
        },
        {
          'id': 7,
          'description': 'work',
          'price': 200,
          'paid': true,
          'paymentDate': '2020-08-15T19:11:26.737Z',
          'createdAt': '2023-06-29T22:00:17.989Z',
          'updatedAt': '2023-06-29T22:00:17.989Z',
          'ContractId': 2,
        },
      ])
    );

    await selectEvent.select(combobox, ['John Lenon']);

    fetchMock.resetMocks();
    (fetch as FetchMock).mockResponseOnce('*', { status: 400 });

    const [payButton] = await screen.findAllByRole('button', {
      name: 'Pay',
    });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(screen.getByText('Insufficient balance.')).toBeInTheDocument();
    });
  });
});
