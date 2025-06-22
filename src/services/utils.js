import i18n from '../i18n';

export const getFormattedDate = (seconds) => {
  const date = new Date(seconds * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour12: false,
    timeZone: 'Europe/Bucharest'
  }).format(date)
};

export function createData(id, animalId, birthDate, age, gender, treatment, observation, species) {
  return {
    id,
    animalId,
    birthDate,
    age,
    gender,
    treatment,
    observation,
    species, // always include species
  };
}

export const generateRows = (animals) => {
  return animals.map((animal, index) => {
    const { animalId, birthDate, gender, treatment, observation, species } = animal;
    const id = index + 1;
    const displayedBirthDate = getFormattedDate(toUnixTimestamp(birthDate), false);
    const formattedAge = calculateAge(toUnixTimestamp(birthDate));
    const age = translateAgeString(formattedAge);

    return createData(id, animalId, displayedBirthDate, age, gender, treatment, observation, species || inferSpecies(animal));
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

export function calculateAge(birthTimestampSec) {
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

export function translateAgeString(ageString) {
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

function inferSpecies(animal) {
  // Try to infer species from known properties if missing
  if (animal && animal.species) return animal.species;
  if (animal && animal.type) {
    const type = animal.type.toLowerCase();
    if (type.includes('cow') || type.includes('vaca')) return 'cow';
    if (type.includes('horse') || type.includes('cal')) return 'horse';
  }
  // fallback: undefined
  return undefined;
}