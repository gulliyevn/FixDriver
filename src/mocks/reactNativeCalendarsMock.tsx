import React from "react";
import { View } from "react-native";

export const Calendar = ({ ...props }: any) => (
  <View testID="calendar" {...props} />
);

export const CalendarList = ({ ...props }: any) => (
  <View testID="calendar-list" {...props} />
);

export const Agenda = ({ ...props }: any) => (
  <View testID="agenda" {...props} />
);
