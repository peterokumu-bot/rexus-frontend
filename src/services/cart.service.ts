import api from '@/lib/api';

class CartService {
  async getCart(token: string) {
    const { data } = await api.get('/orders/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  }

  async addItem(
    token: string,
    productId: string,
    quantity = 1,
  ) {
    return api.post(
      '/orders/cart/add',
      {
        productId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  async updateItem(
    token: string,
    cartItemId: string,
    quantity: number,
  ) {
    return api.patch(
      `/orders/cart/${cartItemId}`,
      {
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  async clearCart(token: string) {
    return api.delete('/orders/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

const cartService = new CartService();

export default cartService;