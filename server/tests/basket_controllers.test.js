const BasketService = require("../service/basket-service");
const BasketController = require("../controllers/basket-controller");

// Mocking the dependencies
jest.mock("../service/basket-service");

describe("BasketController", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {},
            cookies: {},
        };
        res = {
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return array of devices", async () => {
            const basketId = "basket123";
            const refreshToken = "refreshToken123";
            const arrayDevice = ["device1", "device2"];

            req.body.basketId = basketId;
            req.cookies.refreshToken = refreshToken;

            BasketService.getDeviceInBasket.mockResolvedValue(arrayDevice);

            await BasketController.getAll(req, res, next);

            expect(BasketService.getDeviceInBasket).toHaveBeenCalledWith(
                refreshToken,
                basketId
            );
            expect(res.json).toHaveBeenCalledWith(arrayDevice);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with an error if an error occurs", async () => {
            const error = new Error("Something went wrong");

            BasketService.getDeviceInBasket.mockRejectedValue(error);

            await BasketController.getAll(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe("addDeviceInBasket", () => {
        it("should add device to the basket and return data", async () => {
            const refreshToken = "refreshToken123";
            const basketId = "basket123";
            const deviceId = "device123";
            const data = { success: true };

            req.cookies.refreshToken = refreshToken;
            req.body.basketId = basketId;
            req.body.deviceId = deviceId;

            BasketService.addDeviceInBasket.mockResolvedValue(data);

            await BasketController.addDeviceInBasket(req, res, next);

            expect(BasketService.addDeviceInBasket).toHaveBeenCalledWith(
                refreshToken,
                deviceId,
                basketId
            );
            expect(res.json).toHaveBeenCalledWith(data);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with an error if an error occurs", async () => {
            const error = new Error("Something went wrong");

            BasketService.addDeviceInBasket.mockRejectedValue(error);

            await BasketController.addDeviceInBasket(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});