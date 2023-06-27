import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full flex-col">
      <h1 className="text-9xl text-white mb-5">404</h1>
      <p className="text-lg text-white mb-5">
        Page not found. Please try another route
      </p>
      <button type="button" onClick={() => navigate(-1)} className="w-36">
        Go back
      </button>
    </div>
  );
};

export default NotFoundPage;
