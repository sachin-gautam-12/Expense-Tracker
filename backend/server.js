const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
async function ensureDataDir() {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// Initialize database file
async function initializeDB() {
    await ensureDataDir();
    try {
        await fs.access(DB_PATH);
        console.log('✅ Database file found');
    } catch {
        const initialData = {
            members: [],
            expenses: []
        };
        await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
        console.log('✅ Database file created');
    }
}

// Read database
async function readDB() {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    // Strip BOM and trim whitespace to avoid JSON.parse failures
    const data = raw.replace(/^\uFEFF/, '').trim();
    try {
        return JSON.parse(data);
    } catch (err) {
        console.error('⚠️  db.json was corrupted, resetting to defaults:', err.message);
        const defaultDB = { members: [], expenses: [] };
        await writeDB(defaultDB);
        return defaultDB;
    }
}

// Write database
async function writeDB(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// ============= ROUTES =============

// Root route - Health check
app.get('/', (req, res) => {
    res.json({
        status: '✅ Server is running',
        message: 'Expense Tracker Backend',
        endpoints: {
            members: 'GET /members, POST /members',
            expenses: 'GET /expenses, POST /expenses',
            debts: 'GET /debts',
            transactions: 'GET /transactions'
        }
    });
});

// Get all members
app.get('/members', async (req, res) => {
    try {
        const db = await readDB();
        console.log('📋 GET /members - Sending:', db.members);
        res.json(db.members);
    } catch (error) {
        console.error('❌ Error in GET /members:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add new member
app.post('/members', async (req, res) => {
    try {
        const { name } = req.body;
        console.log('📝 POST /members - Received:', name);

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name is required' });
        }

        const db = await readDB();
        const trimmedName = name.trim();

        if (db.members.includes(trimmedName)) {
            return res.status(400).json({ error: 'Member already exists' });
        }

        db.members.push(trimmedName);
        await writeDB(db);

        console.log('✅ Member added successfully. Current members:', db.members);
        res.json(db.members);
    } catch (error) {
        console.error('❌ Error in POST /members:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all expenses
app.get('/expenses', async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new expense
app.post('/expenses', async (req, res) => {
    try {
        const { paidBy, amount, description } = req.body;

        if (!paidBy || !amount || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ error: 'Amount must be positive' });
        }

        const db = await readDB();

        if (!db.members.includes(paidBy)) {
            return res.status(400).json({ error: 'Member not found' });
        }

        const expense = {
            id: Date.now().toString(),
            paidBy,
            amount: parseFloat(amount),
            description,
            date: new Date().toISOString()
        };

        db.expenses.push(expense);
        await writeDB(db);

        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get calculated debts
app.get('/debts', async (req, res) => {
    try {
        const db = await readDB();

        // Simple debt calculation
        const balances = {};
        db.members.forEach(member => balances[member] = 0);

        db.expenses.forEach(expense => {
            const paidBy = expense.paidBy;
            const amount = expense.amount;
            const splitAmount = amount / db.members.length;

            balances[paidBy] += amount;
            db.members.forEach(member => {
                if (member !== paidBy) {
                    balances[member] -= splitAmount;
                }
            });
        });

        // Convert to debts
        const debts = [];
        const debtors = [];
        const creditors = [];

        db.members.forEach(member => {
            if (balances[member] < 0) {
                debtors.push({ member, amount: Math.abs(balances[member]) });
            } else if (balances[member] > 0) {
                creditors.push({ member, amount: balances[member] });
            }
        });

        while (debtors.length > 0 && creditors.length > 0) {
            const debtor = debtors[0];
            const creditor = creditors[0];
            const amount = Math.min(debtor.amount, creditor.amount);

            if (amount > 0) {
                debts.push({
                    from: debtor.member,
                    to: creditor.member,
                    amount: Math.round(amount * 100) / 100
                });
            }

            debtor.amount -= amount;
            creditor.amount -= amount;

            if (debtor.amount < 0.01) debtors.shift();
            if (creditor.amount < 0.01) creditors.shift();
        }

        res.json(debts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get transaction history
app.get('/transactions', async (req, res) => {
    try {
        const db = await readDB();
        const transactions = db.expenses.map(expense => ({
            ...expense,
            type: 'expense'
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
initializeDB().then(() => {
    app.listen(PORT, () => {
        console.log('\n' + '='.repeat(50));
        console.log(`✅ Server is running on http://localhost:${PORT}`);
        console.log(`📁 Database: ${DB_PATH}`);
        console.log('='.repeat(50) + '\n');
        console.log('Available endpoints:');
        console.log('   GET  /          - This status page');
        console.log('   GET  /members   - Get all members');
        console.log('   POST /members   - Add a new member');
        console.log('   GET  /expenses  - Get all expenses');
        console.log('   POST /expenses  - Add a new expense');
        console.log('   GET  /debts     - Get calculated debts');
        console.log('   GET  /transactions - Get transaction history\n');
    });
}).catch(err => {
    console.error('❌ Failed to initialize:', err);
});
