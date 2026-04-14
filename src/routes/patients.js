const express = require('express');
const router = express.Router();
const mockDB = require('../data/mockDB');

// Helper to safely generate next patient ID like P001, P002...
function generateNextPatientId() {
    if (!Array.isArray(mockDB.patients) || mockDB.patients.length === 0) {
        return 'P001';
    }

    const maxNum = mockDB.patients.reduce((max, patient) => {
        const idNum = parseInt(String(patient.id || '').replace('P', ''), 10);
        return Number.isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);

    return `P${String(maxNum + 1).padStart(3, '0')}`;
}

// GET all patients
router.get('/', (req, res) => {
    try {
        const { search } = req.query;

        let patients = [...mockDB.patients];

        if (search) {
            const term = search.toLowerCase().trim();
            patients = patients.filter((p) => {
                const name = String(p.name || '').toLowerCase();
                const id = String(p.id || '').toLowerCase();
                const contact = String(p.contact || '');
                return (
                    name.includes(term) ||
                    id.includes(term) ||
                    contact.includes(term)
                );
            });
        }

        return res.json({
            success: true,
            data: patients
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch patients'
        });
    }
});

// GET single patient by ID
router.get('/:id', (req, res) => {
    try {
        const patient = mockDB.patients.find(
            (p) => String(p.id) === String(req.params.id)
        );

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        return res.json({
            success: true,
            data: patient
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch patient'
        });
    }
});

// POST add new patient
router.post('/', (req, res) => {
    try {
        const { name, age, gender, contact } = req.body;

        if (!name || !age || !gender || !contact) {
            return res.status(400).json({
                success: false,
                message: 'Name, age, gender and contact are required'
            });
        }

        const trimmedName = String(name).trim();
        const trimmedContact = String(contact).trim();

        if (!/^\d{10}$/.test(trimmedContact)) {
            return res.status(400).json({
                success: false,
                message: 'Contact number must be exactly 10 digits'
            });
        }

        const newPatient = {
            id: generateNextPatientId(),
            name: trimmedName,
            age: Number(age),
            gender: String(gender).trim(),
            contact: trimmedContact
        };

        mockDB.patients.push(newPatient);

        return res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            data: newPatient
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create patient'
        });
    }
});

// PUT update patient
router.put('/:id', (req, res) => {
    try {
        const patientIndex = mockDB.patients.findIndex(
            (p) => String(p.id) === String(req.params.id)
        );

        if (patientIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const existingPatient = mockDB.patients[patientIndex];
        const { name, age, gender, contact } = req.body;

        if (contact && !/^\d{10}$/.test(String(contact).trim())) {
            return res.status(400).json({
                success: false,
                message: 'Contact number must be exactly 10 digits'
            });
        }

        const updatedPatient = {
            ...existingPatient,
            name: name !== undefined ? String(name).trim() : existingPatient.name,
            age: age !== undefined ? Number(age) : existingPatient.age,
            gender: gender !== undefined ? String(gender).trim() : existingPatient.gender,
            contact: contact !== undefined ? String(contact).trim() : existingPatient.contact,
            id: existingPatient.id
        };

        mockDB.patients[patientIndex] = updatedPatient;

        return res.json({
            success: true,
            message: 'Patient updated successfully',
            data: updatedPatient
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update patient'
        });
    }
});

// DELETE patient
router.delete('/:id', (req, res) => {
    try {
        const patientIndex = mockDB.patients.findIndex(
            (p) => String(p.id) === String(req.params.id)
        );

        if (patientIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const deletedPatient = mockDB.patients.splice(patientIndex, 1)[0];

        return res.json({
            success: true,
            message: 'Patient deleted successfully',
            data: deletedPatient
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete patient'
        });
    }
});

module.exports = router;