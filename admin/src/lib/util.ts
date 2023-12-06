export function fromNumberToPlanName(number: number): string {
  switch (number) {
    case 1:
      return 'Free';
    case 2:
      return 'Trial';
    case 3:
      return 'Pro';
    default:
      return 'Free';
  }
}

export function fromPlanNameToNumber(name: string): number {
  switch (name) {
    case 'Free':
      return 1;
    case 'Trial':
      return 2;
    case 'Pro':
      return 3;
    default:
      return 1;
  }
}

export function formatDateExtra(date: Date): string {
  var hours = date.getHours();
  var minutes: string | number = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return (
    date.getDate() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    date.getFullYear() +
    '  ' +
    strTime
  );
}
