import i18n from '../i18n';

export const getFormattedDate = (seconds, showHours = true) => {
  const date = new Date(seconds * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...(showHours && ({ hour: '2-digit' })),
    ...(showHours && ({ minute: '2-digit' })),
    hour12: false,
    timeZone: 'Europe/Bucharest'
  }).format(date)
};

export function createData(id, animalId, birthDate, age, gender, treatment, observation) {
  return {
    id,
    animalId,
    birthDate,
    age,
    gender,
    treatment,
    observation,
  };
}

export const generateRows = (animals) => {
  return animals.map((animal, index) => {
    const { animalId, birthDate, age: toRemove, gender, treatment, observation } = animal;
    const id = index + 1;
    const displayedBirthDate = getFormattedDate(toUnixTimestamp(birthDate), false);
    const formattedAge = calculateAge(toUnixTimestamp(birthDate));
    const age = translateAgeString(formattedAge);

    return createData(id, animalId, displayedBirthDate, age, gender, treatment, observation);
  })
}

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Numar crotaliu (ID)',
  },
  {
    id: 'birthDate',
    numeric: false,
    disablePadding: false,
    label: 'Data nasterii',
  },
  {
    id: 'age',
    numeric: false,
    disablePadding: false,
    label: 'Varsta',
  },
  {
    id: 'gender',
    numeric: false,
    disablePadding: false,
    label: 'Sex',
  },
  {
    id: 'treatment',
    numeric: false,
    disablePadding: false,
    label: 'Tratamente',
  },
  {
    id: 'observation',
    numeric: false,
    disablePadding: false,
    label: 'Observatii',
  },
];

function calculateAge(birthTimestampSec) {
  const birthDate = new Date(birthTimestampSec * 1000);
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    return months > 0
      ? `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`
      : `${years} year${years !== 1 ? 's' : ''}`;
  }
}
function translateAgeString(ageString) {
  return ageString
    .replace(/\byears\b/g, i18n.t('years'))
    .replace(/\byear\b/g, i18n.t('year'))
    .replace(/\bmonth\b/g, i18n.t('month'))
    .replace(/\bmonths\b/g, i18n.t('months'));
}

function toUnixTimestamp(dateStr) {
  const date = new Date(dateStr);
  return Math.floor(date.getTime() / 1000);
}