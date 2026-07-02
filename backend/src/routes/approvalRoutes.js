const express = require('express');
const prisma = require('../prisma');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/approvals/pending
router.get('/pending', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin or Officer access only' });
    }

    const { status } = req.query;
    const where = {};
    if (status && status !== 'All' && status !== 'all') {
      where.status = status.toUpperCase();
    } else if (!status) {
      where.status = 'PENDING';
    }

    const approvals = await prisma.approvalRequest.findMany({
      where,
      include: {
        requestedBy: true,
        documents: true
      },
      orderBy: { requestedAt: 'desc' }
    });

    return res.status(200).json(approvals);
  } catch (error) {
    console.error('Get Pending Approvals Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/approvals/:id
router.get('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin or Officer access only' });
    }

    const { id } = req.params;

    const approval = await prisma.approvalRequest.findUnique({
      where: { id },
      include: {
        requestedBy: true,
        documents: true
      }
    });

    if (!approval) {
      return res.status(404).json({ success: false, error: 'Approval request not found' });
    }

    return res.status(200).json(approval);
  } catch (error) {
    console.error('Get Approval By ID Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/approvals/:id/approve
router.post('/:id/approve', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin or Officer access only' });
    }

    const { id } = req.params;

    const approval = await prisma.approvalRequest.findUnique({
      where: { id }
    });

    if (!approval) {
      return res.status(404).json({ success: false, error: 'Approval request not found' });
    }

    // Start transaction to update both ApprovalRequest and User/Vehicle
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update ApprovalRequest status to APPROVED
      const updatedApproval = await tx.approvalRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedById: req.user.id,
          reviewedAt: new Date()
        }
      });

      // 2. Activate User accountStatus to ACTIVE
      await tx.user.update({
        where: { id: approval.requestedById },
        data: {
          accountStatus: 'ACTIVE',
          isActive: true
        }
      });

      // 3. If there is a vehicle associated with the approval request, create or verify it
      if (approval.vehiclePlate) {
        // Check if vehicle exists
        const existingVehicle = await tx.vehicle.findFirst({
          where: { plateNumber: approval.vehiclePlate }
        });

        if (existingVehicle) {
          await tx.vehicle.update({
            where: { id: existingVehicle.id },
            data: {
              status: 'ACTIVE',
              isVerified: true
            }
          });
        } else {
          // Find or fallback to a standard vehicle type ID
          let vehicleType = await tx.vehicleType.findFirst({
            where: {
              name: {
                equals: approval.vehicleTypeName || 'Car',
                mode: 'insensitive'
              }
            }
          });

          if (!vehicleType) {
            // Pick any type
            vehicleType = await tx.vehicleType.findFirst();
          }

          if (vehicleType) {
            await tx.vehicle.create({
              data: {
                plateNumber: approval.vehiclePlate,
                make: approval.vehicleMake || 'Unknown',
                model: approval.vehicleModel || 'Unknown',
                color: approval.vehicleColor || 'Unknown',
                status: 'ACTIVE',
                isVerified: true,
                customerId: approval.requestedById,
                vehicleTypeId: vehicleType.id,
                registeredByOfficerId: req.user.id
              }
            });
          }
        }
      }

      return updatedApproval;
    });

    return res.status(200).json({ success: true, approval: result });
  } catch (error) {
    console.error('Approve Request Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/approvals/:id/reject
router.post('/:id/reject', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin or Officer access only' });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const approval = await prisma.approvalRequest.findUnique({
      where: { id }
    });

    if (!approval) {
      return res.status(404).json({ success: false, error: 'Approval request not found' });
    }

    const updatedApproval = await prisma.approvalRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedById: req.user.id,
        reviewedAt: new Date(),
        rejectionReason: reason || 'Documents invalid or incomplete'
      }
    });

    return res.status(200).json({ success: true, approval: updatedApproval });
  } catch (error) {
    console.error('Reject Request Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
