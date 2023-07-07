import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders notFoundPage', async () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: '404',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Page not found. Please try another route')
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should navigate back when the button is clicked', async () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.location.href).toEqual(`http://localhost/`);
    });
  });
});
