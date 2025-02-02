
export const WeekendList = (t: any): any[] => {
  return [
    {
      id: '1',
      name: t('WeekendList.Lundi'),
      
    },
    {
        id: '2',
        name: t('WeekendList.Mardi'),
        
      },
      {
        id: '3',
        name: t('WeekendList.Mercredi'),
        
      },
      {
        id: '4',
        name: t('WeekendList.Jeudi'),
        
      },
      {
        id: '5',
        name: t('WeekendList.Vendredi'),
        
      },
      {
        id: '6',
        name: t('WeekendList.Samedi'),
        
      },
      {
        id: '7',
        name: t('WeekendList.Dimanche'),
        
      }
  ]
}

export const GetWeekendList = (t: any): { [key: string]: string } => {
  return {
    '1': t('WeekendList.Lundi'),
    '2': t('WeekendList.Mardi'),
    '3': t('WeekendList.Mercredi'),
    '4': t('WeekendList.Jeudi'),
    '5': t('WeekendList.Vendredi'),
    '6': t('WeekendList.Samedi'),
    '7': t('WeekendList.Dimanche')
  };
};
