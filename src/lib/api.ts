const getBaseUrl = () => {
  return '';
};

async function request(path: string, options: RequestInit = {}) {
  const url = new URL(path, getBaseUrl()).toString();
  const opts: RequestInit = {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  };

  const response = await fetch(url, opts);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText;
    throw new Error(message || 'Request failed');
  }

  return data;
}

export async function getMe() {
  return request('me');
}

export async function getWallet() {
  return request('wallet');
}

export async function topupWallet(amount: number, method: string) {
  return request('wallet', {
    method: 'POST',
    body: JSON.stringify({ amount, method }),
  });
}

export async function getSlots() {
  return request('slots');
}

export async function addSlots(slots: number) {
  return request('slots', {
    method: 'POST',
    body: JSON.stringify({ slots }),
  });
}

export type NewOrderPayload = {
  service: string;
  price: number;
  filename?: string;
  fileSize?: number;
};

export async function getOrders() {
  return request('orders');
}

export async function createOrder(payload: NewOrderPayload) {
  return request('orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateOrder(orderId: string, updates: Record<string, any>) {
  return request(`orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteOrder(orderId: string) {
  return request(`orders/${orderId}`, {
    method: 'DELETE',
  });
}

export async function getAdminStats() {
  return request('admin/stats');
}

export async function getAdminUsers() {
  return request('admin/users');
}

export async function adminAddWallet(userId: number, amount: number) {
  return request(`admin/users/${userId}/wallet`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export async function adminAddSlots(userId: number, slots: number) {
  return request(`admin/users/${userId}/slots`, {
    method: 'POST',
    body: JSON.stringify({ slots }),
  });
}

export async function getAdminOrders() {
  return request('admin/orders');
}
