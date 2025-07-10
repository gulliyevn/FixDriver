import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const RoleSelectScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  containerDark: {
    backgroundColor: colors.dark.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32, // ещё больше отступы по бокам
    paddingTop: 60, // уменьшаю немного верхний отступ
    paddingBottom: 16, // увеличиваю нижний отступ
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24, // увеличиваю радиус скругления
    padding: 24, // увеличиваю внутренние отступы
    marginBottom: 20, // увеличиваю отступ между карточками
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 }, // увеличиваю тень
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)', // тонкая граница
  },
  cardDark: {
    backgroundColor: colors.dark.card,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardClient: {
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E', // зелёная полоска слева
  },
  cardDriver: {
    borderLeftWidth: 4,
    borderLeftColor: '#23408E', // синяя полоска слева
  },
  cardTitle: {
    fontSize: 28, // увеличиваю размер заголовка
    fontWeight: '800', // делаю жирнее
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12, // увеличиваю отступ
  },
  cardTitleDark: {
    color: colors.dark.text,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24, // увеличиваю отступ
    lineHeight: 22, // добавляю межстрочный интервал
  },
  benefitsList: {
    marginBottom: 24, // увеличиваю отступ
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // увеличиваю отступ между пунктами
    paddingHorizontal: 8, // добавляю горизонтальные отступы
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12, // увеличиваю отступ от иконки
    fontWeight: '500', // делаю текст чуть жирнее
  },
  driverIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, // увеличиваю отступ
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(35, 64, 142, 0.1)', // фон для иконки водителя
  },
  chooseBtnClient: {
    backgroundColor: '#22C55E',
    borderRadius: 16, // увеличиваю радиус
    marginTop: 24, // увеличиваю отступ
    paddingVertical: 18, // увеличиваю высоту кнопки
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chooseBtnDriver: {
    backgroundColor: '#23408E',
    borderRadius: 16,
    marginTop: 24,
    paddingVertical: 18,
    shadowColor: '#23408E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chooseBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700', // делаю жирнее
  },
  loginWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16, // увеличиваю отступ
  },
  loginText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLink: {
    color: '#23408E',
    fontWeight: '700',
  },
  langWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16, // увеличиваю отступ
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // делаю фон светлее
    borderRadius: 24, // увеличиваю радиус
    paddingHorizontal: 20, // увеличиваю отступы
    paddingVertical: 12, // увеличиваю отступы
    borderWidth: 1,
    borderColor: '#E2E8F0', // добавляю границу
  },
  langBtnText: {
    fontSize: 16,
    color: '#23408E',
    marginLeft: 8,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8, // увеличиваю отступ
    marginTop: 20, // уменьшаю отступ сверху
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32, // увеличиваю размер заголовка
    fontWeight: '800', // делаю жирнее
    color: '#1F2937',
    marginBottom: 12, // увеличиваю отступ
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18, // увеличиваю размер подзаголовка
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24, // добавляю межстрочный интервал
  },
}); 