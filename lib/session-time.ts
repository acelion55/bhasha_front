const DAY_MAP: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

export const parseTimeToHoursAndMinutes = (
  timeStr?: string,
): { hour: number; minute: number } => {
  if (!timeStr) return { hour: 19, minute: 0 };

  // 1. Look for explicit HH:MM (AM/PM) e.g. "7:00 PM" or "19:00"
  let match = timeStr.match(/(?:^|[|\s,])(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
  // 2. Look for HH AM/PM e.g. "7 PM" or "7PM"
  if (!match) {
    match = timeStr.match(/(?:^|[|\s,])(\d{1,2})\s*(AM|PM)/i);
  }
  // 3. Fallback
  if (!match) {
    match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  }
  if (!match) return { hour: 19, minute: 0 };

  let h = parseInt(match[1], 10);
  const m = match[2] && !isNaN(parseInt(match[2], 10)) ? parseInt(match[2], 10) : 0;
  const ampm = (
    match[3] ||
    (match[2] && (match[2].toUpperCase() === 'AM' || match[2].toUpperCase() === 'PM') ? match[2] : '')
  )?.toUpperCase();

  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;

  return { hour: h, minute: m };
};

export const formatTo12HourString = (hour: number, minute: number): string => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  const mStr = minute.toString().padStart(2, '0');
  return `${h12}:${mStr} ${ampm}`;
};

export interface NextSessionResult {
  nextDate: Date;
  dateStr: string; // YYYY-MM-DD
  formattedDate: string; // "08 Nov 2026"
  dayName: string; // "Sun"
  timeString: string; // "7:00 PM"
  displayTiming: string; // "Sun, 08 Nov 2026 | 7:00 PM" or "Today, 08 Nov 2026 | 7:00 PM"
  isToday: boolean;
  isTomorrow: boolean;
}

export const formatYyyyMmDd = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const formatPrettyDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map((v) => parseInt(v, 10));
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const extractActiveWeekdays = (weekdays?: string[], timingFallback?: string): string[] => {
  let activeWeekdays = weekdays && weekdays.length > 0 ? weekdays : [];
  if (activeWeekdays.length === 0 && timingFallback) {
    const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    activeWeekdays = ALL_DAYS.filter((d) =>
      new RegExp(`\\b${d}\\b`, 'i').test(timingFallback),
    );
  }
  return activeWeekdays;
};

/**
 * Calculates the next upcoming session date & time for a class.
 * If weekdays are specified, it dynamically finds the next occurrence in the future.
 * Skips any dates already marked completed by the teacher.
 */
export const getNextUpcomingSession = (
  weekdays?: string[],
  startTimeStr?: string,
  baseDateStr?: string,
  timingFallback?: string,
  endDateStr?: string,
  completedSessions?: string[],
): NextSessionResult | null => {
  const { hour, minute } = parseTimeToHoursAndMinutes(startTimeStr || timingFallback);
  const timeString = formatTo12HourString(hour, minute);

  const now = new Date();
  const completedSet = new Set(Array.isArray(completedSessions) ? completedSessions : []);

  const activeWeekdays = extractActiveWeekdays(weekdays, timingFallback);

  if (activeWeekdays.length > 0) {
    const targetDayIndexes = activeWeekdays
      .map((w) => DAY_MAP[w.toLowerCase().trim()])
      .filter((idx) => typeof idx === 'number');

    if (targetDayIndexes.length > 0) {
      // Check from offset 0 (today) up to 14 days ahead
      for (let offset = 0; offset <= 14; offset++) {
        const candidate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + offset,
          hour,
          minute,
          0,
          0,
        );
        if (targetDayIndexes.includes(candidate.getDay())) {
          const dateStr = formatYyyyMmDd(candidate);

          // Skip dates already marked complete by the teacher
          if (completedSet.has(dateStr)) {
            continue;
          }

          // If baseDateStr exists (e.g. Starts 07 Nov 2026), do not pick a date before start date
          if (baseDateStr) {
            const parts = baseDateStr.split('-').map((v) => parseInt(v, 10));
            if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
              const minStart = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
              if (candidate.getTime() < minStart.getTime()) {
                continue;
              }
            }
          }

          // If endDateStr exists, do not schedule sessions after end date
          if (endDateStr) {
            const parts = endDateStr.split('-').map((v) => parseInt(v, 10));
            if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
              const maxEnd = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
              if (candidate.getTime() > maxEnd.getTime()) {
                continue;
              }
            }
          }

          // 90-minute session window (matching join window duration)
          const sessionExpiry = candidate.getTime() + 90 * 60 * 1000;
          if (sessionExpiry > now.getTime()) {
            const isToday =
              offset === 0 && candidate.toDateString() === now.toDateString();
            const tomorrow = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 1,
            );
            const isTomorrow =
              candidate.toDateString() === tomorrow.toDateString();

            const formattedDate = candidate.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            const dayName = candidate.toLocaleDateString('en-IN', {
              weekday: 'short',
            });

            const prefix = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : dayName;
            const displayTiming = `${prefix}, ${formattedDate} | ${timeString}`;

            return {
              nextDate: candidate,
              dateStr,
              formattedDate,
              dayName,
              timeString,
              displayTiming,
              isToday,
              isTomorrow,
            };
          }
        }
      }
    }
  }

  // If no weekdays, but baseDateStr exists (one-off class batch)
  if (baseDateStr && !completedSet.has(baseDateStr)) {
    const parts = baseDateStr.split('-').map((v) => parseInt(v, 10));
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const candidate = new Date(
        parts[0],
        parts[1] - 1,
        parts[2],
        hour,
        minute,
        0,
        0,
      );
      const isToday = candidate.toDateString() === now.toDateString();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      const isTomorrow = candidate.toDateString() === tomorrow.toDateString();

      const formattedDate = candidate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const dayName = candidate.toLocaleDateString('en-IN', {
        weekday: 'short',
      });
      const prefix = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : dayName;
      const displayTiming = `${prefix}, ${formattedDate} | ${timeString}`;

      return {
        nextDate: candidate,
        dateStr: baseDateStr,
        formattedDate,
        dayName,
        timeString,
        displayTiming,
        isToday,
        isTomorrow,
      };
    }
  }

  return null;
};

export interface ClassJoinStatus {
  canJoin: boolean;
  minutesUntilOpen: number;
  opensAtDate: Date | null;
  opensAtTimeStr: string;
  sessionDateStr: string;
  isToday: boolean;
  isOngoing: boolean;
  reason: string;
}

/**
 * Checks if a user is currently allowed to join the live class.
 * Joining is strictly restricted to starting 10 minutes before the scheduled class time,
 * and remains active throughout the duration of the class session.
 */
export const getClassJoinStatus = (
  weekdays?: string[],
  startTimeStr?: string,
  startDateStr?: string,
  timingFallback?: string,
  endDateStr?: string,
  completedSessions?: string[],
): ClassJoinStatus => {
  const session = getNextUpcomingSession(
    weekdays,
    startTimeStr,
    startDateStr,
    timingFallback,
    endDateStr,
    completedSessions,
  );

  if (!session) {
    return {
      canJoin: false,
      minutesUntilOpen: 999999,
      opensAtDate: null,
      opensAtTimeStr: '',
      sessionDateStr: '',
      isToday: false,
      isOngoing: false,
      reason: 'Schedule TBA',
    };
  }

  const now = Date.now();
  const sessionStartTime = session.nextDate.getTime();
  const joinWindowOpenTime = sessionStartTime - 10 * 60 * 1000; // 10 minutes prior
  const sessionEndTime = sessionStartTime + 90 * 60 * 1000; // 90 min session window

  const canJoin = now >= joinWindowOpenTime && now <= sessionEndTime;
  const isOngoing = now >= sessionStartTime && now <= sessionEndTime;

  const opensAtDate = new Date(joinWindowOpenTime);
  const opensAtTimeStr = formatTo12HourString(
    opensAtDate.getHours(),
    opensAtDate.getMinutes(),
  );

  const diffMs = joinWindowOpenTime - now;
  const minutesUntilOpen = diffMs > 0 ? Math.ceil(diffMs / (60 * 1000)) : 0;

  let reason = '';
  if (canJoin) {
    reason = isOngoing ? 'Class is live now!' : 'Class starts in less than 10 minutes';
  } else if (now > sessionEndTime) {
    reason = 'This session has concluded';
  } else if (session.isToday) {
    if (minutesUntilOpen <= 60) {
      reason = `Opens in ${minutesUntilOpen} min (${opensAtTimeStr})`;
    } else {
      reason = `Opens today at ${opensAtTimeStr}`;
    }
  } else {
    reason = `Opens on ${session.dayName} at ${opensAtTimeStr}`;
  }

  return {
    canJoin,
    minutesUntilOpen,
    opensAtDate,
    opensAtTimeStr,
    sessionDateStr: session.displayTiming,
    isToday: session.isToday,
    isOngoing,
    reason,
  };
};

export interface BatchSessionInput {
  weekdays?: string[];
  startTime?: string;
  startDate?: string;
  endDate?: string;
  timing?: string;
  completedSessions?: string[];
  activeSessionDate?: string;
  mentorId?: any;
  mentor?: { _id?: string; name?: string };
  mentorName?: string;
  createdAt?: string;
  status?: string;
}

export interface BatchSessionState {
  nextSession: NextSessionResult | null;
  joinStatus: ClassJoinStatus;
  awaitingTeacherCompletion: boolean;
  pendingSessionDate: string;
  pendingFormattedDate: string;
  canTeacherMarkComplete: boolean;
}

/**
 * Computes full session state for a batch, locking next class details whenever
 * a scheduled/started class has elapsed without the teacher marking it complete.
 */
export const getBatchSessionState = (cls: BatchSessionInput): BatchSessionState => {
  const completed = Array.isArray(cls.completedSessions) ? cls.completedSessions : [];
  const completedSet = new Set(completed);
  const { hour, minute } = parseTimeToHoursAndMinutes(cls.startTime || cls.timing);
  const now = new Date();
  const nowMs = now.getTime();
  const todayStr = formatYyyyMmDd(now);

  const mName = (cls.mentorName || '').trim();
  const hasTeacher = Boolean(
    cls.mentorId ||
      cls.mentor?._id ||
      (mName && mName !== 'Unassigned' && mName !== 'Instructor'),
  );

  // 1. Check explicit activeSessionDate tracked on backend that is not yet marked complete
  if (cls.activeSessionDate && !completedSet.has(cls.activeSessionDate)) {
    const activeDate = cls.activeSessionDate;
    const parts = activeDate.split('-').map((v) => parseInt(v, 10));
    let sessionEndMs = 0;
    let joinOpenMs = 0;
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const startDt = new Date(parts[0], parts[1] - 1, parts[2], hour, minute, 0, 0);
      joinOpenMs = startDt.getTime() - 10 * 60 * 1000;
      sessionEndMs = startDt.getTime() + 90 * 60 * 1000;
    }

    if (activeDate === todayStr && sessionEndMs > 0 && nowMs <= sessionEndMs) {
      const nextSession = getNextUpcomingSession(
        cls.weekdays,
        cls.startTime,
        cls.startDate,
        cls.timing,
        cls.endDate,
        completed,
      );
      const joinStatus = getClassJoinStatus(
        cls.weekdays,
        cls.startTime,
        cls.startDate,
        cls.timing,
        cls.endDate,
        completed,
      );
      return {
        nextSession,
        joinStatus,
        awaitingTeacherCompletion: false,
        pendingSessionDate: activeDate,
        pendingFormattedDate: formatPrettyDate(activeDate),
        canTeacherMarkComplete: nowMs >= joinOpenMs,
      };
    }

    // Active session has concluded (or is from a prior date) and is still unmarked by teacher
    return {
      nextSession: null,
      joinStatus: {
        canJoin: false,
        minutesUntilOpen: 999999,
        opensAtDate: null,
        opensAtTimeStr: '',
        sessionDateStr: '',
        isToday: false,
        isOngoing: false,
        reason: 'Waiting for teacher to mark current class as complete',
      },
      awaitingTeacherCompletion: true,
      pendingSessionDate: activeDate,
      pendingFormattedDate: formatPrettyDate(activeDate),
      canTeacherMarkComplete: true,
    };
  }

  // 2. Check if today's scheduled class (with assigned teacher) already ended without completion
  if (
    hasTeacher &&
    !completedSet.has(todayStr) &&
    !(cls.startDate && /^\d{4}-\d{2}-\d{2}$/.test(cls.startDate) && todayStr < cls.startDate) &&
    !(cls.endDate && /^\d{4}-\d{2}-\d{2}$/.test(cls.endDate) && todayStr > cls.endDate)
  ) {
    const activeWeekdays = extractActiveWeekdays(cls.weekdays, cls.timing);
    const targetDayIndexes = activeWeekdays
      .map((w) => DAY_MAP[w.toLowerCase().trim()])
      .filter((idx) => typeof idx === 'number');

    const runsToday =
      targetDayIndexes.length > 0
        ? targetDayIndexes.includes(now.getDay())
        : cls.startDate === todayStr;

    if (runsToday) {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
      const todayEndMs = todayStart.getTime() + 90 * 60 * 1000;
      const createdMs = cls.createdAt ? new Date(cls.createdAt).getTime() : 0;

      if (nowMs > todayEndMs && (!createdMs || createdMs <= todayStart.getTime())) {
        return {
          nextSession: null,
          joinStatus: {
            canJoin: false,
            minutesUntilOpen: 999999,
            opensAtDate: null,
            opensAtTimeStr: '',
            sessionDateStr: '',
            isToday: false,
            isOngoing: false,
            reason: 'Waiting for teacher to mark today\'s class as complete',
          },
          awaitingTeacherCompletion: true,
          pendingSessionDate: todayStr,
          pendingFormattedDate: formatPrettyDate(todayStr),
          canTeacherMarkComplete: true,
        };
      }
    }
  }

  // 3. Normal upcoming session
  const nextSession = getNextUpcomingSession(
    cls.weekdays,
    cls.startTime,
    cls.startDate,
    cls.timing,
    cls.endDate,
    completed,
  );
  const joinStatus = getClassJoinStatus(
    cls.weekdays,
    cls.startTime,
    cls.startDate,
    cls.timing,
    cls.endDate,
    completed,
  );

  return {
    nextSession,
    joinStatus,
    awaitingTeacherCompletion: false,
    pendingSessionDate: nextSession?.isToday ? nextSession.dateStr : '',
    pendingFormattedDate: nextSession?.isToday ? nextSession.formattedDate : '',
    canTeacherMarkComplete: Boolean(joinStatus.canJoin && nextSession?.isToday),
  };
};
