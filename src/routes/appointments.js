const express = require('express');
const router = express.Router();
const mockDB = require('../data/mockDB');

// Helper to generate next appointment ID like A001, A002...
function generateNextAppointmentId() {
    if (!Array.isArray(mockDB.appointments) || mockDB.appointments.length === 0) {
        return 'A001';
    }

    const maxNum = mockDB.appointments.reduce((max, appointment) => {
        const idNum = parseInt(String(appointment.id || '').replace('A', ''), 10);
        return Number.isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);

    return `A${String(maxNum + 1).padStart(3, '0')}`;
}

// GET all appointments
router.get('/', (req, res) => {
    try {
        const { doctorId, patientId, date, status } = req.query;
        let appointments = [...mockDB.appointments];

        if (doctorId) {
            appointments = appointments.filter(
                (a) => String(a.doctorId) === String(doctorId)
            );
        }

        if (patientId) {
            appointments = appointments.filter(
                (a) => String(a.patientId) === String(patientId)
            );
        }

        if (date) {
            appointments = appointments.filter(
                (a) => String(a.date) === String(date)
            );
        }

        if (status) {
            appointments = appointments.filter(
                (a) => String(a.status).toLowerCase() === String(status).toLowerCase()
            );
        }

        return res.json({
            success: true,
            data: appointments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments'
        });
    }
});

// GET single appointment
router.get('/:id', (req, res) => {
    try {
        const appointment = mockDB.appointments.find(
            (a) => String(a.id) === String(req.params.id)
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        return res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch appointment'
        });
    }
});

// POST create appointment
router.post('/', (req, res) => {
    try {
        const { patientId, doctorId, date, time, status } = req.body;

        if (!patientId || !doctorId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Patient, doctor, date and time are required'
            });
        }

        // Check patient exists
        const patientExists = mockDB.patients.some(
            (p) => String(p.id) === String(patientId)
        );
        if (!patientExists) {
            return res.status(400).json({
                success: false,
                message: 'Selected patient does not exist'
            });
        }

        // Check doctor exists
        const doctor = mockDB.doctors.find(
            (d) => String(d.id) === String(doctorId)
        );
        if (!doctor) {
            return res.status(400).json({
                success: false,
                message: 'Selected doctor does not exist'
            });
        }

        if (doctor.available === false) {
            return res.status(400).json({
                success: false,
                message: 'Selected doctor is currently unavailable'
            });
        }

        // Prevent double-booking
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
                message: 'Doctor is already booked for this time slot'
            });
        }

        const newAppointment = {
            id: generateNextAppointmentId(),
            patientId: String(patientId).trim(),
            doctorId: String(doctorId).trim(),
            date: String(date).trim(),
            time: String(time).trim(),
            status: status ? String(status).trim() : 'Scheduled'
        };

        mockDB.appointments.push(newAppointment);

        return res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: newAppointment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create appointment'
        });
    }
});

// PUT update appointment
router.put('/:id', (req, res) => {
    try {
        const appointmentIndex = mockDB.appointments.findIndex(
            (a) => String(a.id) === String(req.params.id)
        );

        if (appointmentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        const existingAppointment = mockDB.appointments[appointmentIndex];
        const { patientId, doctorId, date, time, status } = req.body;

        // If changing doctor/date/time, re-check collision
        const nextDoctorId = doctorId !== undefined ? String(doctorId).trim() : existingAppointment.doctorId;
        const nextDate = date !== undefined ? String(date).trim() : existingAppointment.date;
        const nextTime = time !== undefined ? String(time).trim() : existingAppointment.time;

        const conflictingAppointment = mockDB.appointments.find(
            (a) =>
                String(a.id) !== String(req.params.id) &&
                String(a.doctorId) === String(nextDoctorId) &&
                String(a.date) === String(nextDate) &&
                String(a.time) === String(nextTime) &&
                String(a.status) !== 'Cancelled'
        );

        if (conflictingAppointment) {
            return res.status(409).json({
                success: false,
                message: 'Doctor is already booked for this updated time slot'
            });
        }

        const updatedAppointment = {
            ...existingAppointment,
            patientId: patientId !== undefined ? String(patientId).trim() : existingAppointment.patientId,
            doctorId: doctorId !== undefined ? String(doctorId).trim() : existingAppointment.doctorId,
            date: date !== undefined ? String(date).trim() : existingAppointment.date,
            time: time !== undefined ? String(time).trim() : existingAppointment.time,
            status: status !== undefined ? String(status).trim() : existingAppointment.status,
            id: existingAppointment.id
        };

        mockDB.appointments[appointmentIndex] = updatedAppointment;

        return res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: updatedAppointment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update appointment'
        });
    }
});

// DELETE appointment
router.delete('/:id', (req, res) => {
    try {
        const appointmentIndex = mockDB.appointments.findIndex(
            (a) => String(a.id) === String(req.params.id)
        );

        if (appointmentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        const deletedAppointment = mockDB.appointments.splice(appointmentIndex, 1)[0];

        return res.json({
            success: true,
            message: 'Appointment deleted successfully',
            data: deletedAppointment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete appointment'
        });
    }
});

module.exports = router;