import { FamilyMember } from "../types/family";

// Мок БД для участников семьи, привязанных к clientId
export const familyMembersMock: { [clientId: string]: FamilyMember[] } = {
  client1: [
    {
      id: "1",
      name: "Анна",
      surname: "Иванова",
      type: "daughter",
      birthDate: "2015-03-15",
      age: 8,
      phone: "+7 999 123-45-67",
      phoneVerified: true,
    },
    {
      id: "2",
      name: "Мария",
      surname: "Иванова",
      type: "wife",
      birthDate: "1988-07-22",
      age: 35,
      phone: "+7 999 234-56-78",
      phoneVerified: true,
    },
    {
      id: "3",
      name: "Петр",
      surname: "Иванов",
      type: "son",
      birthDate: "2012-11-08",
      age: 11,
      phone: undefined,
      phoneVerified: false,
    },
  ],
  client2: [
    {
      id: "4",
      name: "Елена",
      surname: "Петрова",
      type: "mother",
      birthDate: "1965-04-12",
      age: 58,
      phone: "+7 999 345-67-89",
      phoneVerified: true,
    },
    {
      id: "5",
      name: "Дмитрий",
      surname: "Петров",
      type: "father",
      birthDate: "1963-09-25",
      age: 60,
      phone: "+7 999 456-78-90",
      phoneVerified: false,
    },
  ],
  client3: [
    {
      id: "6",
      name: "София",
      surname: "Сидорова",
      type: "daughter",
      birthDate: "2018-06-30",
      age: 5,
      phone: undefined,
      phoneVerified: false,
    },
    {
      id: "7",
      name: "Александр",
      surname: "Сидоров",
      type: "husband",
      birthDate: "1985-12-03",
      age: 38,
      phone: "+7 999 567-89-01",
      phoneVerified: true,
    },
    {
      id: "8",
      name: "Ольга",
      surname: "Сидорова",
      type: "grandmother",
      birthDate: "1940-02-14",
      age: 83,
      phone: "+7 999 678-90-12",
      phoneVerified: true,
    },
  ],
};

// Функция для получения участников семьи по clientId
export const getFamilyMembersByClientId = (
  clientId: string,
): FamilyMember[] => {
  const members = familyMembersMock[clientId] || [];

  return members;
};

// Функция для добавления нового участника семьи
export const addFamilyMember = (
  clientId: string,
  member: Omit<FamilyMember, "id">,
): FamilyMember => {
  const newId = Date.now().toString();
  const newMember: FamilyMember = {
    ...member,
    id: newId,
  };

  if (!familyMembersMock[clientId]) {
    familyMembersMock[clientId] = [];
  }

  familyMembersMock[clientId].push(newMember);

  return newMember;
};

// Функция для обновления участника семьи
export const updateFamilyMember = (
  clientId: string,
  memberId: string,
  updates: Partial<FamilyMember>,
): FamilyMember | null => {
  const members = familyMembersMock[clientId];
  if (!members) return null;

  const memberIndex = members.findIndex((m) => m.id === memberId);
  if (memberIndex === -1) return null;

  members[memberIndex] = { ...members[memberIndex], ...updates };
  return members[memberIndex];
};

// Функция для удаления участника семьи
export const deleteFamilyMember = (
  clientId: string,
  memberId: string,
): boolean => {
  const members = familyMembersMock[clientId];
  if (!members) return false;

  const memberIndex = members.findIndex((m) => m.id === memberId);
  if (memberIndex === -1) return false;

  members.splice(memberIndex, 1);
  return true;
};
