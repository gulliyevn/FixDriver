import { useEffect } from 'react';
import { TimeScheduleData } from '../types/fix-wave.types';
import { fixwaveOrderService } from '../../../../services/fixwaveOrderService';

export const useSessionData = (
  state: ReturnType<typeof import('./useScheduleState').useScheduleState>, 
  initialData?: TimeScheduleData
) => {
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const sessionData = await fixwaveOrderService.loadSessionData();
        
        if (sessionData?.timeScheduleData) {
          state.setTimeScheduleData(sessionData.timeScheduleData);
          
          // Восстанавливаем состояние
          if (sessionData.timeScheduleData.fixedTimes) {
            state.setTimes(prev => ({ ...prev, fixed: sessionData.timeScheduleData.fixedTimes }));
          }
          if (sessionData.timeScheduleData.weekdayTimes) {
            state.setTimes(prev => ({ ...prev, weekday: sessionData.timeScheduleData.weekdayTimes }));
          }
          if (sessionData.timeScheduleData.weekendTimes) {
            state.setTimes(prev => ({ ...prev, weekend: sessionData.timeScheduleData.weekendTimes }));
          }
          if (sessionData.timeScheduleData.selectedDays) {
            state.setSelectedDays(sessionData.timeScheduleData.selectedDays);
          }
          if (sessionData.timeScheduleData.switchStates) {
            state.setSwitchStates(sessionData.timeScheduleData.switchStates);
          }
        }
        
        if (sessionData?.addressData?.addresses) {
          const fromAddr = sessionData.addressData.addresses.find(addr => addr.type === 'from');
          const toAddr = sessionData.addressData.addresses.find(addr => addr.type === 'to');
          const stops = sessionData.addressData.addresses.filter(addr => addr.type === 'stop');
          
          if (fromAddr) {
            state.setAddresses(prev => ({ ...prev, from: fromAddr.address }));
            state.setCoordinates(prev => ({ ...prev, from: fromAddr.coordinates }));
          }
          if (toAddr) {
            state.setAddresses(prev => ({ ...prev, to: toAddr.address }));
            state.setCoordinates(prev => ({ ...prev, to: toAddr.coordinates }));
          }
          if (stops && stops.length) {
            const stopAddresses = stops.map(s => s.address).slice(0, 2);
            const stopCoords = stops.slice(0, 2).map(s => s.coordinates).filter(Boolean) as Array<{ latitude: number; longitude: number }>;
            state.setAddresses(prev => ({ ...prev, stops: stopAddresses }));
            state.setCoordinates(prev => ({ ...prev, stops: stopCoords }));
          }
        }
      } catch (error) {
      }
    };
    
    loadSessionData();
  }, [initialData]);
};
