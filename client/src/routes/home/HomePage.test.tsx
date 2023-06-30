import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import HomePage from './HomePage';

fetchMock.enableMocks();

describe('Homepage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders homepage', async () => {
    (fetch as any).mockResponse(
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
    (fetch as any).mockResponse(
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
      expect(window.location.href).not.toEqual(`/dashboard`);
    });
  });
});
