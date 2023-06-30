import { BrowserRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import DashboardPage from './DashboardPage';

fetchMock.enableMocks();

describe('DashboardPage', () => {
  beforeEach(() => {
    sessionStorage.setItem('logged-in-user', '1');
    jest.clearAllMocks();
  });

  it('should dashboardPage', async () => {
    (fetch as any).mockResponse(
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
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
