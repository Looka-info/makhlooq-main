import { CollectionConfig } from 'payload';
import { revalidatePathHook } from '../hooks/revalidate';

export const TeamMembers: CollectionConfig = {
  slug: 'team_members',
  labels: {
    singular: 'Team Member',
    plural: 'Team Members',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'category', 'is_approved', 'is_admin'],
    group: 'Team',
  },
  hooks: {
    afterChange: [revalidatePathHook("/team")],
    afterDelete: [revalidatePathHook("/team")],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'discord_uid',
      type: 'text',
      required: true,
      unique: true,
      label: 'Discord UID',
    },
    {
      name: 'discord_tag',
      type: 'text',
      label: 'Discord Tag',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Display Name',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      options: [
        'Field Marshal',
        'General',
        'Commander',
        'Colonel',
        'Major',
        'Captain',
        'Officer',
      ],
      defaultValue: 'Officer',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Rank',
      options: [
        'MAKHLOOQ- E1',
        'CITIZEN - E2',
        'SOLDIER - E3',
        'CORPORAL - E4',
        'SERGEANT - E5',
        'LIEUTENANT - O1',
        'OFFICER - O2',
        'CAPTAIN - O3',
        'MAJOR - O4',
        'COLONEL - O5',
        'COMMANDER - C1',
        'GENERAL - C2',
        'FIELD MARSHAL - C3',
      ],
      defaultValue: 'MAKHLOOQ- E1',
    },
    {
      name: 'sec_level',
      type: 'select',
      label: 'Security Level',
      options: ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
      defaultValue: 'R0',
    },
    {
      name: 'avatar_url',
      type: 'text',
      label: 'Avatar URL',
    },
    {
      name: 'node_color',
      type: 'text',
      label: 'Node Color',
      defaultValue: '#10b981',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Idle', value: 'idle' },
        { label: 'Do Not Disturb', value: 'dnd' },
        { label: 'Offline', value: 'offline' },
      ],
      defaultValue: 'offline',
    },
    {
      name: 'is_approved',
      type: 'checkbox',
      defaultValue: false,
      label: 'Approved',
    },
    {
      name: 'is_admin',
      type: 'checkbox',
      defaultValue: false,
      label: 'Is Admin',
    },
    {
      name: 'joined_at',
      type: 'date',
      label: 'Deployed Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
};
