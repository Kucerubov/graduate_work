const UserDto = require('../dtos/user-dto');

describe('UserDto', () => {
    describe('constructor', () => {
        it('should initialize the email property correctly', () => {
            const model = { email: 'test@example.com' };
            const userDto = new UserDto(model);
            expect(userDto.email).toBe(model.email);
        });

        it('should initialize the id property correctly', () => {
            const model = { id: 1 };
            const userDto = new UserDto(model);
            expect(userDto.id).toBe(model.id);
        });

        it('should initialize the isActivated property correctly', () => {
            const model = { isActivated: true };
            const userDto = new UserDto(model);
            expect(userDto.isActivated).toBe(model.isActivated);
        });

        it('should initialize the role property correctly', () => {
            const model = { role: 'user' };
            const userDto = new UserDto(model);
            expect(userDto.role).toBe(model.role);
        });
    });
});
