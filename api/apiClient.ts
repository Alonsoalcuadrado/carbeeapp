const BASE_URL = "/api/";

export type LoginRequestBody = {
  username: string
  password: string
}

export type Cursor = string;


async function fetchAPI(endpoint: string, { method = 'GET', body = undefined, headers = {} } = {}) {
    const response = await fetch(BASE_URL + endpoint, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'An error occurred');
    }

    return response.json();
}

export default fetchAPI;

export function loginUser(params: LoginRequestBody): Promise<LoginResponse> {
  return fetchAPI('api/auth', {
      method: 'POST',
      body: params,
  });
}

export function fetchAppointments(params: { size: number; before?: Cursor; after?: Cursor }): Promise<AppointmentConnection> {
  const query = new URLSearchParams(params as any).toString();
  return fetchAPI(`api/appointments?${query}`, {
      headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
  });
}

export function fetchAppointmentTimeAvailability(date: string): Promise<string[]> {
  return fetchAPI(`api/availability/${date}`, {
      headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
  });
}
