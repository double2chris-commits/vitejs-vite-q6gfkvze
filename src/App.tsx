import React, { useState, useEffect, useMemo } from 'react';

// The 3 members: Chris, Dila, and Charmaine
const MEMBERS = [
  {
    id: 'chris',
    name: 'Chris',
    initial: 'C',
    colorHex: '#4F46E5', // Indigo
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    borderCol: 'border-indigo-200',
    dotCol: 'bg-indigo-600',
  },
  {
    id: 'dila',
    name: 'Dila',
    initial: 'D',
    colorHex: '#059669', // Emerald
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    borderCol: 'border-emerald-200',
    dotCol: 'bg-emerald-600',
  },
  {
    id: 'charmaine',
    name: 'Charmaine',
    initial: 'Ch',
    colorHex: '#7C3AED', // Purple
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    borderCol: 'border-purple-200',
    dotCol: 'bg-purple-600',
  },
];

// Sample Initial Tasks matching user schedule
const INITIAL_TASKS = [
  {
    id: 't-1',
    title: 'Play badminton',
    date: '2026-10-11',
    time: '08:00',
    userId: 'chris',
    notes: 'Court 3 with group',
  },
  {
    id: 't-2',
    title: 'Meeting',
    date: '2026-10-11',
    time: '13:00',
    userId: 'dila',
    notes: 'Project roadmap and tasks assignment',
  },
  {
    id: 't-3',
    title: 'Lab work',
    date: '2026-10-13',
    time: '14:00',
    userId: 'charmaine',
    notes: 'Sample testing & documentation',
  },
  {
    id: 't-4',
    title: 'Group Study & Review',
    date: '2026-10-18',
    time: '10:00',
    userId: 'chris',
    notes: 'Library Discussion Room B',
  },
];

// Public Holidays (Malaysia 2026)
const PUBLIC_HOLIDAYS_2026 = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-02-17', name: 'Chinese New Year' },
  { date: '2026-03-20', name: 'Hari Raya Aidilfitri' },
  { date: '2026-05-01', name: 'Labour Day' },
  { date: '2026-08-31', name: 'National Day (Merdeka)' },
  { date: '2026-09-16', name: 'Malaysia Day' },
  { date: '2026-10-10', name: 'Deepavali' },
  { date: '2026-12-25', name: 'Christmas Day' },
];

const formatTime12h = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minutePadded = m < 10 ? `0${m}` : m;
  return `${hour12}:${minutePadded} ${period}`;
};

const formatReadableDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatDayAndMonth = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
};

const getDayName = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
};

const Icons = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Summary: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Copy: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
};

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'summary' | 'friends'
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 1)); // October 2026
  const [calendarMode, setCalendarMode] = useState('cards'); // 'cards' (spacious) | 'grid' (7-day)
  const [showHolidays, setShowHolidays] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Multi-Calendar Friend filter toggles for Chris, Dila, Charmaine
  const [userInclusions, setUserInclusions] = useState({
    chris: true,
    dila: true,
    charmaine: true,
  });

  // Task list storage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('clean_agenda_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDate, setFormDate] = useState('2026-10-11');
  const [formTime, setFormTime] = useState('08:00');
  const [formTitle, setFormTitle] = useState('');
  const [formUserId, setFormUserId] = useState('chris');
  const [formNotes, setFormNotes] = useState('');

  // Persist tasks
  useEffect(() => {
    try {
      localStorage.setItem('clean_agenda_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [tasks]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleUserInclusion = (userId) => {
    setUserInclusions((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const setAllUsers = (status) => {
    setUserInclusions({
      chris: status,
      dila: status,
      charmaine: status,
    });
  };

  // Filter tasks based on friend toggles
  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => userInclusions[t.userId]);
  }, [tasks, userInclusions]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Current Month's days list for Spacious Cards View
  const monthCardsList = useMemo(() => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTasks = visibleTasks
        .filter((t) => t.date === dateStr)
        .sort((a, b) => a.time.localeCompare(b.time));
      const holiday = PUBLIC_HOLIDAYS_2026.find((h) => h.date === dateStr);

      // Only show days that have tasks or holidays, or allow user to inspect all days
      days.push({
        dateStr,
        dayNumber: d,
        dayName: getDayName(dateStr),
        tasks: dayTasks,
        holiday: holiday || null,
        hasActivity: dayTasks.length > 0 || (showHolidays && !!holiday),
      });
    }

    return days;
  }, [year, month, visibleTasks, showHolidays]);

  // Direct Summary chronological grouping (as requested by user)
  const summaryDateGroups = useMemo(() => {
    const map = {};
    visibleTasks.forEach((t) => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });

    const sortedDates = Object.keys(map).sort();
    return sortedDates.map((dateStr) => ({
      dateStr,
      tasks: map[dateStr].sort((a, b) => a.time.localeCompare(b.time)),
      holiday: PUBLIC_HOLIDAYS_2026.find((h) => h.date === dateStr),
    }));
  }, [visibleTasks]);

  const handleCopySummaryText = () => {
    if (summaryDateGroups.length === 0) {
      showToast('No tasks to copy');
      return;
    }

    let cleanText = '';
    summaryDateGroups.forEach((group, index) => {
      cleanText += `${formatDayAndMonth(group.dateStr)}\n`;
      group.tasks.forEach((task) => {
        const member = MEMBERS.find((m) => m.id === task.userId);
        cleanText += `${formatTime12h(task.time)} - ${task.title}${member ? ` [${member.name}]` : ''}\n`;
      });
      if (index < summaryDateGroups.length - 1) {
        cleanText += '\n';
      }
    });

    navigator.clipboard.writeText(cleanText).then(() => {
      showToast('Copied summary to clipboard!');
    }).catch(() => {
      showToast('Failed to copy');
    });
  };

  const handleOpenAddModal = (dateStr) => {
    setFormDate(dateStr || `${year}-${String(month + 1).padStart(2, '0')}-11`);
    setFormTime('08:00');
    setFormTitle('');
    setFormUserId('chris');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newTask = {
      id: `task_${Date.now()}`,
      title: formTitle.trim(),
      date: formDate,
      time: formTime,
      userId: formUserId,
      notes: formNotes.trim(),
    };

    setTasks((prev) => [...prev, newTask]);
    setIsModalOpen(false);
    showToast('Task added successfully');
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task removed');
  };

  const monthLabel = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center text-slate-800 antialiased font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Shell */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[850px] sm:my-4 sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-200/80 flex flex-col relative overflow-hidden">
        
        {/* Top App Header */}
        <header className="bg-white border-b border-slate-100 px-5 pt-4 pb-3 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                C
              </div>
              <div>
                <h1 className="font-bold text-base text-slate-900 leading-tight">Shared Calendar</h1>
                <p className="text-[11px] text-slate-400">Chris, Dila & Charmaine</p>
              </div>
            </div>

            {/* Public Holiday Toggle Button */}
            <button
              onClick={() => setShowHolidays(!showHolidays)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border transition flex items-center gap-1.5 ${
                showHolidays
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showHolidays ? 'bg-amber-500' : 'bg-slate-300'}`} />
              <span>Holidays {showHolidays ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Quick Friend Filter Bar */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 overflow-x-auto pb-0.5">
            <span className="text-[11px] font-medium text-slate-400 shrink-0">Filter:</span>
            {MEMBERS.map((m) => {
              const active = userInclusions[m.id];
              return (
                <button
                  key={m.id}
                  onClick={() => toggleUserInclusion(m.id)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border transition shrink-0 flex items-center gap-1.5 ${
                    active
                      ? `${m.badgeBg} ${m.badgeText} ${m.borderCol}`
                      : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? m.dotCol : 'bg-slate-300'}`} />
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
          
          {/* TAB 1: MONTHLY CALENDAR VIEW */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              
              {/* Month Selector Bar */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition shadow-2xs"
                  >
                    <Icons.ChevronLeft />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition shadow-2xs"
                  >
                    <Icons.ChevronRight />
                  </button>
                  <div className="ml-2 font-bold text-sm text-slate-900">
                    {monthLabel}
                  </div>
                </div>

                {/* View Switcher: Spacious Cards vs 7-Day Grid */}
                <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setCalendarMode('cards')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      calendarMode === 'cards'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setCalendarMode('grid')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      calendarMode === 'grid'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>

              {/* VIEW A: Spacious Day Cards with Full, Clear Tasks */}
              {calendarMode === 'cards' && (
                <div className="space-y-3">
                  {monthCardsList.filter((d) => d.hasActivity).length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                        <Icons.Calendar />
                      </div>
                      <h3 className="font-semibold text-slate-700 text-sm">No tasks for this month</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Tap the + button below to schedule tasks for Chris, Dila, or Charmaine.
                      </p>
                    </div>
                  ) : (
                    monthCardsList
                      .filter((d) => d.hasActivity)
                      .map((day) => (
                        <div
                          key={day.dateStr}
                          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-indigo-200 transition"
                        >
                          {/* Date Header */}
                          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                                {day.dayNumber}
                              </span>
                              <span className="font-bold text-sm text-slate-900">
                                {formatDayAndMonth(day.dateStr)}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">
                                ({day.dayName})
                              </span>
                            </div>

                            <button
                              onClick={() => handleOpenAddModal(day.dateStr)}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
                            >
                              + Add
                            </button>
                          </div>

                          {/* Public Holiday Banner */}
                          {showHolidays && day.holiday && (
                            <div className="mt-2.5 bg-amber-50/80 border border-amber-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-amber-800">
                              <span className="font-semibold">Public Holiday</span>
                              <span>{day.holiday.name}</span>
                            </div>
                          )}

                          {/* Clear Full Task Items */}
                          <div className="mt-3 space-y-2">
                            {day.tasks.map((task) => {
                              const member = MEMBERS.find((m) => m.id === task.userId);
                              return (
                                <div
                                  key={task.id}
                                  className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex items-start justify-between gap-3 hover:bg-slate-50 transition"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                                        {formatTime12h(task.time)}
                                      </span>
                                      {member && (
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${member.badgeBg} ${member.badgeText} ${member.borderCol}`}>
                                          {member.name}
                                        </span>
                                      )}
                                    </div>
                                    <div className="font-semibold text-slate-900 text-sm">
                                      {task.title}
                                    </div>
                                    {task.notes && (
                                      <p className="text-xs text-slate-500 mt-0.5">
                                        {task.notes}
                                      </p>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition"
                                    title="Delete task"
                                  >
                                    <Icons.Trash />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* VIEW B: 7-Day Monthly Grid */}
              {calendarMode === 'grid' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
                  <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 pb-2 mb-1 border-b border-slate-100">
                    <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {monthCardsList.map((day) => {
                      return (
                        <div
                          key={day.dateStr}
                          onClick={() => handleOpenAddModal(day.dateStr)}
                          className="min-h-[64px] border border-slate-100 rounded-xl p-1 flex flex-col justify-between hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-600">
                              {day.dayNumber}
                            </span>
                            {showHolidays && day.holiday && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title={day.holiday.name} />
                            )}
                          </div>

                          <div className="space-y-0.5">
                            {day.tasks.slice(0, 2).map((t) => {
                              const member = MEMBERS.find((m) => m.id === t.userId);
                              return (
                                <div
                                  key={t.id}
                                  className={`text-[9px] font-semibold truncate rounded px-1 py-0.5 ${member ? `${member.badgeBg} ${member.badgeText}` : 'bg-slate-100 text-slate-700'}`}
                                >
                                  {t.title}
                                </div>
                              );
                            })}
                            {day.tasks.length > 2 && (
                              <div className="text-[8px] font-bold text-slate-400 pl-0.5">
                                +{day.tasks.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DIRECT SUMMARY VIEW */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              
              {/* Header bar with Copy Clean Text button */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Schedule Summary</h2>
                  <p className="text-xs text-slate-400">Chronological agenda for quick sharing</p>
                </div>

                <button
                  onClick={handleCopySummaryText}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Icons.Copy />
                  <span>Copy Text</span>
                </button>
              </div>

              {/* Requested clean format date list */}
              {summaryDateGroups.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs">
                  No tasks recorded for the selected members.
                </div>
              ) : (
                <div className="space-y-3">
                  {summaryDateGroups.map((group) => (
                    <div
                      key={group.dateStr}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs"
                    >
                      {/* Date Title: e.g. "11 October" */}
                      <div className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span>{formatDayAndMonth(group.dateStr)}</span>
                        {showHolidays && group.holiday && (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            {group.holiday.name}
                          </span>
                        )}
                      </div>

                      {/* Clean Task Rows: e.g. "8:00 AM - Play badminton [Chris]" */}
                      <div className="mt-2.5 space-y-2">
                        {group.tasks.map((task) => {
                          const member = MEMBERS.find((m) => m.id === task.userId);
                          return (
                            <div
                              key={task.id}
                              className="flex items-baseline justify-between text-xs py-1"
                            >
                              <div className="flex items-baseline gap-2 flex-1">
                                <span className="font-bold text-slate-700 min-w-[65px]">
                                  {formatTime12h(task.time)}
                                </span>
                                <span className="text-slate-400">-</span>
                                <span className="font-medium text-slate-900">
                                  {task.title}
                                </span>
                                {member && (
                                  <span className={`text-[11px] font-semibold ${member.badgeText}`}>
                                    [{member.name}]
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-slate-300 hover:text-rose-500 transition ml-2"
                              >
                                <Icons.Close />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FRIENDS & MULTI-CALENDAR SELECTION */}
          {activeTab === 'friends' && (
            <div className="space-y-4">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <h2 className="font-bold text-slate-900 text-sm">Friends Calendars</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose which calendars to include and view together
                </p>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setAllUsers(true)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setAllUsers(false)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Members Toggle Cards: Chris, Dila, Charmaine */}
              <div className="space-y-2.5">
                {MEMBERS.map((member) => {
                  const isIncluded = userInclusions[member.id];
                  const taskCount = tasks.filter((t) => t.userId === member.id).length;

                  return (
                    <div
                      key={member.id}
                      onClick={() => toggleUserInclusion(member.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                        isIncluded
                          ? `bg-white ${member.borderCol}`
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                          style={{ backgroundColor: member.colorHex }}
                        >
                          {member.initial}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">
                            {member.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {taskCount} scheduled {taskCount === 1 ? 'task' : 'tasks'}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                          isIncluded
                            ? `${member.badgeBg} ${member.badgeText} ${member.borderCol}`
                            : 'bg-slate-200 text-slate-500 border-slate-300'
                        }`}
                      >
                        {isIncluded ? 'Included' : 'Hidden'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Workspace Shared Code */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-center">
                <span className="text-xs font-semibold text-indigo-700">Workspace Room</span>
                <div className="font-mono font-bold text-sm text-indigo-900 mt-1 bg-white border border-indigo-200 px-3 py-1.5 rounded-xl inline-block">
                  TEAM-CHRIS-DILA-CHARMAINE
                </div>
                <p className="text-[11px] text-indigo-500 mt-2">
                  All 3 members can add and modify schedules in this shared view.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Floating Add Task Button */}
        <button
          onClick={() => handleOpenAddModal()}
          className="absolute right-5 bottom-20 z-30 w-13 h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition"
          aria-label="Add Task"
        >
          <Icons.Plus />
        </button>

        {/* Bottom Navigation Bar */}
        <nav className="bg-white border-t border-slate-100 h-16 flex items-center justify-around px-4 sticky bottom-0 z-20">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
              activeTab === 'calendar' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Icons.Calendar />
            <span className="text-[11px] mt-1">Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
              activeTab === 'summary' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Icons.Summary />
            <span className="text-[11px] mt-1">Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
              activeTab === 'friends' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Icons.Users />
            <span className="text-[11px] mt-1">Friends</span>
          </button>
        </nav>

        {isModalOpen && (
          <div className="fixed sm:absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-100 animate-slide-up">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Schedule New Task</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <Icons.Close />
                </button>
              </div>

              <form onSubmit={handleSaveTask} className="mt-4 space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Play badminton, Meeting, Lab work"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      required
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Assign To
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {MEMBERS.map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setFormUserId(m.id)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          formUserId === m.id
                            ? `${m.badgeBg} ${m.badgeText} ${m.borderCol} shadow-2xs`
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Location, details, or court number"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}