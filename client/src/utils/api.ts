const handleRequest = async (url: string, requestInit: RequestInit) => {
  try {
    const response = await fetch(url, requestInit);

    const json = await response.json();

    if (!response.ok) return null;

    return json;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const GET = (path: string) => {
  return handleRequest(`http://localhost:3001/${path}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
};
