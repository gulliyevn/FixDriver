// WebSocket сервис для real-time коммуникации
import { ENV_CONFIG } from "../config/environment";
import JWTService from "./JWTService";

// Типы для WebSocket
interface WebSocketType {
  close(code?: number, reason?: string): void;
  readyState: number;
  send(data: string): void;
  onopen: ((event: Event) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onclose: ((event: CloseEventType) => void) | null;
}

interface CloseEventType {
  code: number;
  reason: string;
  wasClean: boolean;
}

interface NodeJSTimeout {
  ref(): NodeJSTimeout;
  unref(): NodeJSTimeout;
  refresh(): NodeJSTimeout;
}

export interface WebSocketMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
  messageId: string;
}

export interface WebSocketEventHandlers {
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onClose?: (event: CloseEventType) => void;
  onOpen?: (event: Event) => void;
  onReconnect?: () => void;
}

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocketType | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000; // 1 секунда
  private isConnecting = false;
  private messageQueue: WebSocketMessage[] = [];
  private eventHandlers: WebSocketEventHandlers = {};
  private heartbeatInterval: NodeJSTimeout | null = null;
  private isAuthenticated = false;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Подключение к WebSocket серверу
   */
  async connect(handlers: WebSocketEventHandlers = {}): Promise<void> {
    if (this.ws?.readyState === 1) { // WebSocket.OPEN = 1
      return;
    }

    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.eventHandlers = handlers;

    try {
      const token = await JWTService.getAccessToken();
      if (!token) {
        throw new Error("Нет токена для аутентификации WebSocket");
      }

      // Строим URL для WebSocket
      const wsUrl = this.buildWebSocketUrl(token);

      type WebSocketCtor = new (url: string) => unknown;
      const WS = (global as unknown as { WebSocket?: WebSocketCtor }).WebSocket;
      if (!WS) {
        throw new Error("WebSocket не доступен в глобальной среде");
      }
      this.ws = new WS(wsUrl) as unknown as WebSocketType;
      this.setupEventListeners();
    } catch (error) {
      console.error("Ошибка подключения к WebSocket:", error);
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Построение URL для WebSocket соединения
   */
  private buildWebSocketUrl(token: string): string {
    const baseUrl = ENV_CONFIG.API.BASE_URL.replace("http://", "ws://").replace(
      "https://",
      "wss://",
    );

    return `${baseUrl}/ws?token=${encodeURIComponent(token)}`;
  }

  /**
   * Настройка обработчиков событий WebSocket
   */
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.isAuthenticated = true;

      // Отправляем очередь сообщений
      this.flushMessageQueue();

      // Запускаем heartbeat
      this.startHeartbeat();

      this.eventHandlers.onOpen?.(event);
      this.eventHandlers.onReconnect?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        // Обрабатываем системные сообщения
        if (message.type === "heartbeat") {
          this.handleHeartbeat();
          return;
        }

        if (message.type === "auth_success") {
          this.isAuthenticated = true;

          return;
        }

        if (message.type === "auth_error") {
          this.isAuthenticated = false;
          console.error("WebSocket аутентификация неуспешна");
          this.disconnect();
          return;
        }

        // Передаем сообщение обработчику
        this.eventHandlers.onMessage?.(message);
      } catch (error) {
        console.error("Ошибка парсинга WebSocket сообщения:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
      this.isConnecting = false;
      this.eventHandlers.onError?.(error);
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket отключен:", event.code, event.reason);
      this.isConnecting = false;
      this.isAuthenticated = false;
      this.stopHeartbeat();

      this.eventHandlers.onClose?.(event);

      // Автоматическое переподключение
      if (
        !event.wasClean &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.scheduleReconnect();
      }
    };
  }

  /**
   * Отправка сообщения через WebSocket
   */
  sendMessage(type: string, data: Record<string, unknown>): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
      messageId: this.generateMessageId(),
    };

    if (this.ws?.readyState === 1 && this.isAuthenticated) { // WebSocket.OPEN = 1
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error("Ошибка отправки WebSocket сообщения:", error);
        this.messageQueue.push(message);
      }
    } else {
      // Добавляем в очередь если не подключены
      this.messageQueue.push(message);
    }
  }

  /**
   * Отправка очереди сообщений
   */
  private flushMessageQueue(): void {
    while (
      this.messageQueue.length > 0 &&
      this.ws?.readyState === 1 // WebSocket.OPEN = 1
    ) {
      const message = this.messageQueue.shift();
      if (message) {
        try {
          this.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error("Ошибка отправки сообщения из очереди:", error);
          this.messageQueue.unshift(message); // Возвращаем обратно
          break;
        }
      }
    }
  }

  /**
   * Отключение от WebSocket
   */
  disconnect(): void {
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, "Клиент отключился");
      this.ws = null;
    }

    this.isAuthenticated = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  /**
   * Запуск heartbeat для поддержания соединения
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === 1) { // WebSocket.OPEN = 1
        this.sendMessage("heartbeat", { timestamp: Date.now() });
      }
    }, 30000); // Каждые 30 секунд
  }

  /**
   * Остановка heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval as unknown as number);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Обработка heartbeat ответа
   */
  private handleHeartbeat(): void {
    // Обновляем время последнего heartbeat
    // Можно добавить логику для мониторинга соединения
  }

  /**
   * Планирование переподключения
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay =
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Переподключение WebSocket через ${delay}ms (попытка ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    );

    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect(this.eventHandlers);
      }
    }, delay);
  }

  /**
   * Генерация уникального ID сообщения
   */
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Получение статуса соединения
   */
  getConnectionStatus(): {
    isConnected: boolean;
    isConnecting: boolean;
    isAuthenticated: boolean;
    reconnectAttempts: number;
  } {
    return {
      isConnected: this.ws?.readyState === 1, // WebSocket.OPEN = 1
      isConnecting: this.isConnecting,
      isAuthenticated: this.isAuthenticated,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Проверка готовности к отправке сообщений
   */
  isReady(): boolean {
    return this.ws?.readyState === 1 && this.isAuthenticated; // WebSocket.OPEN = 1
  }
}

export default WebSocketService.getInstance();
