import moment from 'moment';

export const humanReadableTime = (time: string): string => {
  const formatedTime = moment(time).format();
  const duration = moment.duration(moment().diff(formatedTime));
  const seconds = duration.asSeconds();
  const humanizeDuration = moment.duration(-seconds, 'seconds').humanize(true);

  return humanizeDuration;
};

export const getNowDate = (type: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD' | 'YYYY/DD/MM' = 'DD/MM/YYYY'): string => {
  const date = new Date();
  let dateNumber: string | number = date.getDate();
  let month: string | number = date.getMonth() + 1;
  const year = date.getFullYear();
  if (dateNumber < 10) {
    dateNumber = `0${dateNumber}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  switch (type) {
    case 'DD/MM/YYYY':
      return `${dateNumber}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${dateNumber}/${year}`;
    case 'YYYY/DD/MM':
      return `${year}/${dateNumber}/${month}`;
    case 'YYYY/MM/DD':
      return `${year}/${month}/${dateNumber}`;
    default:
      return `${dateNumber}/${month}/${year}`;
  }
};
