import React from "react";
import { View } from "react-native";

export const Calendar = ({ ...props }: Record<string, unknown>) => (
  <View testID="calendar" {...props} />
);

export const CalendarList = ({ ...props }: Record<string, unknown>) => (
  <View testID="calendar-list" {...props} />
);

export const Agenda = ({ ...props }: Record<string, unknown>) => (
  <View testID="agenda" {...props} />
);
