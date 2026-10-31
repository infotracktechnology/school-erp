class StudentProfile {
  final int id;
  final int? classId;
  final int? sectionId;
  final String admissionNumber;
  final String? rollNumber;
  final String firstName;
  final String? lastName;
  final String className;
  final String sectionName;
  final String? gender;
  final String? dob;
  final String? parentName;
  final String? parentPhone;
  final String? parentEmail;
  final String? address;

  StudentProfile({
    required this.id,
    this.classId,
    this.sectionId,
    required this.admissionNumber,
    this.rollNumber,
    required this.firstName,
    this.lastName,
    required this.className,
    required this.sectionName,
    this.gender,
    this.dob,
    this.parentName,
    this.parentPhone,
    this.parentEmail,
    this.address,
  });

  String get fullName => '$firstName ${lastName ?? ''}'.trim();
  String get classSection => '$className - $sectionName';

  factory StudentProfile.fromJson(Map<String, dynamic> json) {
    return StudentProfile(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      classId: json['class_id'] is int ? json['class_id'] : int.tryParse(json['class_id']?.toString() ?? ''),
      sectionId: json['section_id'] is int ? json['section_id'] : int.tryParse(json['section_id']?.toString() ?? ''),
      admissionNumber: json['admission_number']?.toString() ?? '',
      rollNumber: json['roll_number']?.toString(),
      firstName: json['first_name']?.toString() ?? '',
      lastName: json['last_name']?.toString(),
      className: json['class_name']?.toString() ?? 'Class',
      sectionName: json['section_name']?.toString() ?? 'A',
      gender: json['gender']?.toString(),
      dob: json['dob']?.toString(),
      parentName: json['parent_name']?.toString(),
      parentPhone: json['parent_phone']?.toString(),
      parentEmail: json['parent_email']?.toString(),
      address: json['address']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'class_id': classId,
      'section_id': sectionId,
      'admission_number': admissionNumber,
      'roll_number': rollNumber,
      'first_name': firstName,
      'last_name': lastName,
      'class_name': className,
      'section_name': sectionName,
      'gender': gender,
      'dob': dob,
      'parent_name': parentName,
      'parent_phone': parentPhone,
      'parent_email': parentEmail,
      'address': address,
    };
  }
}

class StudentUser {
  final int id;
  final String name;
  final String email;
  final String role;
  final String? branchName;
  final String? token;
  final StudentProfile? student;

  StudentUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.branchName,
    this.token,
    this.student,
  });

  factory StudentUser.fromJson(Map<String, dynamic> json, {String? token}) {
    return StudentUser(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      role: json['role']?.toString() ?? 'student',
      branchName: json['branch_name']?.toString(),
      token: token ?? json['token']?.toString(),
      student: json['student'] != null ? StudentProfile.fromJson(json['student']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'branch_name': branchName,
      'token': token,
      'student': student?.toJson(),
    };
  }
}
