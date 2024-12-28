const db = require('../config/database');
const { validateGroup } = require('../utils/validation');

exports.createGroup = async (req, res) => {
  try {
    const { error } = validateGroup(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, memberIds } = req.body;
    const userId = req.user.id;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [result] = await connection.execute(
        'INSERT INTO groups (name, created_by) VALUES (?, ?)',
        [name, userId]
      );

      const groupId = result.insertId;
      const memberValues = [userId, ...memberIds].map(memberId => [groupId, memberId]);
      
      await connection.query(
        'INSERT INTO group_members (group_id, user_id) VALUES ?',
        [memberValues]
      );

      await connection.commit();
      res.status(201).json({ id: groupId, name });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const [groups] = await db.execute(`
      SELECT g.*, 
        COUNT(DISTINCT gm.user_id) as memberCount,
        COALESCE(SUM(e.amount), 0) as totalExpense
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      LEFT JOIN expenses e ON g.id = e.group_id
      WHERE gm.user_id = ?
      GROUP BY g.id
      LIMIT ? OFFSET ?
    `, [req.user.id, limit, offset]);

    const [totalCount] = await db.execute(
      'SELECT COUNT(*) as total FROM group_members WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      groups,
      total: totalCount[0].total,
      currentPage: page,
      totalPages: Math.ceil(totalCount[0].total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGroupDetails = async (req, res) => {
    try {
      const [group] = await db.execute(`
        SELECT g.*, 
          COUNT(DISTINCT gm.user_id) as memberCount,
          COALESCE(SUM(e.amount), 0) as totalExpense
        FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        LEFT JOIN expenses e ON g.id = e.group_id
        WHERE g.id = ? AND gm.user_id = ?
        GROUP BY g.id
      `, [req.params.id, req.user.id]);
  
      if (!group.length) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      res.json(group[0]);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.updateGroup = async (req, res) => {
    try {
      const { name } = req.body;
      const groupId = req.params.id;
  
      const [group] = await db.execute(
        'SELECT * FROM groups WHERE id = ? AND created_by = ?',
        [groupId, req.user.id]
      );
  
      if (!group.length) {
        return res.status(403).json({ message: 'Not authorized to update this group' });
      }
  
      await db.execute(
        'UPDATE groups SET name = ? WHERE id = ?',
        [name, groupId]
      );
  
      res.json({ message: 'Group updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.deleteGroup = async (req, res) => {
    try {
      const groupId = req.params.id;
  
      const [group] = await db.execute(
        'SELECT * FROM groups WHERE id = ? AND created_by = ?',
        [groupId, req.user.id]
      );
  
      if (!group.length) {
        return res.status(403).json({ message: 'Not authorized to delete this group' });
      }
  
      const connection = await db.getConnection();
      await connection.beginTransaction();
  
      try {
        await connection.execute('DELETE FROM expense_splits WHERE expense_id IN (SELECT id FROM expenses WHERE group_id = ?)', [groupId]);
        await connection.execute('DELETE FROM expenses WHERE group_id = ?', [groupId]);
        await connection.execute('DELETE FROM group_members WHERE group_id = ?', [groupId]);
        await connection.execute('DELETE FROM groups WHERE id = ?', [groupId]);
  
        await connection.commit();
        res.json({ message: 'Group deleted successfully' });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };