import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './ScheduleContainer.styles';
import { DistanceCalculationService } from '../../../../services/DistanceCalculationService';
import { RoutePoint } from '../../../../components/MapView/types/map.types';

interface ScheduleContainerProps {
  fromAddress: string;
  borderColor: string;
  colors: any;
  t: (key: string) => string;
  isLast: boolean;
  // Время по дням для данного контейнера (ключи: mon..sun), формат HH:MM
  dayTimes?: Record<string, string>;
  // Коллбек сохранения выбранного времени
  onDayTimeChange?: (dayKey: string, time: string) => void;
  // Если передано, показываем только эти дни
  activeDays?: string[];
  // Фикс-режим: показываем один таймпикер, без кнопок дней
  fixedMode?: boolean;
  fixedTime?: string;
  onFixedTimeChange?: (time: string) => void;
  // Режим будни/выходные для фикс-режима
  weekdaysMode?: boolean;
  weekdayTime?: string;
  weekendTime?: string;
  onWeekdayTimeChange?: (time: string) => void;
  onWeekendTimeChange?: (time: string) => void;
  // Показывать ли дни внутри контейнера (только для плавных)
  showDays?: boolean;
  // Разрешить ли выбор времени в этом контейнере
  allowTimeSelection?: boolean;
  // Координаты для расчета времени (если не разрешен выбор времени)
  fromCoordinate?: { latitude: number; longitude: number };
  toCoordinate?: { latitude: number; longitude: number };
  // Время отправления для расчета ETA
  departureTime?: Date;
}

export const ScheduleContainer: React.FC<ScheduleContainerProps> = ({ 
  fromAddress, 
  borderColor, 
  colors, 
  t, 
  isLast,
  dayTimes = {},
  onDayTimeChange,
  activeDays,
  fixedMode = false,
  fixedTime,
  onFixedTimeChange,
  weekdaysMode = false,
  weekdayTime,
  weekendTime,
  onWeekdayTimeChange,
  onWeekendTimeChange,
  allowTimeSelection = true,
  fromCoordinate,
  toCoordinate,
  departureTime
}) => {
  const weekDays = [
    { key: 'mon', label: t('common.mon') },
    { key: 'tue', label: t('common.tue') },
    { key: 'wed', label: t('common.wed') },
    { key: 'thu', label: t('common.thu') },
    { key: 'fri', label: t('common.fri') },
    { key: 'sat', label: t('common.sat') },
    { key: 'sun', label: t('common.sun') },
  ];

  const visibleDays = useMemo(() => {
    // Иначе, если активные дни переданы сверху — применим их
    if (activeDays && activeDays.length > 0) {
      const set = new Set(activeDays);
      return weekDays.filter(d => set.has(d.key));
    }
    // По умолчанию — все дни
    return weekDays;
  }, [activeDays]);

  const [pickerState, setPickerState] = useState<{
    dayKey: string | null;
    date: Date;
    isVisible: boolean;
  }>({ dayKey: null, date: new Date(), isVisible: false });
  const [dayTempDate, setDayTempDate] = useState<Date>(new Date());
  const [localDayTimes, setLocalDayTimes] = useState<Record<string, string>>({});

  const openPickerForDay = (dayKey: string) => {
    // Открываем таймпикер, выбор дней контролируется сверху
    setPickerState({ dayKey, date: new Date(), isVisible: true });
    setDayTempDate(new Date());
  };

  const handleDayModalCancel = () => {
    setPickerState(prev => ({ ...prev, isVisible: false, dayKey: null }));
  };

  const handleDayModalConfirm = () => {
    if (!pickerState.dayKey) return;
    const hh = String(dayTempDate.getHours()).padStart(2, '0');
    const mm = String(dayTempDate.getMinutes()).padStart(2, '0');
    const formatted = `${hh}:${mm}`;
    onDayTimeChange && onDayTimeChange(pickerState.dayKey, formatted);
    setLocalDayTimes(prev => ({ ...prev, [pickerState.dayKey as string]: formatted }));
    setPickerState(prev => ({ ...prev, isVisible: false, dayKey: null }));
  };

  const [fixedPickerVisible, setFixedPickerVisible] = useState(false);
  const [fixedTempDate, setFixedTempDate] = useState<Date>(new Date());
  const handleFixedModalCancel = () => {
    setFixedPickerVisible(false);
  };
  const handleFixedModalConfirm = () => {
    const hh = String(fixedTempDate.getHours()).padStart(2, '0');
    const mm = String(fixedTempDate.getMinutes()).padStart(2, '0');
    const formatted = `${hh}:${mm}`;
    onFixedTimeChange && onFixedTimeChange(formatted);
    setFixedPickerVisible(false);
  };

  // Будни/Выходные модалки
  const [weekdayPickerVisible, setWeekdayPickerVisible] = useState(false);
  const [weekdayTempDate, setWeekdayTempDate] = useState<Date>(new Date());
  const [weekendPickerVisible, setWeekendPickerVisible] = useState(false);
  const [weekendTempDate, setWeekendTempDate] = useState<Date>(new Date());
  
  // Состояние для расчетного времени
  const [calculatedTime, setCalculatedTime] = useState<string>('--:--');
  const [isCalculating, setIsCalculating] = useState(false);

  // Расчет времени для полей "Откуда" и "Остановки"
  useEffect(() => {
    const calculateEstimatedTime = async () => {
      if (!allowTimeSelection && fromCoordinate && toCoordinate) {
        setIsCalculating(true);
        try {
          const fromPoint: RoutePoint = {
            id: 'from',
            coordinate: fromCoordinate,
            type: 'start'
          };
          const toPoint: RoutePoint = {
            id: 'to',
            coordinate: toCoordinate,
            type: 'end'
          };
          
          const result = await DistanceCalculationService.calculateRouteSegment(
            fromPoint,
            toPoint,
            departureTime
          );
          
          setCalculatedTime(result.estimatedTime);
        } catch (error) {
          console.error('Error calculating time:', error);
          setCalculatedTime('--:--');
        } finally {
          setIsCalculating(false);
        }
      }
    };

    calculateEstimatedTime();
  }, [allowTimeSelection, fromCoordinate, toCoordinate, departureTime]);

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.surface,
        borderColor: borderColor,
        marginBottom: isLast ? 20 : 10,
        // Увеличиваем контейнер только для режима Будни/Выходные в фикс-режиме и при выбранных днях
        height: (fixedMode && weekdaysMode && activeDays && activeDays.length > 0) ? 176 : undefined,
      }
    ]}>
      {/* Адрес отправления */}
      <Text style={[
        styles.addressText,
        { color: colors.text }
      ]}>
        {fromAddress || 'Адрес не выбран'}
      </Text>
      
      {/* Верхняя линия */}
      <View style={[
        styles.divider,
        { backgroundColor: colors.border }
      ]} />
      
      {/* Контент между линиями */}
      {fixedMode ? (
        weekdaysMode ? (
          // Будни/Выходные внутри контейнера
          (!activeDays || activeDays.length === 0) ? (
            <View style={styles.weekDaysContainer}>
              <Text style={[styles.dayText, { color: colors.text }]}>
                {t('common.selectTripDays')}
              </Text>
            </View>
          ) : (
            <View style={{ marginTop: 8, marginBottom: 8 }}>
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={[styles.dayText, { color: colors.text }]}> 
                    {t('common.weekdaysOnly')}
                    {':'}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      { backgroundColor: colors.background, borderColor: colors.border, opacity: allowTimeSelection ? 1 : 0.5 }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => allowTimeSelection && setWeekdayPickerVisible(true)}
                  >
                    <Text style={[styles.dayText, { color: colors.text }]}> 
                      {allowTimeSelection ? (weekdayTime || '--:--') : calculatedTime}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={[styles.dayText, { color: colors.text }]}> 
                    {t('common.weekend') || 'Выходные'}
                    {':'}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      { backgroundColor: colors.background, borderColor: colors.border, opacity: allowTimeSelection ? 1 : 0.5 }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => allowTimeSelection && setWeekendPickerVisible(true)}
                  >
                    <Text style={[styles.dayText, { color: colors.text }]}> 
                      {allowTimeSelection ? (weekendTime || '--:--') : calculatedTime}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            </View>
          )
        ) : (
          // Ежедневно: один таймпикер
          <View style={styles.weekDaysContainer}>
            {(!activeDays || activeDays.length === 0) ? (
              <Text style={[styles.dayText, { color: colors.text }]}>
                {t('common.selectTripDays')}
              </Text>
            ) : (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.dayText, { color: colors.text }]}> 
                  {t('common.departureTime')}
                  {':'}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dayButton,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      opacity: allowTimeSelection ? 1 : 0.5
                    }
                  ]}
                  onPress={() => {
                    if (!allowTimeSelection) return;
                    setFixedTempDate(new Date());
                    setFixedPickerVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayText, { color: colors.text }]}> 
                    {allowTimeSelection ? (fixedTime ? fixedTime : '--:--') : calculatedTime}
                  </Text>
                </TouchableOpacity>
                {fixedPickerVisible && (
                  <Modal transparent animationType="fade" visible={fixedPickerVisible}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ width: '85%', borderRadius: 12, padding: 16, backgroundColor: colors.surface }}>
                        <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
                          {t('common.departureTime')}
                        </Text>
                        <DateTimePicker
                          value={fixedTempDate}
                          mode="time"
                          is24Hour
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={(_e, d) => d && setFixedTempDate(d)}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                          <TouchableOpacity onPress={handleFixedModalCancel}>
                            <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.cancel') || 'Отмена'}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleFixedModalConfirm}>
                            <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.done') || 'Готово'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                )}
              </View>
            )}
          </View>
        )
      ) : (
        <View style={styles.weekDaysContainer}>
          {(!activeDays || activeDays.length === 0) ? (
            <Text style={[styles.dayText, { color: colors.text }]}> {t('common.selectTripDays')} </Text>
          ) : (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              {/* Левая подпись до тех пор, пока хватает места (эвристика по количеству кнопок) */}
              {activeDays ? (
                activeDays.length <= 4 ? (
                  <Text style={[styles.dayText, { color: colors.text, marginRight: 8 }]}> {t('common.departureTime')}{':'} </Text>
                ) : activeDays.length === 5 ? (
                  <Text style={[styles.dayText, { color: colors.text, marginRight: 8 }]}> {t('common.time')}{':'} </Text>
                ) : null
              ) : null}
              {/* Кнопки дней слева направо: Пн слева, Вс справа */}
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginLeft: -4 }}>
                {visibleDays.map((day) => {
                  const selectedTime = (dayTimes && dayTimes[day.key]) || localDayTimes[day.key];
                  return (
                    <TouchableOpacity
                      key={day.key}
                      style={[
                        styles.dayButton,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          marginLeft: 1,
                        }
                      ]}
                      onPress={() => openPickerForDay(day.key)}
                      activeOpacity={0.8}
                    >
                      {!pickerState.isVisible || pickerState.dayKey !== day.key ? (
                        <Text style={[styles.dayText, { color: colors.text }]}>
                          {allowTimeSelection ? (selectedTime ? selectedTime : day.label) : calculatedTime}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
          {pickerState.isVisible && (
            <Modal transparent animationType="fade" visible={pickerState.isVisible}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '85%', borderRadius: 12, padding: 16, backgroundColor: colors.surface }}>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
                    {t('common.selectTime') || 'Выберите время'}
                  </Text>
                  <DateTimePicker
                    value={dayTempDate}
                    mode="time"
                    is24Hour
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_e, d) => d && setDayTempDate(d)}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                    <TouchableOpacity onPress={handleDayModalCancel}>
                      <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.cancel') || 'Отмена'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDayModalConfirm}>
                      <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.done') || 'Готово'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      )}
      
      {/* Нижняя линия */}
      <View style={[
        styles.bottomDivider,
        { backgroundColor: colors.border }
      ]} />

      {/* Внешний блок Будни/Выходные больше не нужен, всё внутри между линиями */}

      {/* Модалки для Будни/Выходные */}
      {weekdayPickerVisible && (
        <Modal transparent animationType="fade" visible={weekdayPickerVisible}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '85%', borderRadius: 12, padding: 16, backgroundColor: colors.surface }}>
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
                {t('common.weekdaysOnly')}
              </Text>
              <DateTimePicker
                value={weekdayTempDate}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_e, d) => d && setWeekdayTempDate(d)}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <TouchableOpacity onPress={() => setWeekdayPickerVisible(false)}>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  const hh = String(weekdayTempDate.getHours()).padStart(2, '0');
                  const mm = String(weekdayTempDate.getMinutes()).padStart(2, '0');
                  onWeekdayTimeChange && onWeekdayTimeChange(`${hh}:${mm}`);
                  setWeekdayPickerVisible(false);
                }}>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.done')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {weekendPickerVisible && (
        <Modal transparent animationType="fade" visible={weekendPickerVisible}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '85%', borderRadius: 12, padding: 16, backgroundColor: colors.surface }}>
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
                {t('common.weekend') || 'Выходные'}
              </Text>
              <DateTimePicker
                value={weekendTempDate}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_e, d) => d && setWeekendTempDate(d)}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <TouchableOpacity onPress={() => setWeekendPickerVisible(false)}>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  const hh = String(weekendTempDate.getHours()).padStart(2, '0');
                  const mm = String(weekendTempDate.getMinutes()).padStart(2, '0');
                  onWeekendTimeChange && onWeekendTimeChange(`${hh}:${mm}`);
                  setWeekendPickerVisible(false);
                }}>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.done')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
