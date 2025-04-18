class FinanceManager {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.form = document.getElementById('transactionForm');
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });
    }

    addTransaction() {
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const type = document.getElementById('type').value;

        const transaction = {
            id: Date.now(),
            description,
            amount,
            category,
            type,
            date: new Date().toLocaleDateString('pt-BR')
        };

        this.transactions.push(transaction);
        this.saveToLocalStorage();
        this.updateDisplay();
        this.form.reset();
    }

    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    calculateTotals() {
        return this.transactions.reduce((totals, transaction) => {
            const amount = transaction.amount;
            if (transaction.type === 'receita') {
                totals.income += amount;
            } else {
                totals.expenses += amount;
            }
            totals.balance = totals.income - totals.expenses;
            return totals;
        }, { income: 0, expenses: 0, balance: 0 });
    }

    formatCurrency(value) {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    updateDisplay() {
        const totals = this.calculateTotals();
        
        document.getElementById('totalBalance').textContent = this.formatCurrency(totals.balance);
        document.getElementById('totalIncome').textContent = this.formatCurrency(totals.income);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(totals.expenses);

        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';

        this.transactions.sort((a, b) => b.id - a.id).forEach(transaction => {
            const div = document.createElement('div');
            div.className = 'transaction-item';
            div.innerHTML = `
                <div>
                    <strong>${transaction.description}</strong>
                    <p>${transaction.category} - ${transaction.date}</p>
                </div>
                <span class="${transaction.type}">
                    ${transaction.type === 'receita' ? '+' : '-'} 
                    ${this.formatCurrency(transaction.amount)}
                </span>
            `;
            transactionList.appendChild(div);
        });
    }
}

const financeManager = new FinanceManager();