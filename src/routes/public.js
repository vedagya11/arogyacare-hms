const express = require('express');
const router = express.Router();
const mockDB = require('../data/mockDB');

// Helper functions for ID generation
function generateNextPatientId() {
    if (!mockDB.patients || mockDB.patients.length === 0) return 'P001';
    const maxNum = mockDB.patients.reduce((max, p) => {
        const idNum = parseInt(String(p.id || '').replace('P', ''), 10);
        return Number.isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);
    return `P${String(maxNum + 1).padStart(3, '0')}`;
}

function generateNextAppointmentId() {
    if (!mockDB.appointments || mockDB.appointments.length === 0) return 'A001';
    const maxNum = mockDB.appointments.reduce((max, a) => {
        const idNum = parseInt(String(a.id || '').replace('A', ''), 10);
        return Number.isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);
    return `A${String(maxNum + 1).padStart(3, '0')}`;
}

// GET public doctors (only available doctors)
router.get('/doctors', (req, res) => {
    try {
        const publicDoctors = mockDB.doctors
            .filter(d => d.available)
            .map(d => ({
                id: d.id,
                name: d.name,
                specialty: d.specialty,
                experience: d.experience
            }));
        return res.json({ success: true, data: publicDoctors });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
    }
});

// POST book appointment
router.post('/book-appointment', (req, res) => {
    try {
        const { patientName, phone, age, gender, doctorId, date, time, reason } = req.body;

        if (!patientName || !phone || !age || !gender || !doctorId || !date || !time) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        // Find existing patient by contact number or create new
        let patient = mockDB.patients.find(p => String(p.contact) === String(phone));
        if (!patient) {
            patient = {
                id: generateNextPatientId(),
                name: String(patientName).trim(),
                age: parseInt(age, 10),
                gender: String(gender).trim(),
                contact: String(phone).trim()
            };
            mockDB.patients.push(patient);
        }

        // Check if doctor exists and is available
        const doctor = mockDB.doctors.find(d => String(d.id) === String(doctorId));
        if (!doctor || !doctor.available) {
            return res.status(400).json({ success: false, message: 'Doctor is not available at the moment' });
        }

        // Prevent double booking at same date/time
        const existing = mockDB.appointments.find(
            (a) =>
                String(a.doctorId) === String(doctorId) &&
                String(a.date) === String(date) &&
                String(a.time) === String(time) &&
                String(a.status) !== 'Cancelled'
        );

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'This doctor is already booked for the selected time slot. Please choose another time.'
            });
        }

        // Create appointment
        const newAppointment = {
            id: generateNextAppointmentId(),
            patientId: patient.id,
            doctorId: doctor.id,
            date: String(date).trim(),
            time: String(time).trim(),
            status: 'Scheduled',
            bookedBy: 'patient',
            reason: reason ? String(reason).trim() : ''
        };

        mockDB.appointments.push(newAppointment);

        return res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: newAppointment
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to book appointment due to a server error' });
    }
});

module.exports = router;
