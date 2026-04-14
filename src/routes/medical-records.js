const express = require('express');
const router = express.Router();
const mockDB = require('../data/mockDB');

// Helper to generate next medical record ID like M001, M002...
function generateNextMedicalRecordId() {
    if (!Array.isArray(mockDB.medicalRecords) || mockDB.medicalRecords.length === 0) {
        return 'M001';
    }

    const maxNum = mockDB.medicalRecords.reduce((max, record) => {
        const idNum = parseInt(String(record.id || '').replace('M', ''), 10);
        return Number.isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);

    return `M${String(maxNum + 1).padStart(3, '0')}`;
}

// GET all medical records
// Optional filter: /api/medical-records?patientId=P001
router.get('/', (req, res) => {
    try {
        const { patientId } = req.query;

        let records = [...mockDB.medicalRecords];

        if (patientId) {
            records = records.filter(
                (record) => String(record.patientId) === String(patientId)
            );
        }

        return res.json({
            success: true,
            data: records
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch medical records'
        });
    }
});

// GET single medical record by ID
router.get('/:id', (req, res) => {
    try {
        const record = mockDB.medicalRecords.find(
            (r) => String(r.id) === String(req.params.id)
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Medical record not found'
            });
        }

        return res.json({
            success: true,
            data: record
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch medical record'
        });
    }
});

// POST add new medical record
router.post('/', (req, res) => {
    try {
        const { patientId, diagnosis, prescription, notes, doctorId, date } = req.body;

        if (!patientId || !diagnosis) {
            return res.status(400).json({
                success: false,
                message: 'Patient ID and diagnosis are required'
            });
        }

        const newRecord = {
            id: generateNextMedicalRecordId(),
            patientId: String(patientId).trim(),
            doctorId: doctorId ? String(doctorId).trim() : 'D001',
            diagnosis: String(diagnosis).trim(),
            prescription: prescription ? String(prescription).trim() : '',
            notes: notes ? String(notes).trim() : '',
            date: date ? String(date).trim() : new Date().toISOString().split('T')[0]
        };

        mockDB.medicalRecords.push(newRecord);

        return res.status(201).json({
            success: true,
            message: 'Medical record added successfully',
            data: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to add medical record'
        });
    }
});

// PUT update medical record
router.put('/:id', (req, res) => {
    try {
        const recordIndex = mockDB.medicalRecords.findIndex(
            (r) => String(r.id) === String(req.params.id)
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Medical record not found'
            });
        }

        const existingRecord = mockDB.medicalRecords[recordIndex];
        const { patientId, diagnosis, prescription, notes, doctorId, date } = req.body;

        const updatedRecord = {
            ...existingRecord,
            patientId: patientId !== undefined ? String(patientId).trim() : existingRecord.patientId,
            doctorId: doctorId !== undefined ? String(doctorId).trim() : existingRecord.doctorId,
            diagnosis: diagnosis !== undefined ? String(diagnosis).trim() : existingRecord.diagnosis,
            prescription: prescription !== undefined ? String(prescription).trim() : existingRecord.prescription,
            notes: notes !== undefined ? String(notes).trim() : existingRecord.notes,
            date: date !== undefined ? String(date).trim() : existingRecord.date,
            id: existingRecord.id
        };

        mockDB.medicalRecords[recordIndex] = updatedRecord;

        return res.json({
            success: true,
            message: 'Medical record updated successfully',
            data: updatedRecord
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update medical record'
        });
    }
});

// DELETE medical record
router.delete('/:id', (req, res) => {
    try {
        const recordIndex = mockDB.medicalRecords.findIndex(
            (r) => String(r.id) === String(req.params.id)
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Medical record not found'
            });
        }

        const deletedRecord = mockDB.medicalRecords.splice(recordIndex, 1)[0];

        return res.json({
            success: true,
            message: 'Medical record deleted successfully',
            data: deletedRecord
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete medical record'
        });
    }
});

module.exports = router;