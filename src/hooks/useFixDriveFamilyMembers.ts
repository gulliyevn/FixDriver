import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FamilyMember } from "../types/family";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "./useProfile";
import { useFocusEffect } from "@react-navigation/native";
import { useUserStorageKey } from "../utils/storageKeys";

export const useFixDriveFamilyMembers = () => {
  const { user } = useAuth();
  const profileContext = useProfile();
  const profile = profileContext?.profile;
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const familyMembersKey = useUserStorageKey("@family_members");

  useEffect(() => {
    const loadFamilyMembers = async () => {
      try {
        setLoading(true);

        // Загружаем данные напрямую из AsyncStorage с изоляцией по user.id
        const savedMembers = await AsyncStorage.getItem(familyMembersKey);

        let members: FamilyMember[] = [];

        if (savedMembers) {
          members = JSON.parse(savedMembers);
        }

        // Создаем владельца аккаунта как участника семьи
        const accountOwner: FamilyMember = {
          id: "account-owner",
          name: profile?.name || user?.name || "Пользователь",
          surname: profile?.surname || user?.surname || "",
          type: "account_owner",
          birthDate: profile?.birthDate || "1990-01-01",
          age: 30, // Default age since User type doesn't have age property
          phone: profile?.phone || user?.phone,
          phoneVerified: false, // Default since User type doesn't have phoneVerified property
        };

        // Если есть добавленные участники семьи, добавляем владельца к ним
        // Если нет - показываем только владельца
        const allMembers =
          members.length > 0 ? [accountOwner, ...members] : [accountOwner];
        setFamilyMembers(allMembers);
      } catch (error) {
        setFamilyMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadFamilyMembers();
  }, [user?.id, profile, familyMembersKey]);

  // Автоматически обновляем данные при фокусе на экране
  useFocusEffect(
    React.useCallback(() => {
      const loadFamilyMembers = async () => {
        try {
          setLoading(true);

          // Загружаем данные напрямую из AsyncStorage с изоляцией по user.id
          const savedMembers = await AsyncStorage.getItem(familyMembersKey);

          let members: FamilyMember[] = [];

          if (savedMembers) {
            members = JSON.parse(savedMembers);
          }

          // Создаем владельца аккаунта как участника семьи
          const accountOwner: FamilyMember = {
            id: "account-owner",
            name: profile?.name || user?.name || "Пользователь",
            surname: profile?.surname || user?.surname || "",
            type: "account_owner",
            birthDate: profile?.birthDate || "1990-01-01",
            age: 30, // Default age since User type doesn't have age property
            phone: profile?.phone || user?.phone,
            phoneVerified: false, // Default since User type doesn't have phoneVerified property
          };

          // Если есть добавленные участники семьи, добавляем владельца к ним
          // Если нет - показываем только владельца
          const allMembers =
            members.length > 0 ? [accountOwner, ...members] : [accountOwner];
          setFamilyMembers(allMembers);
        } catch (error) {
          console.warn('Failed to load family members:', error);
        } finally {
          setLoading(false);
        }
      };

      loadFamilyMembers();
    }, [user?.id, profile, familyMembersKey]),
  );

  // Функция для получения опций для dropdown
  const getFamilyMemberOptions = () => {
    return familyMembers.map((member) => ({
      key: member.id,
      label: `${member.name} ${member.surname}`,
      value: member.id,
      member: member,
    }));
  };

  // Функция для получения участника по ID
  const getFamilyMemberById = (id: string) => {
    return familyMembers.find((member) => member.id === id);
  };

  // Функция для принудительного обновления данных из AsyncStorage
  const refreshFamilyMembers = async () => {
    try {
      const savedMembers = await AsyncStorage.getItem(familyMembersKey);

      if (savedMembers) {
        const parsedMembers = JSON.parse(savedMembers);

        // Создаем владельца аккаунта
        const accountOwner: FamilyMember = {
          id: "account-owner",
          name: profile?.name || user?.name || "Пользователь",
          surname: profile?.surname || user?.surname || "",
          type: "account_owner",
          birthDate: profile?.birthDate || "1990-01-01",
          age: 30, // Default age since User type doesn't have age property
          phone: profile?.phone || user?.phone,
          phoneVerified: false, // Default since User type doesn't have phoneVerified property
        };

        const allMembers =
          parsedMembers.length > 0
            ? [accountOwner, ...parsedMembers]
            : [accountOwner];

        setFamilyMembers(allMembers);
      }
    } catch (error) {
      console.warn('Failed to load family members:', error);
    }
  };

  return {
    familyMembers,
    loading,
    getFamilyMemberOptions,
    getFamilyMemberById,
    refreshFamilyMembers,
  };
};
