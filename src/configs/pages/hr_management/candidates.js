export default {
  category: [
    {
      text: 'all_caps',
      value: 0,
      category_id: 0,
      selected: true,
    },
    {
      text: 'general_info_caps',
      value: 0,
      category_id: 1,
      selected: false,
    },
    {
      text: 'user_info_caps',
      value: 0,
      category_id: 2,
      selected: false,
    },
    {
      text: 'location_caps',
      value: 0,
      category_id: 3,
      selected: false,
    },
    {
      text: 'datewise_caps',
      value: 0,
      category_id: 4,
      selected: false,
    },
  ],
  // breadcrumb
  breadcrumb: [
    {
      text: 'dashboard',
      exact: true,
      to: '/',
    },
    {
      icon: 'mdi-account-outline',
      text: 'candidates',
      disabled: true,
      to: '/hr-management/candidates',
    },
  ],

  // tab items
  tabItems: [
    {
      text: 'all',
      icon: 'fa-table',
      isSelected: 1,
      key: 'all',
    },

  ],

  // table headers
  headers: [
    {
      text: 'id',
      value: 'code',
      select: false,
      id: 1,
      category_id: 1,
      sortable: false,
    },
    {
      text: 'profile',
      value: 'image',
      select: false,
      id: 2,
      category_id: 1,
      sortable: false,
    },
    {
      text: 'firstname',
      value: 'firstname',
      select: false,
      id: 3,
      category_id: 1,
    },
    {
      text: 'lastname',
      value: 'lastname',
      select: false,
      id: 4,
      category_id: 1,
    },
    {
      text: 'display_name',
      value: 'display_name',
      select: false,
      id: 5,
      category_id: 1,
    },

    {
      text: 'diploma',
      value: 'diploma',
      select: false,
      id: 6,
      category_id: 1,
    },
    {
      text: 'current_company',
      value: 'current_company',
      select: false,
      id: 6,
      category_id: 1,
    },
    {
      text: 'email',
      value: 'email',
      select: false,
      id: 7,
      category_id: 1,
    },
    {
      text: 'phone',
      value: 'phone',
      select: false,
      id: 8,
      category_id: 1,
    },
    {
      text: 'location',
      value: 'location',
      select: false,
      id: 9,
      category_id: 1,
    },
    {
      text: 'gender',
      value: 'gender',
      select: false,
      id: 10,
      category_id: 1,
    },

    {
      text: 'birth_date',
      value: 'birth_date',
      select: false,
      id: 11,
      category_id: 4,
    },

    {
      text: 'current_position',
      value: 'position.name',
      select: false,
      id: 12,
      category_id: 1,
      sortable: false,
    },
    {
      text: 'source',
      value: 'source',
      select: false,
      id: 13,
      category_id: 1,
    },
    {
      text: 'skype',
      value: 'skype',
      select: false,
      id: 14,
      category_id: 1,
    },
    {
      text: 'other_contact',
      value: 'other_contact',
      select: false,
      id: 15,
      category_id: 1,
    },

    {
      text: 'created_at',
      value: 'created_at',
      select: false,
      id: 24,
      category_id: 4,
    },
  ],

  // edit steppers
  editSteppers: [
    {
      icon: 'fa-user',
      title: 'general',
      slotName: 'step1',
    },
    {
      icon: 'fa-user',
      title: 'account',
      slotName: 'step2',
    },
    {
      icon: 'fa-user',
      title: 'personal',
      slotName: 'step3',
    },
    {
      icon: 'fa-user-shield',
      title: 'permission',
      slotName: 'step4',
    },
    {
      icon: 'fa-comment-dots',
      title: 'remarks',
      slotName: 'step5',
    },
    {
      icon: 'fa-thumbs-up',
      title: 'done',
      slotName: 'step6',
    },
  ],
  autoEditSteppers: [
    {
      icon: 'fa-user',
      title: 'general',
      slotName: 'step1',
    },
    {
      icon: 'fa-user',
      title: 'account',
      slotName: 'step2',
    },
    {
      icon: 'fa-user',
      title: 'personal',
      slotName: 'step3',
    },
    {
      icon: 'fa-user-shield',
      title: 'permission',
      slotName: 'step4',
    },
    {
      icon: 'fa-comment-dots',
      title: 'remarks',
      slotName: 'step5',
    },
  ],
};
