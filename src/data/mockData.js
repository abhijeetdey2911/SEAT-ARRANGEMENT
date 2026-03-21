const today = new Date();

// Helper to build dates in the current month/year for demo
function buildDate(offsetDays) {
  const d = new Date(today);
  d.setDate(today.getDate() + offsetDays);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

export const mockStudent = {
  id: '25mca10005',
  password: '1234', // dummy only, not used for real auth
  name: 'Abhijeet Dey',
  rollNo: '25MCA10005',
  course: 'MCA',
  semester: '2th Semester',
};

export const mockExams = [
  {
    id: 'exam-1',
    subjectName: 'Data Structures & Algorithms',
    date: buildDate(-2),
    time: '09:00 AM - 12:00 PM',
    roomNumber: 'CS-201',
    benchNumber: 'B-12',
    seatNumber: '21',
    reportingTime: '08:30 AM',
    instructions: [
      'Carry your college ID card and admit card.',
      'Reporting time is 30 minutes before the exam.',
      'Use of electronic gadgets is strictly prohibited.',
    ],
    attendanceStatus: 'Exam Given',
  },
  {
    id: 'exam-2',
    subjectName: 'Database Management Systems',
    date: buildDate(0),
    time: '02:00 PM - 05:00 PM',
    roomNumber: 'CS-105',
    benchNumber: 'A-07',
    seatNumber: '09',
    reportingTime: '01:30 PM',
    instructions: [
      'Fill in your details carefully on the answer booklet.',
      'Use only blue/black ink pens.',
      'Talking during the exam is not allowed.',
    ],
    attendanceStatus: null, // decided after today
  },
  {
    id: 'exam-3',
    subjectName: 'Operating Systems',
    date: buildDate(2),
    time: '09:00 AM - 12:00 PM',
    roomNumber: 'CS-315',
    benchNumber: 'C-04',
    seatNumber: '04',
    reportingTime: '08:30 AM',
    instructions: [
      'Calculators are not allowed unless specified.',
      'Write your roll number on every sheet.',
    ],
    attendanceStatus: null,
  },
  {
    id: 'exam-4',
    subjectName: 'Computer Networks',
    date: buildDate(4),
    time: '02:00 PM - 05:00 PM',
    roomNumber: 'CS-108',
    benchNumber: 'D-02',
    seatNumber: '18',
    reportingTime: '01:30 PM',
    instructions: [
      'Do not write anything on the question paper.',
      'Submit your answer sheet before leaving the hall.',
    ],
    attendanceStatus: null,
  },
];

export function getExamStatus(exam) {
  const examDate = new Date(exam.date);
  const todayDate = new Date(today.toISOString().split('T')[0]);

  if (examDate.getTime() === todayDate.getTime()) {
    return 'Today';
  }
  if (examDate > todayDate) {
    return 'Upcoming';
  }
  return 'Completed';
}





