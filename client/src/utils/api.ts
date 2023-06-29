interface PostArgs {
  data?: Record<string, any>;
}

const handleRequest = async (url: string, requestInit: RequestInit) => {
  try {
    const response = await fetch(url, requestInit);

    if (response.status === 401) {
      sessionStorage.removeItem('logged-in-user');
      return window.location.replace('/');
    }

    if (!response.ok) return null;

    const json = await response.json();

    return json;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const GET = (path: string) => {
  return handleRequest(`http://localhost:3001/${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
  });
};

export const POST = (path: string, options?: PostArgs) => {
  const data = options?.data || undefined;

  return handleRequest(`http://localhost:3001/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  });
};
