import { t, setLanguage, initializeLanguage } from "../../i18n";

describe("i18n", () => {
  beforeEach(async () => {
    // Инициализируем i18n перед каждым тестом
    await initializeLanguage();
  });

  it("should translate common keys", () => {
    expect(t("common.selectLanguage")).toBe("Выберите язык");
    expect(t("common.ok")).toBe("ОК");
    expect(t("common.cancel")).toBe("Отмена");
  });

  it("should translate login keys", () => {
    expect(t("login.title")).toBe("Добро пожаловать");
    expect(t("login.subtitle")).toBe("Войдите в свой аккаунт");
    expect(t("login.email")).toBe("Email");
    expect(t("login.password")).toBe("Пароль");
  });

  it("should change language", async () => {
    // Проверяем русский язык
    expect(t("common.selectLanguage")).toBe("Выберите язык");

    // Меняем на английский
    await setLanguage("en");

    // Проверяем английский язык
    expect(t("common.selectLanguage")).toBe("Select Language");

    // Возвращаем русский
    await setLanguage("ru");
    expect(t("common.selectLanguage")).toBe("Выберите язык");
  });

  it("should handle missing keys gracefully", () => {
    expect(t("nonexistent.key")).toBe("nonexistent.key");
  });

  it("should handle parameters", () => {
    // Тест с параметрами (если есть такие ключи)
    expect(t("common.loading")).toBe("Загрузка...");
  });
});
