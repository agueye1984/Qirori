

export const parseDateTime = (date: string, time: string) => {
    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(4, 6), 10) - 1; // Mois 0-indexé
    const day = parseInt(date.substring(6, 8), 10);
    const hour = parseInt(time.substring(0, 2), 10);
    const minutes = parseInt(time.substring(2, 4), 10);
  
    return new Date(year, month, day, hour, minutes, 0);
  };