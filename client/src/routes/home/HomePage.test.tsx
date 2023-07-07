import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fetchMock, { FetchMock } from 'jest-fetch-mock';
import selectEvent from 'react-select-event';
import HomePage from './HomePage';

fetchMock.enableMocks();

describe('Homepage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders homepage', async () => {
    (fetch as FetchMock).mockResponse(
      JSON.stringify([
        {
          firstName: 'agnel',
          lastName: 'joseph',
        },
      ])
    );

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should not login without selecting the dropdown', async () => {
    (fetch as FetchMock).mockResponse(
      JSON.stringify([
        {
          firstName: 'agnel',
          lastName: 'joseph',
        },
      ])
    );

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.location.href).not.toEqual(`http://localhost/dashboard`);
    });
  });

  it('should login after selecting the dropdown', async () => {
    (fetch as FetchMock).mockResponse(
      JSON.stringify([
        {
          firstName: 'agnel',
          lastName: 'joseph',
          id: '1',
        },
      ])
    );

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    await selectEvent.select(screen.getByRole('combobox'), ['agnel joseph']);
    fetchMock.resetMocks();
    (fetch as FetchMock).mockResponseOnce(JSON.stringify({ status: true }));
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.location.href).toEqual(`http://localhost/dashboard`);
    });
  });
});
