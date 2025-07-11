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
    // padding убираем отсюда
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
  chooseBtn: {
    borderRadius: 16,
    marginTop: 8,
    paddingVertical: 18,
  },
  chooseBtnClient: {
    backgroundColor: '#22C55E',
  },
  chooseBtnDriver: {
    backgroundColor: '#23408E',
  },
  chooseBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16, // увеличиваю отступ
  },
  loginText: {
    color: '#23408E',
    fontSize: 16,
  },
  loginLink: {
    textDecorationLine: 'underline',
    color: '#23408E',
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 8,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
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
  headerLogo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIconWrap: {
    backgroundColor: '#E6F9ED',
    borderRadius: 48,
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    // для MaterialCommunityIcons size 56
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconWrap: {
    backgroundColor: '#F0FDF4',
    borderRadius: 40,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardIconWrapDriver: {
    backgroundColor: '#EEF2FF',
  },
  cardIcon: {
    // для Ionicons/MaterialCommunityIcons size 40
  },
  cardContent: {
    marginBottom: 16,
  },
  langBtnWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  langBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  loginRow: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  spacerTop: {
    height: 32,
  },
  spacerLogoBottom: {
    height: 12,
  },
  spacerLoginLang: {
    height: 16,
  },
  spacerBottom: {
    minHeight: 40,
  },
}); 