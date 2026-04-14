const express = require('express');
const router = express.Router();
const mockDB = require('../data/mockDB');

// Helper to generate next doctor ID like D001, D002...
function generateNextDoctorId() {
    if (!Array.isArray(mockDB.doctors) || mockDB.doctors.length === 0) {
        return 'D001';
    }

    const maxNum = mockDB.doctors.reduce((max, doctor) => {
        const idNum = parseInt(String(doctor.id || '').replace('D', ''), 10);
        return Number.isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);

    return `D${String(maxNum + 1).padStart(3, '0')}`;
}

// GET all doctors
router.get('/', (req, res) => {
    try {
        const { search } = req.query;
        let doctors = [...mockDB.doctors];

        if (search) {
            const term = search.toLowerCase().trim();
            doctors = doctors.filter((d) => {
                const name = String(d.name || '').toLowerCase();
                const id = String(d.id || '').toLowerCase();
                const specialty = String(d.specialty || d.specialization || '').toLowerCase();
                const email = String(d.email || '').toLowerCase();
                const phone = String(d.phone || '');
                return (
                    name.includes(term) ||
                    id.includes(term) ||
                    specialty.includes(term) ||
                    email.includes(term) ||
                    phone.includes(term)
                );
            });
        }

        return res.json({
            success: true,
            data: doctors
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors'
        });
    }
});

// GET single doctor
router.get('/:id', (req, res) => {
    try {
        const doctor = mockDB.doctors.find(
            (d) => String(d.id) === String(req.params.id)
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        return res.json({
            success: true,
            data: doctor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor'
        });
    }
});

// POST add doctor
router.post('/', (req, res) => {
    try {
        const { name, specialty, email, phone, experience, available } = req.body;

        if (!name || !specialty) {
            return res.status(400).json({
                success: false,
                message: 'Name and specialty are required'
            });
        }

        if (phone && !/^\d{10}$/.test(String(phone).trim())) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be exactly 10 digits'
            });
        }

        const newDoctor = {
            id: generateNextDoctorId(),
            name: String(name).trim(),
            specialty: String(specialty).trim(),
            email: email ? String(email).trim() : '',
            phone: phone ? String(phone).trim() : '',
            experience: experience !== undefined && experience !== ''
                ? Number(experience)
                : 0,
            available: available !== undefined ? Boolean(available) : true
        };

        mockDB.doctors.push(newDoctor);

        return res.status(201).json({
            success: true,
            message: 'Doctor added successfully',
            data: newDoctor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to add doctor'
        });
    }
});

// PUT update doctor
router.put('/:id', (req, res) => {
    try {
        const doctorIndex = mockDB.doctors.findIndex(
            (d) => String(d.id) === String(req.params.id)
        );

        if (doctorIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const existingDoctor = mockDB.doctors[doctorIndex];
        const { name, specialty, email, phone, experience, available } = req.body;

        if (phone && !/^\d{10}$/.test(String(phone).trim())) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be exactly 10 digits'
            });
        }

        const updatedDoctor = {
            ...existingDoctor,
            name: name !== undefined ? String(name).trim() : existingDoctor.name,
            specialty: specialty !== undefined ? String(specialty).trim() : existingDoctor.specialty,
            email: email !== undefined ? String(email).trim() : existingDoctor.email,
            phone: phone !== undefined ? String(phone).trim() : existingDoctor.phone,
            experience: experience !== undefined && experience !== ''
                ? Number(experience)
                : existingDoctor.experience,
            available: available !== undefined ? Boolean(available) : existingDoctor.available,
            id: existingDoctor.id
        };

        mockDB.doctors[doctorIndex] = updatedDoctor;

        return res.json({
            success: true,
            message: 'Doctor updated successfully',
            data: updatedDoctor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update doctor'
        });
    }
});

// DELETE doctor
router.delete('/:id', (req, res) => {
    try {
        const doctorIndex = mockDB.doctors.findIndex(
            (d) => String(d.id) === String(req.params.id)
        );

        if (doctorIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const deletedDoctor = mockDB.doctors.splice(doctorIndex, 1)[0];

        return res.json({
            success: true,
            message: 'Doctor deleted successfully',
            data: deletedDoctor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete doctor'
        });
    }
});

module.exports = router;