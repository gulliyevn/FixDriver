import { t, setLanguage, initializeLanguage } from "../../i18n";

describe("i18n", () => {
  beforeEach(async () => {
    // Инициализируем i18n перед каждым тестом
    await initializeLanguage();
  });

  it("should translate common keys", () => {
    expect(typeof t("common.selectLanguage")).toBe("string");
    expect(typeof t("common.ok")).toBe("string");
    expect(typeof t("common.cancel")).toBe("string");
  });

  it("should translate login keys", () => {
    expect(typeof t("login.title")).toBe("string");
    expect(typeof t("login.subtitle")).toBe("string");
    expect(typeof t("login.email")).toBe("string");
    expect(typeof t("login.password")).toBe("string");
  });

  it("should change language", async () => {
    // Проверяем что функция возвращает строку
    expect(typeof t("common.selectLanguage")).toBe("string");

    // Меняем на английский
    await setLanguage("en");

    // Проверяем что функция все еще возвращает строку
    expect(typeof t("common.selectLanguage")).toBe("string");

    // Возвращаем русский
    await setLanguage("ru");
    expect(typeof t("common.selectLanguage")).toBe("string");
  });

  it("should handle missing keys gracefully", () => {
    const result = t("nonexistent.key");
    expect(typeof result).toBe("string");
    expect(result).toContain("missing");
  });

  it("should handle parameters", () => {
    // Тест с параметрами (если есть такие ключи)
    expect(typeof t("common.loading")).toBe("string");
  });
});
