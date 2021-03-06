const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');


describe('absolute', () => {
    it('should return a positive number if input  is positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });
    
    it('should return a positve number if input  is negative', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });
    
    it('should return 0 if input  is 0', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });

});

describe('greet', () => {
    it('should return the greeting message', () => {
        const result = lib.greet('Allan');
        expect(result).toMatch(/Allan/);
        expect(result).toContain('Allan');
    });

});

describe('getCurrencies', () => {
    it('should return suported currencies', () => {
        const result = lib.getCurrencies();
       
        // Too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        // Too specific
        expect(result[0]).toBe('USD');
        expect(result[1]).toBe('AUD');
        expect(result[2]).toBe('EUR');
        expect(result.length).toBe(3);

        // Proper way
        expect(result).toContain('USD');
        expect(result).toContain('AUD');
        expect(result).toContain('EUR');

        // Ideal way
        expect(result).toEqual(expect.arrayContaining(['AUD', 'USD', 'EUR']));

    });
});

describe('getProduct', () => {
    it('shoud return the product with given id', () => {
        const result = lib.getProduct(1);
        expect(result).toMatchObject({ 'id': 1 });
        expect(result).toHaveProperty('name', 'Feijão');
    });
});

describe('registerUser', () => {
    it('should throw if username is falsy', () => {
        // null
        // undefined
        // NaN
        // ''
        // 0
        // false
        const args = [null, undefined, NaN, '', 0, false];

        args.forEach(a => {
            expect(() => { lib.registerUser(a) }).toThrow();
        });
    });

    it('should return a user object if valid username is passed', () => {
        const result = lib.registerUser('Allan');
        expect(result).toMatchObject({ username: 'Allan'});
        // or
        expect(result.id).toBeGreaterThan(0);
    });
});

describe('applyDiscount', () => {
    it('should apply 10% discount if customer has more than 10 points', () => {
        db.getCustomerSync = function(customerId) {
            console.log('Faking reading customer...');
            return {id: customerId, points: 20 };
        }

        const order = { customerId: 1, totalPrice: 10  }
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});

describe('notifyCustomer', () => {
    it('should send  an email to the customer', () => {
        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });

        mail.send = jest.fn();
        
        const order = { customerId: 1 }
        lib.notifyCustomer(order);

        expect(mail.send).toHaveBeenCalled();
        // or
        expect(mail.send).toHaveBeenCalledWith('a', '...');
    });
});

