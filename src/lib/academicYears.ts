/**
 * S.U.M. Higher Secondary & Primary Schools, Royappanpatti
 * School Academic Year Master Specification (2000–2001 to 2040–2041)
 *
 * Authoritative single source of truth for 41 Academic Years (S.No 1 to 41).
 */

export interface AcademicYearRecord {
  sNo: number;
  year: string; // e.g. "2025–2026"
  startYear: number;
  endYear: number;
  isPast: boolean;
  isCurrent: boolean;
  isUpcoming: boolean;
  milestone?: string;
}

export const CURRENT_ACADEMIC_YEAR = '2025–2026';

/**
 * Authoritative table of 41 Academic Years (2000–2001 to 2040–2041)
 */
export const ACADEMIC_YEARS_TABLE: AcademicYearRecord[] = [
  { sNo: 1, year: '2000–2001', startYear: 2000, endYear: 2001, isPast: true, isCurrent: false, isUpcoming: false, milestone: 'Millennium Academic Year' },
  { sNo: 2, year: '2001–2002', startYear: 2001, endYear: 2002, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 3, year: '2002–2003', startYear: 2002, endYear: 2003, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 4, year: '2003–2004', startYear: 2003, endYear: 2004, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 5, year: '2004–2005', startYear: 2004, endYear: 2005, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 6, year: '2005–2006', startYear: 2005, endYear: 2006, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 7, year: '2006–2007', startYear: 2006, endYear: 2007, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 8, year: '2007–2008', startYear: 2007, endYear: 2008, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 9, year: '2008–2009', startYear: 2008, endYear: 2009, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 10, year: '2009–2010', startYear: 2009, endYear: 2010, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 11, year: '2010–2011', startYear: 2010, endYear: 2011, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 12, year: '2011–2012', startYear: 2011, endYear: 2012, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 13, year: '2012–2013', startYear: 2012, endYear: 2013, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 14, year: '2013–2014', startYear: 2013, endYear: 2014, isPast: true, isCurrent: false, isUpcoming: false, milestone: 'Golden Jubilee Year (50 Years of Excellence)' },
  { sNo: 15, year: '2014–2015', startYear: 2014, endYear: 2015, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 16, year: '2015–2016', startYear: 2015, endYear: 2016, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 17, year: '2016–2017', startYear: 2016, endYear: 2017, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 18, year: '2017–2018', startYear: 2017, endYear: 2018, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 19, year: '2018–2019', startYear: 2018, endYear: 2019, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 20, year: '2019–2020', startYear: 2019, endYear: 2020, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 21, year: '2020–2021', startYear: 2020, endYear: 2021, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 22, year: '2021–2022', startYear: 2021, endYear: 2022, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 23, year: '2022–2023', startYear: 2022, endYear: 2023, isPast: true, isCurrent: false, isUpcoming: false, milestone: 'Diamond Jubilee (60 Glorious Years)' },
  { sNo: 24, year: '2023–2024', startYear: 2023, endYear: 2024, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 25, year: '2024–2025', startYear: 2024, endYear: 2025, isPast: true, isCurrent: false, isUpcoming: false },
  { sNo: 26, year: '2025–2026', startYear: 2025, endYear: 2026, isPast: false, isCurrent: true, isUpcoming: false, milestone: 'Current Active Academic Session' },
  { sNo: 27, year: '2026–2027', startYear: 2026, endYear: 2027, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 28, year: '2027–2028', startYear: 2027, endYear: 2028, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 29, year: '2028–2029', startYear: 2028, endYear: 2029, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 30, year: '2029–2030', startYear: 2029, endYear: 2030, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 31, year: '2030–2031', startYear: 2030, endYear: 2031, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 32, year: '2031–2032', startYear: 2031, endYear: 2032, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 33, year: '2032–2033', startYear: 2032, endYear: 2033, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 34, year: '2033–2034', startYear: 2033, endYear: 2034, isPast: false, isCurrent: false, isUpcoming: true, milestone: 'Platinum Jubilee (70 Years of Service)' },
  { sNo: 35, year: '2034–2035', startYear: 2034, endYear: 2035, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 36, year: '2035–2036', startYear: 2035, endYear: 2036, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 37, year: '2036–2037', startYear: 2036, endYear: 2037, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 38, year: '2037–2038', startYear: 2037, endYear: 2038, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 39, year: '2038–2039', startYear: 2038, endYear: 2039, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 40, year: '2039–2040', startYear: 2039, endYear: 2040, isPast: false, isCurrent: false, isUpcoming: true },
  { sNo: 41, year: '2040–2041', startYear: 2040, endYear: 2041, isPast: false, isCurrent: false, isUpcoming: true },
];

/**
 * Array of 41 academic year strings in chronological order (2000–2001 to 2040–2041)
 */
export const ACADEMIC_YEARS: string[] = ACADEMIC_YEARS_TABLE.map((r) => r.year);

/**
 * Array of 41 academic year strings in reverse chronological order (2040–2041 down to 2000–2001)
 * Ideal for selection dropdowns and recent event lists.
 */
export const ACADEMIC_YEARS_DESC: string[] = [...ACADEMIC_YEARS].reverse();

/**
 * Pre-formatted dropdown options for UI `<Select>` components
 */
export const ACADEMIC_YEAR_OPTIONS = ACADEMIC_YEARS_DESC.map((year) => {
  const record = ACADEMIC_YEARS_TABLE.find((r) => r.year === year);
  let label = year;
  if (record?.isCurrent) {
    label = `${year} (Current Active Session)`;
  } else if (record?.milestone) {
    label = `${year} (${record.milestone})`;
  }
  return {
    value: year,
    label,
  };
});

/**
 * Validate whether a string is a recognized Academic Year within 2000–2001 through 2040–2041
 */
export function isValidAcademicYear(year: string): boolean {
  if (!year) return false;
  // Normalize hyphens and en-dashes
  const normalized = year.replace('-', '–').trim();
  return ACADEMIC_YEARS.includes(normalized);
}

/**
 * Normalize an academic year string (handles hyphen to en-dash conversion)
 */
export function normalizeAcademicYear(year: string): string {
  if (!year) return CURRENT_ACADEMIC_YEAR;
  const normalized = year.replace('-', '–').trim();
  return ACADEMIC_YEARS.find((y) => y === normalized) || normalized;
}

/**
 * Parse an academic year string into startYear and endYear numbers
 */
export function parseAcademicYear(year: string): { startYear: number; endYear: number } | null {
  const parts = year.split(/[–-]/);
  if (parts.length === 2) {
    const start = parseInt(parts[0], 10);
    const end = parseInt(parts[1], 10);
    if (!isNaN(start) && !isNaN(end)) {
      return { startYear: start, endYear: end };
    }
  }
  return null;
}
