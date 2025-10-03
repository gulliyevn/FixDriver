import APIClient from "./APIClient";

export interface Card {
  id: string;
  type: "card";
  last4: string;
  brand: "Visa" | "Mastercard" | "American Express";
  isDefault: boolean;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
}

export const CardService = {
  async getCards(userId: string): Promise<Card[]> {
    try {
      const response = await APIClient.get<Card[]>(`/cards/user/${userId}`);
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  },

  async addCard(
    cardData: Omit<Card, "id">,
    userId: string,
  ): Promise<Card | null> {
    try {
      const response = await APIClient.post<Card>("/cards", {
        ...cardData,
        userId,
      });
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  },

  async updateCard(
    cardId: string,
    updates: Partial<Card>,
  ): Promise<Card | null> {
    try {
      const response = await APIClient.put<Card>(`/cards/${cardId}`, updates);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  },

  async deleteCard(cardId: string): Promise<boolean> {
    try {
      const response = await APIClient.delete<{ success: boolean }>(
        `/cards/${cardId}`,
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  },

  async setDefault(cardId: string, userId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(
        `/cards/${cardId}/default`,
        { userId },
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  },
};
