export interface SupportMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  isRead: boolean;
}

export interface SupportTicket {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  messages: SupportMessage[];
  createdAt: Date;
  updatedAt: Date;
}

class SupportService {
  private tickets: SupportTicket[] = [];
  private currentTicket: SupportTicket | null = null;

  // Создать новый тикет поддержки
  createSupportTicket(title: string, initialMessage: string): SupportTicket {
    const ticket: SupportTicket = {
      id: Date.now().toString(),
      title,
      status: 'open',
      priority: 'medium',
      messages: [
        {
          id: Date.now().toString(),
          text: initialMessage,
          sender: 'user',
          timestamp: new Date(),
          isRead: true,
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tickets.push(ticket);
    this.currentTicket = ticket;

    // Автоматический ответ поддержки
    setTimeout(() => {
      this.addSupportMessage(ticket.id, 'Здравствуйте! Спасибо за обращение. Мы получили ваше сообщение и скоро с вами свяжемся. Среднее время ответа: 5-10 минут.');
    }, 2000);

    return ticket;
  }

  // Добавить сообщение от поддержки
  addSupportMessage(ticketId: string, message: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      const supportMessage: SupportMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'support',
        timestamp: new Date(),
        isRead: false,
      };

      ticket.messages.push(supportMessage);
      ticket.updatedAt = new Date();
      ticket.status = 'in_progress';
    }
  }

  // Добавить сообщение от пользователя
  addUserMessage(ticketId: string, message: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      const userMessage: SupportMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        isRead: true,
      };

      ticket.messages.push(userMessage);
      ticket.updatedAt = new Date();
    }
  }

  // Получить текущий тикет
  getCurrentTicket(): SupportTicket | null {
    return this.currentTicket;
  }

  // Получить все тикеты
  getAllTickets(): SupportTicket[] {
    return this.tickets;
  }

  // Отметить сообщения как прочитанные
  markMessagesAsRead(ticketId: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.messages.forEach(message => {
        if (message.sender === 'support') {
          message.isRead = true;
        }
      });
    }
  }

  // Закрыть тикет
  closeTicket(ticketId: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'resolved';
      ticket.updatedAt = new Date();
    }
  }

  // Быстрые вопросы для поддержки
  getQuickQuestions(): string[] {
    return [
      'Проблемы с входом в аккаунт',
      'Вопросы по оплате',
      'Проблемы с заказом поездки',
      'Технические неполадки',
      'Вопросы по регистрации водителя',
      'Другое'
    ];
  }

  // Симуляция ответов поддержки
  simulateSupportResponse(ticketId: string, userMessage: string): void {
    setTimeout(() => {
      let response = '';
      
      if (userMessage.toLowerCase().includes('вход') || userMessage.toLowerCase().includes('логин')) {
        response = 'Для решения проблем со входом попробуйте:\n1. Проверить правильность email и пароля\n2. Использовать функцию "Забыли пароль?"\n3. Очистить кэш приложения\n\nЕсли проблема сохраняется, сообщите нам ваш email.';
      } else if (userMessage.toLowerCase().includes('оплата') || userMessage.toLowerCase().includes('платеж')) {
        response = 'По вопросам оплаты:\n1. Проверьте привязанную карту в настройках\n2. Убедитесь в наличии средств на счету\n3. Проверьте интернет-соединение\n\nМы также принимаем наличные. Нужна дополнительная помощь?';
      } else if (userMessage.toLowerCase().includes('заказ') || userMessage.toLowerCase().includes('поездка')) {
        response = 'Проблемы с заказом поездки:\n1. Проверьте GPS и разрешения геолокации\n2. Убедитесь в правильности адресов\n3. Попробуйте перезапустить приложение\n\nМожете также позвонить напрямую водителю через приложение.';
      } else if (userMessage.toLowerCase().includes('регистрация') || userMessage.toLowerCase().includes('водитель')) {
        response = 'Для регистрации водителя необходимо:\n1. Заполнить все поля анкеты\n2. Загрузить документы (права, техпаспорт)\n3. Пройти проверку (1-2 рабочих дня)\n\nПосле одобрения вы получите уведомление и сможете начать работу.';
      } else {
        response = 'Спасибо за ваше сообщение! Наш специалист изучает ваш вопрос и скоро предоставит подробный ответ. \n\nВремя работы поддержки: 24/7\nСреднее время ответа: 5-10 минут';
      }

      this.addSupportMessage(ticketId, response);
    }, Math.random() * 3000 + 2000); // 2-5 секунд задержка
  }
}

export const supportService = new SupportService(); 