const BASE_URL = 'https://mate.academy/students-api';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
};

function wait(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod,
  data?: unknown,
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: DEFAULT_HEADERS,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return wait(100)
    .then(() => fetch(BASE_URL + url, options))
    .then(handleResponse);
}

export const client = {
  get<T>(url: string) {
    return request<T>(url, 'GET');
  },
  post<T>(url: string, data: unknown) {
    return request<T>(url, 'POST', data);
  },
  patch<T>(url: string, data: unknown) {
    return request<T>(url, 'PATCH', data);
  },
  delete<T>(url: string) {
    return request<T>(url, 'DELETE');
  },
};
