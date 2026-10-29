import '../models/student_user.dart';

class DirectoryStudent {
  final int id;
  final String name;
  final String admissionNo;
  final String className;
  final String sectionName;
  final String rollNo;
  final String gender;
  final String dob;
  final String email;
  final String parentName;
  final String parentPhone;

  const DirectoryStudent({
    required this.id,
    required this.name,
    required this.admissionNo,
    required this.className,
    required this.sectionName,
    required this.rollNo,
    required this.gender,
    required this.dob,
    required this.email,
    required this.parentName,
    required this.parentPhone,
  });

  String get classSection => '$className - $sectionName';
}

class StudentDirectoryService {
  static const List<DirectoryStudent> students = [
    DirectoryStudent(
      id: 1,
      name: 'Aarav Kumar',
      admissionNo: 'ADM-2025-001',
      className: 'Class 5',
      sectionName: 'A',
      rollNo: '01',
      gender: 'Male',
      dob: '2015-05-12',
      email: 'aarav.adm-2025-001@student.vidyamandir.edu',
      parentName: 'Rajesh Kumar',
      parentPhone: '+91 9842101234',
    ),
    DirectoryStudent(
      id: 2,
      name: 'Aditi Menon',
      admissionNo: 'ADM-2025-002',
      className: 'Class 5',
      sectionName: 'A',
      rollNo: '02',
      gender: 'Female',
      dob: '2015-08-23',
      email: 'aditi.adm-2025-002@student.vidyamandir.edu',
      parentName: 'Suresh Menon',
      parentPhone: '+91 9842101235',
    ),
    DirectoryStudent(
      id: 3,
      name: 'Ananya Iyer',
      admissionNo: 'ADM-2025-003',
      className: 'Class 5',
      sectionName: 'B',
      rollNo: '03',
      gender: 'Female',
      dob: '2015-02-14',
      email: 'ananya.adm-2025-003@student.vidyamandir.edu',
      parentName: 'Ramesh Iyer',
      parentPhone: '+91 9842101236',
    ),
    DirectoryStudent(
      id: 4,
      name: 'Bilal Farooq',
      admissionNo: 'ADM-2025-004',
      className: 'Class 6',
      sectionName: 'A',
      rollNo: '04',
      gender: 'Male',
      dob: '2014-11-03',
      email: 'bilal.adm-2025-004@student.vidyamandir.edu',
      parentName: 'Farooq Ahmed',
      parentPhone: '+91 9842101237',
    ),
    DirectoryStudent(
      id: 5,
      name: 'Chris Thomas',
      admissionNo: 'ADM-2025-005',
      className: 'Class 6',
      sectionName: 'B',
      rollNo: '05',
      gender: 'Male',
      dob: '2014-07-19',
      email: 'chris.adm-2025-005@student.vidyamandir.edu',
      parentName: 'Thomas George',
      parentPhone: '+91 9842101238',
    ),
    DirectoryStudent(
      id: 6,
      name: 'Diya Karthik',
      admissionNo: 'ADM-2025-006',
      className: 'Class 7',
      sectionName: 'A',
      rollNo: '06',
      gender: 'Female',
      dob: '2013-09-30',
      email: 'diya.adm-2025-006@student.vidyamandir.edu',
      parentName: 'Karthik Raja',
      parentPhone: '+91 9842101239',
    ),
    DirectoryStudent(
      id: 7,
      name: 'Harish Prakash',
      admissionNo: 'ADM-2025-007',
      className: 'Class 7',
      sectionName: 'B',
      rollNo: '07',
      gender: 'Male',
      dob: '2013-04-16',
      email: 'harish.adm-2025-007@student.vidyamandir.edu',
      parentName: 'Prakash M.',
      parentPhone: '+91 9842101240',
    ),
    DirectoryStudent(
      id: 8,
      name: 'Ishita Vijay',
      admissionNo: 'ADM-2025-008',
      className: 'Class 8',
      sectionName: 'A',
      rollNo: '08',
      gender: 'Female',
      dob: '2012-12-05',
      email: 'ishita.adm-2025-008@student.vidyamandir.edu',
      parentName: 'Vijay Anand',
      parentPhone: '+91 9842101241',
    ),
    DirectoryStudent(
      id: 9,
      name: 'Kavin Murugan',
      admissionNo: 'ADM-2025-009',
      className: 'Class 8',
      sectionName: 'B',
      rollNo: '09',
      gender: 'Male',
      dob: '2012-06-21',
      email: 'kavin.adm-2025-009@student.vidyamandir.edu',
      parentName: 'Murugan P.',
      parentPhone: '+91 9842101242',
    ),
    DirectoryStudent(
      id: 10,
      name: 'Lavanya Balamurugan',
      admissionNo: 'ADM-2025-010',
      className: 'Class 9',
      sectionName: 'A',
      rollNo: '10',
      gender: 'Female',
      dob: '2011-03-18',
      email: 'lavanya.adm-2025-010@student.vidyamandir.edu',
      parentName: 'Balamurugan S.',
      parentPhone: '+91 9842101243',
    ),
    DirectoryStudent(
      id: 11,
      name: 'Manoj Kumar',
      admissionNo: 'ADM-2025-011',
      className: 'Class 9',
      sectionName: 'B',
      rollNo: '11',
      gender: 'Male',
      dob: '2011-01-25',
      email: 'manoj.adm-2025-011@student.vidyamandir.edu',
      parentName: 'Kishore Kumar',
      parentPhone: '+91 9842101244',
    ),
    DirectoryStudent(
      id: 12,
      name: 'Nandhini Menon',
      admissionNo: 'ADM-2025-012',
      className: 'Class 10',
      sectionName: 'A',
      rollNo: '12',
      gender: 'Female',
      dob: '2010-10-11',
      email: 'nandhini.adm-2025-012@student.vidyamandir.edu',
      parentName: 'Radhakrishnan Menon',
      parentPhone: '+91 9842101245',
    ),
    DirectoryStudent(
      id: 13,
      name: 'Pranav Iyer',
      admissionNo: 'ADM-2025-013',
      className: 'Class 10',
      sectionName: 'B',
      rollNo: '13',
      gender: 'Male',
      dob: '2010-05-09',
      email: 'pranav.adm-2025-013@student.vidyamandir.edu',
      parentName: 'Venkatesh Iyer',
      parentPhone: '+91 9842101246',
    ),
    DirectoryStudent(
      id: 14,
      name: 'Rohan Farooq',
      admissionNo: 'ADM-2025-014',
      className: 'Class 11',
      sectionName: 'A',
      rollNo: '14',
      gender: 'Male',
      dob: '2009-08-17',
      email: 'rohan.adm-2025-014@student.vidyamandir.edu',
      parentName: 'Farooq Abdullah',
      parentPhone: '+91 9842101247',
    ),
    DirectoryStudent(
      id: 15,
      name: 'Sneha Thomas',
      admissionNo: 'ADM-2025-015',
      className: 'Class 12',
      sectionName: 'A',
      rollNo: '15',
      gender: 'Female',
      dob: '2008-04-02',
      email: 'sneha.adm-2025-015@student.vidyamandir.edu',
      parentName: 'Thomas Chacko',
      parentPhone: '+91 9842101248',
    ),
  ];

  // Search by query (Admission No, Name, Class)
  static List<DirectoryStudent> search(String query) {
    if (query.trim().isEmpty) return students;
    final q = query.trim().toLowerCase();
    return students.where((s) {
      return s.name.toLowerCase().contains(q) ||
             s.admissionNo.toLowerCase().contains(q) ||
             s.className.toLowerCase().contains(q) ||
             s.sectionName.toLowerCase().contains(q);
    }).toList();
  }

  // Build full StudentUser from directory or custom admission number
  static StudentUser getStudentUser(String query) {
    final matches = search(query);
    final s = matches.isNotEmpty ? matches.first : _synthesizeStudent(query);

    return StudentUser(
      id: s.id + 1,
      name: s.name,
      email: s.email,
      role: 'student',
      branchName: 'Main Campus (Coimbatore)',
      student: StudentProfile(
        id: s.id,
        admissionNumber: s.admissionNo,
        rollNumber: s.rollNo,
        firstName: s.name.split(' ').first,
        lastName: s.name.split(' ').length > 1 ? s.name.split(' ').sublist(1).join(' ') : '',
        className: s.className,
        sectionName: s.sectionName,
        dob: s.dob,
        gender: s.gender,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        parentEmail: 'parent.${s.admissionNo.toLowerCase()}@vidyamandir.edu',
        address: 'Gandhipuram, Coimbatore, Tamil Nadu',
      ),
    );
  }

  static DirectoryStudent _synthesizeStudent(String query) {
    final clean = query.trim().toUpperCase();
    return DirectoryStudent(
      id: 99,
      name: 'Student $clean',
      admissionNo: clean.startsWith('ADM') ? clean : 'ADM-2025-$clean',
      className: 'Class 5',
      sectionName: 'A',
      rollNo: '99',
      gender: 'Male',
      dob: '2015-05-12',
      email: 'student.${clean.toLowerCase()}@vidyamandir.edu',
      parentName: 'Parent of $clean',
      parentPhone: '+91 9842101299',
    );
  }
}
