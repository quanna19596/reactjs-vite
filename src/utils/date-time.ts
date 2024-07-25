import moment from 'moment';

export const humanReadableTime = (time: string): string => {
  const formatedTime = moment(time).format();
  const duration = moment.duration(moment().diff(formatedTime));
  const seconds = duration.asSeconds();
  const humanizeDuration = moment.duration(-seconds, 'seconds').humanize(true);

  return humanizeDuration;
};

export const getBeautifiedDate = (
  type: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD' | 'YYYY/DD/MM' = 'DD/MM/YYYY',
  dateObj: Date,
  formatTime?: boolean,
  breakLine?: boolean
): string => {
  const date = dateObj || new Date();
  let dateNumber: string | number = date.getDate();
  if (isNaN(dateNumber)) return '';
  let month: string | number = date.getMonth() + 1;
  const year = date.getFullYear();
  if (dateNumber < 10) {
    dateNumber = `0${dateNumber}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }

  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  switch (type) {
    case 'DD/MM/YYYY':
      return `${dateNumber}/${month}/${year}${breakLine ? '\n' : ''}${formatTime ? `${breakLine ? '' : ' - '}${time}` : ''}`;
    case 'MM/DD/YYYY':
      return `${month}/${dateNumber}/${year}${breakLine ? '\n' : ''}${formatTime ? `${breakLine ? '' : ' - '}${time}` : ''}`;
    case 'YYYY/DD/MM':
      return `${year}/${dateNumber}/${month}${breakLine ? '\n' : ''}${formatTime ? `${breakLine ? '' : ' - '}${time}` : ''}`;
    case 'YYYY/MM/DD':
      return `${year}/${month}/${dateNumber}${breakLine ? '\n' : ''}${formatTime ? `${breakLine ? '' : ' - '}${time}` : ''}`;
    default:
      return `${dateNumber}/${month}/${year}${breakLine ? '\n' : ''}${formatTime ? `${breakLine ? '' : ' - '}${time}` : ''}`;
  }
};

export const getBeautifiedTime = (orderStartTime: string, orderEndTime: string): string => {
  return `${orderStartTime.split('T')[1].split(':').slice(0, -1).join(':')} - ${orderEndTime.split('T')[1].split(':').slice(0, -1).join(':')}`;
};

export const compareDatesIsAfter = (date1: Date, date2: Date): boolean => {
  return moment(date1).isAfter(moment(date2));
};

export const getISODateByTimezone = (date?: Date): string => {
  const dateObj = date || new Date();
  const tzoffset = dateObj.getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(dateObj.getTime() - tzoffset).toISOString().slice(0, -1);
  return localISOTime;
};
