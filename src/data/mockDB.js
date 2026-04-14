// src/data/mockDB.js
// AarogyaCare Hospital demo in-memory data

const mockDB = {
    doctors: [
        {
            id: 'D001',
            name: 'Dr. Ananya Sharma',
            specialty: 'General Medicine',
            email: 'ananya@aarogyacare.in',
            phone: '9876500001',
            experience: 12,
            available: true
        },
        {
            id: 'D002',
            name: 'Dr. Rahul Verma',
            specialty: 'Cardiology',
            email: 'rahul@aarogyacare.in',
            phone: '9876500002',
            experience: 15,
            available: true
        },
        {
            id: 'D003',
            name: 'Dr. Priya Nair',
            specialty: 'Pediatrics',
            email: 'priya@aarogyacare.in',
            phone: '9876500003',
            experience: 8,
            available: true
        },
        {
            id: 'D004',
            name: 'Dr. Arjun Rao',
            specialty: 'Orthopedics',
            email: 'arjun@aarogyacare.in',
            phone: '9876500004',
            experience: 20,
            available: false
        },
        {
            id: 'D005',
            name: 'Dr. Meera Iyer',
            specialty: 'Dermatology',
            email: 'meera@aarogyacare.in',
            phone: '9876500005',
            experience: 10,
            available: true
        }
    ],

    patients: [
        { id: 'P001', name: 'Rohan Mehta', age: 34, gender: 'Male', contact: '9876543210' },
        { id: 'P002', name: 'Sneha Iyer', age: 28, gender: 'Female', contact: '9876543211' },
        { id: 'P003', name: 'Aditya Kapoor', age: 45, gender: 'Male', contact: '9876543212' },
        { id: 'P004', name: 'Kavya Reddy', age: 22, gender: 'Female', contact: '9876543213' },
        { id: 'P005', name: 'Neha Sharma', age: 31, gender: 'Female', contact: '9876543214' },
        { id: 'P006', name: 'Vivek Joshi', age: 50, gender: 'Male', contact: '9876543215' },
        { id: 'P007', name: 'Aarav Bhat', age: 10, gender: 'Male', contact: '9876543216' },
        { id: 'P008', name: 'Pooja Menon', age: 40, gender: 'Female', contact: '9876543217' }
    ],

    appointments: [
        {
            id: 'A001',
            patientId: 'P001',
            doctorId: 'D002',
            date: '2026-04-15',
            time: '10:00 AM',
            status: 'Scheduled'
        },
        {
            id: 'A002',
            patientId: 'P002',
            doctorId: 'D001',
            date: '2026-04-15',
            time: '11:00 AM',
            status: 'Completed'
        },
        {
            id: 'A003',
            patientId: 'P004',
            doctorId: 'D003',
            date: '2026-04-16',
            time: '09:30 AM',
            status: 'Scheduled'
        },
        {
            id: 'A004',
            patientId: 'P005',
            doctorId: 'D005',
            date: '2026-04-16',
            time: '03:00 PM',
            status: 'Cancelled'
        }
    ],

    medicalRecords: [
        {
            id: 'M001',
            patientId: 'P001',
            doctorId: 'D002',
            diagnosis: 'Mild Hypertension',
            prescription: 'Lisinopril 10mg once daily',
            notes: 'Advised low-salt diet and regular BP monitoring.',
            date: '2026-01-10'
        },
        {
            id: 'M002',
            patientId: 'P005',
            doctorId: 'D001',
            diagnosis: 'Migraine',
            prescription: 'Paracetamol 500mg as needed',
            notes: 'Patient advised hydration, proper sleep, and stress management.',
            date: '2026-02-15'
        },
        {
            id: 'M003',
            patientId: 'P007',
            doctorId: 'D003',
            diagnosis: 'Seasonal Viral Fever',
            prescription: 'Paracetamol syrup and rest for 3 days',
            notes: 'Temperature to be monitored twice daily.',
            date: '2026-03-08'
        }
    ],

    users: [
        { username: 'admin', password: 'password123', role: 'admin', doctorId: null },
        { username: 'doctor', password: 'password123', role: 'doctor', doctorId: 'D001' },
        { username: 'reception', password: 'password123', role: 'receptionist', doctorId: null }
    ]
};

module.exports = mockDB;