const { Brand } = require("../models/models");
const BrandController = require("../controllers/brand-controller");

// Mocking the dependencies
jest.mock("../models/models");

describe("BrandController", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a new brand and return it", async () => {
            const brandName = "Samsung";
            const createdBrand = { id: 1, name: brandName };

            req.body.name = brandName;

            Brand.create.mockResolvedValue(createdBrand);

            await BrandController.create(req, res, next);

            expect(Brand.create).toHaveBeenCalledWith({ name: brandName });
            expect(res.json).toHaveBeenCalledWith(createdBrand);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with an error if an error occurs", async () => {
            const error = new Error("Something went wrong");

            Brand.create.mockRejectedValue(error);

            await BrandController.create(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe("getAll", () => {
        it("should return all brands", async () => {
            const brands = [{ id: 1, name: "Samsung" }, { id: 2, name: "Apple" }];

            Brand.findAll.mockResolvedValue(brands);

            await BrandController.getAll(req, res, next);

            expect(Brand.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(brands);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with an error if an error occurs", async () => {
            const error = new Error("Something went wrong");

            Brand.findAll.mockRejectedValue(error);

            await BrandController.getAll(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});