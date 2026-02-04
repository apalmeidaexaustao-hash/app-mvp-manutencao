import { airConditioningChecklist } from './air-conditioning-checklist';
import { coldRoomChecklist } from './cold-room-checklist';
import { ChecklistTemplate } from './checklist-model';

export const checklistLibrary: ChecklistTemplate[] = [
  {
    id: 'template-ac-split',
    name: 'Ar-condicionado Split/VRF',
    equipmentTypes: [
      'Ar-condicionado Split',
      'Ar-condicionado Multi-Split',
      'Sistema VRF',
      'Split Hi-Wall',
      'Split Piso-Teto',
      'Split Cassette'
    ],
    isActive: true,
    isPremium: false,
    checklist: airConditioningChecklist
  },
  {
    id: 'template-cold-room',
    name: 'Câmara Fria / Câmara Frigorífica',
    equipmentTypes: [
      'Câmara Fria Resfriada',
      'Câmara Fria Congelada',
      'Câmara Frigorífica',
      'Túnel de Congelamento',
      'Câmara de Maturação'
    ],
    isActive: true,
    isPremium: false,
    checklist: coldRoomChecklist
  }
];

export function findChecklistByEquipmentType(equipmentType: string): ChecklistTemplate | undefined {
  return checklistLibrary.find(template => 
    template.equipmentTypes.some(type => 
      type.toLowerCase().includes(equipmentType.toLowerCase()) ||
      equipmentType.toLowerCase().includes(type.toLowerCase())
    )
  );
}

export function getAllActiveChecklists(): ChecklistTemplate[] {
  return checklistLibrary.filter(template => template.isActive);
}

export function getChecklistById(id: string): ChecklistTemplate | undefined {
  return checklistLibrary.find(template => template.id === id);
}

export { airConditioningChecklist, coldRoomChecklist };
export * from './checklist-model';
